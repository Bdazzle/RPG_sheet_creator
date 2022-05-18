import React, { CSSProperties, useContext, useEffect, useState } from "react"
import { AppContext } from "../../AppContext"
import { BurgerMenu } from "./burgerbutton"
import { IconedButton } from "../IconedButton"
import { DropDownMenu } from "../dropdownmenu"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../firebase/config"
import { CharacterSheet, Sections, SheetData, CharacterData, CustomSheetData } from "../../types/RPGtypes"
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "@apollo/client"
import { getCustomSheet, getSpecificCharacter, getUserCharacters, getUserCustomsheets } from "../../graphql/queries"
import { staticQuery } from "../../graphql/queryHooks"
import { deleteCharacter, deleteCustomSheet, insertCharacter, insertCustomsheet, updateCharacter, updateCustomsheet } from "../../graphql/mutations"

/*
check to see if templateData.system is Custom and if it is named
and validate if current user is custom sheet creator,
if no sheet creator yet, user would be sheet creator
*/
const checkSheetID = (user: string, sheetTemplate: CustomSheetData) => {
    if ((sheetTemplate.system === "Custom" && sheetTemplate.system_name) && (user === sheetTemplate.creatorID || !sheetTemplate.creatorID)) {
        return true
    } else {
        return false
    }
}

const mobileNavStyle: CSSProperties = {
    // backgroundColor: `${theme.navColor}`,
    width: '60vw',
    position: 'fixed',
    top: 15,
    marginLeft: 6,
    zIndex: 1,
    display: `flex`,
    flexDirection: `column`,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',
}

const visibileNavStyle: CSSProperties = {
    ...mobileNavStyle,
    visibility: 'visible',
    opacity: 1,
    transition: `visibility 1s, opacity 1s`
}

const hiddenMobileNav: CSSProperties = {
    ...mobileNavStyle,
    visibility: `hidden`,
    opacity: 0,
    transition: `visibility 0.3s, opacity 0.3s`
}

const navStyle: CSSProperties = {
    // backgroundColor: `${theme.navColor}`,
    width: '100%',
    position: 'fixed',
    maxHeight: 70,
    zIndex: 1,
    display: `flex`,
    flexDirection: `row`,
    justifyContent: 'space-between',
    alignItems: 'center',
}

interface NavBarProps {
    // characterLoaded: boolean,
    showSharingModal: (val: boolean) => void
}

/*THINGS TO ADD
1)Sign in and/or sign up
2)change settings in auth0 dashboard to live url

Custom Sheets
1) json stored on hasura
2) images stored on firebase
*/
// characterLoaded,
export const Navbar: React.FC<NavBarProps> = ({ showSharingModal }) => {
    const { theme, isMobile, character, setCharacter, dispatchTheme, userID, setUserID, token, setToken } = useContext(AppContext)
    const { loginWithPopup, logout } = useAuth0();
    const [customSheetsList, setCustomSheetsList] = useState<string[]>([])//add newly created sheets to this
    const [characterList, setCharacterList] = useState<string[]>([])
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [addCharacter] = useMutation(insertCharacter)
    const [updateChar] = useMutation(updateCharacter)
    const [addCustomSheet] = useMutation(insertCustomsheet)
    const [updateCustom] = useMutation(updateCustomsheet)
    const [charDelete] = useMutation(deleteCharacter)
    const [customSheetDelete] = useMutation(deleteCustomSheet)

    /*
    sheet text/json or w/e (anything other than image) saved to hasura
    image saved to firebase
    */
    const saveCustomSheet = async () => {
        if (checkSheetID(userID as string, character.templateData)) {
            /*
            save image to firebase
            */
            const metaData = {
                customMetadata: {
                    'creatorID': `${userID}`,
                    'sharedWith': `${character.sharedWith && [...character.sharedWith as string[]]}`
                }
            }
            const customSheetImage = ref(storage, `users/${userID}/Custom_Sheets/${character.templateData.system_name}_sheet`)
            /*
            convert file path (blob:...) from objectURL passed from File selected from Canvas components to Blob
            to be stored in firebase. image from file path must be fetched, then converted.
            */
            const imageBlob: Blob = await (await fetch(character.characterInfo.image)).blob()

            if (character.characterInfo.image !== 'string') {
                let uploadedImage = await uploadBytes(customSheetImage, imageBlob as Blob, { ...metaData, contentType: 'image/jpeg' })
                let firebase_snapshot = await getDownloadURL(uploadedImage.ref)
                /*
                save sheet info to hasura
                get new list of custom sheets after saving
                create a sheet_uuid if new, set to character.templateData.sheet_uuid
                shared_with has to be json for regex matching non-creator users
                */
                /*
                update existing custom sheet 
                */
                if (character.templateData.sheet_uuid) {
                    let { data } = await updateCustom({
                        variables: {
                            sheet_uuid: character.templateData.sheet_uuid,
                            firebase_img_uri: firebase_snapshot,
                            sections: JSON.stringify(character.characterInfo.sections),
                            shared_with: JSON.stringify(character.sharedWith),
                            system_id: character.templateData.system_name
                        }
                    })
                    console.log('updated sheet', data)
                }
                else {
                    /*
                    add custom sheet
                    */
                    let { data } = await addCustomSheet({
                        variables: {
                            creator: userID,
                            firebase_img_uri: firebase_snapshot,
                            sections: JSON.stringify(character.characterInfo.sections),
                            shared_with: JSON.stringify(character.sharedWith),
                            system_id: character.templateData.system_name
                        }
                    })
                    // console.log('new custom sheet', data)
                    if (data !== undefined) {
                        setCharacter({
                            ...character,
                            templateData: {
                                ...character.templateData,
                                sheet_uuid: data.insert_custom_sheets.returning[0].sheet_uuid
                            }
                        })
                    }
                }
            }
            getCustomSheetList()
        } else {
            alert('Your Game System needs a name!')
        }
    }

    /*
    character object in db needs uuid to identify character row, in case user changes character name(character_id) on sheet
    on conflict, update character_id, stats with new values from user
    */
    const saveCharacter = async () => {
        if (userID) {
            const characterName = (): string => {
                if ((character as CharacterData<SheetData, string>).templateData.system === "Custom" && character.templateData.system_name) {
                    /*
                    check for name field in characterInfo.sections keys, else characterInfo.character_name
                    */
                    if (character.characterInfo.character_name && (character.characterInfo.character_name as string).length >= 1) {
                        return character.characterInfo.character_name as string
                    }
                    else {
                        return Object.keys(character.characterInfo.sections).map(key =>
                            key.toLowerCase() === "name" && (character.characterInfo.sections as Sections)[key].value.current
                        )[0] as string
                    }

                }
                else {
                    return ((character?.characterInfo as CharacterSheet<any>)['Character Info'])['Name'] as string
                }
            }

            if (characterName()) {
                // console.log('character',character.templateData.sheet_uuid)
                /*
                update existing character
                stats different for template vs custom sheet
                */
                if (character.character_uuid) {

                    let { data } = await updateChar({
                        variables: {
                            character_uuid: character.character_uuid,
                            character_id: characterName(),
                            stats: character.templateData.system === "Custom" ? JSON.stringify(character.characterInfo.sections) : JSON.stringify(character.characterInfo)
                        }
                    })
                    console.log('updated character', data)
                }
                /*
                add character
                stats different for template vs custom sheet
                */
                else {

                    let { data } = await addCharacter({
                        variables: {
                            character_id: characterName(),
                            stats: character.templateData.system === "Custom" ? JSON.stringify(character.characterInfo.sections) : JSON.stringify(character.characterInfo),
                            system: character.templateData.system === "Custom" ? character.templateData.system_name : character.templateData.system,
                            template: character.templateData.system === "Custom" ? "Custom" : character.templateData.template,
                            user_id: userID,
                            sheet_uuid: character.templateData.sheet_uuid
                        }
                    })
                    console.log('new character', data)
                    if (data !== undefined) {
                        setCharacter({ ...character, character_uuid: data.insert_characters.returning[0].character_uuid })
                        getCharacterList()
                        // setCharacterList([...characterList, data.character_id])
                    }
                    // console.log('new character', data)
                }

            } else {
                alert('Your character has no name!')
            }

        }
    }

    /*
    1) get custom sheets that user has created
    2)get custom sheets that have been shared with user
    add field to user row tracking what custom sheets have been shared with them?
    */
    const getCustomSheetList = async () => {
        try {
            const { data } = await staticQuery(getUserCustomsheets, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                Authorization: `Bearer ${token}`,
                "X-Hasura-User-Id": userID
            }, {
                user_id: userID
            }
                , 'GetUserCustomsheets')
            if (data) {
                const { custom_sheets, shared_custom_sheets } = data
                const combinedList = [...custom_sheets.map((cs: { system_id: any }) => cs.system_id), ...shared_custom_sheets.map((scs: { system_id: any }) => scs.system_id)]
                setCustomSheetsList(combinedList)
            }
        }
        catch (err) {
            console.info(`error getting custom sheets list ${err}`)
        }
    }

    useEffect(() => {
        if (token) {
            getCharacterList()
            getCustomSheetList()
        }
    }, [token])

    const getCharacterList = async () => {
        if (token) { setToken(token) }
        const userCharacters = await staticQuery(getUserCharacters, process.env.REACT_APP_HASURA_ENDPOINT as string, {
            Authorization: `Bearer ${token}`
        }, {
            email: userID
        }, 'GetUserCharacters')
        if (!userCharacters.errors) {
            let { characters } = userCharacters.data
            setCharacterList(characters.map((char: { character_id: string }) => char.character_id))
        }
    }

    /*
    load character will only be called after app loads, so will have access to token that is set in this file from getCharacterList
    */
    const loadCharacter = async (characterName: string) => {
        if (characterName) {
            const specificChar = await staticQuery(getSpecificCharacter, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                Authorization: `Bearer ${token}`
            }, {
                character_id: characterName,
                user_id: userID
            }, 'GetSpecificCharacter')
            console.log('loaded char', specificChar)

            if (!specificChar.errors) {
                const { character_uuid, stats, system, template, character_id } = specificChar.data.characters[0]

                if (template === "Custom") {
                    let { data: { custom_sheets: [info] } } = await staticQuery(getCustomSheet, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                        Authorization: `Bearer ${token}`
                    }, {
                        system_id: system
                    }, 'GetCustomSheet')
                    setCharacter({
                        templateData: {
                            creatorID: info.creator,
                            system_name: system,
                            system: template,
                            image: specificChar.data.characters[0].characterTocustomsheet.firebase_img_uri
                        } as Partial<CustomSheetData>,
                        characterInfo: {
                            character_name: character_id,
                            sections: JSON.parse(stats),
                            image: specificChar.data.characters[0].characterTocustomsheet.firebase_img_uri
                        },
                        character_uuid: character_uuid,
                    })
                }
                else {
                    setCharacter({
                        templateData: {
                            system: system,
                            template: template,
                            sheet_url: specificChar.data.characters[0].characterTosheet.sheet_url
                        } as SheetData,
                        characterInfo: JSON.parse(stats),
                        character_uuid: character_uuid,
                        character_name: character_id
                    })
                }
            }
        }
    }

    /*
    loads custom sheets
    if user created sheet, get uuid for updates
    should reset current character data so loading from an existing character to a new custom sheet character 
    doesn't have any artifact that could accidentally save over something
    */
    const loadCustomSheet = async (option: string) => {
        if (option) {
            let { data } = await staticQuery(getCustomSheet, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                Authorization: `Bearer ${token}`,
            }, {
                system_id: option
            },
                'GetCustomSheet')
            /*
            creatorID, system, system_name -> character.templateData
            sections, image -> character.characterInfo
            sections loaded from a custom sheet need to be set in both templateData and characterInfo of character
            to track original sections set by creator (templateData)
            and character changes made by user that sheet is shared with (characterInfo)
            */
            setCharacter({
                templateData: {
                    creatorID: data.custom_sheets[0].creator,
                    system: "Custom",
                    system_name: data.custom_sheets[0].system_id,
                    sections: JSON.parse(data.custom_sheets[0].sections),
                    image: data.custom_sheets[0].firebase_img_uri,
                    sheet_uuid: userID === data.custom_sheets[0].creator ? data.custom_sheets[0].sheet_uuid : undefined
                } as CustomSheetData,
                characterInfo: {
                    sections: JSON.parse(data.custom_sheets[0].sections),
                    image: data.custom_sheets[0].firebase_img_uri
                },
                character_uuid: undefined
            })
        }
    }

    const removeCharacter = async () => {
        // let { data } = 
        await charDelete({
            variables: {
                character_uuid: character.character_uuid
            }
        })
        setCharacter({
            templateData: {},
            characterInfo: {},
            character_uuid: undefined
        })
    }

    const removeCustomSheet = async () => {
        // let { data } = 
        await customSheetDelete({
            variables: {
                sheet_uuid: character.templateData.sheet_uuid
            }
        })
        setCharacter({
            templateData: {},
            characterInfo: {},
            character_uuid: undefined,
        })
    }

    const signout = async () => {
        setUserID(undefined)
        setCharacter({ templateData: {}, characterInfo: {} })
        setCustomSheetsList([])
        logout()
    }

    // console.log('header', character)
    return (
        <>
            {isMobile &&
                <BurgerMenu barstyle={{
                    width: 30,
                    height: 4,
                    backgroundColor: theme.color,
                    margin: '0px 6px 4px 0px',
                    position: 'relative',
                }}
                    containerstyle={{
                        backgroundColor: theme.navColor,
                        display: 'inline-block',
                        cursor: 'pointer',
                        height: 17,
                        position: 'fixed',
                        width: 30,
                        top: 20,
                        zIndex: 2,
                        marginLeft: 6,
                    }}
                    onClick={() => setShowMenu(!showMenu)}
                />}
            <nav id="nav_bar"
                style={(showMenu && isMobile) ? {
                    ...visibileNavStyle,
                    backgroundColor: theme.navColor
                }
                    : (!showMenu && isMobile) ? {
                        ...hiddenMobileNav,
                        backgroundColor: theme.navColor
                    }
                        : { ...navStyle, backgroundColor: theme.navColor }}
            >
                {!userID ?
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        marginLeft: 20
                    }} >
                        <div id="sign_in_button_container">
                            <button id="sign_in_button"
                                onClick={loginWithPopup}
                            >Sign In</button>
                        </div>

                        {!isMobile && <div style={{
                            gridColumn: '1/3',
                        }}>You must be logged in to save character or custom sheets</div>}
                    </div>
                    : <div className='login_button_container'
                        style={{
                            width: `100%`,
                            display: `flex`,
                            flexDirection: isMobile ? 'column-reverse' : `row`,
                            justifyContent: `space-evenly`,
                            alignItems: 'center'
                        }}>
                        {checkSheetID(userID as string, character.templateData) &&
                            <IconedButton
                                style={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                hoverStyle={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textDecoration: 'underline',
                                    opacity: .7
                                }}
                                svgDimensions={{
                                    width: 60,
                                    height: 30,
                                }}
                                text="Save Custom Sheet"
                                paths={["M 22 44 L 24 44 L 24 20 L 30 24 L 23 11 L 16 24 L 22 20 M 19 28 L 7 28 C 3 26 2 21 7 18 C 4 9 10 8 16 10 C 21 2 30 4 33 10 C 40 8 43 16 39 18 C 44 20 44 27 39 28 L 27 28 L 27 26 L 38 26 C 42 25 41 20 37 18 C 41 15 39 10 32 12 C 29 6 21 5 17 12 C 11 10 6 11 9 18 C 4 21 4 25 9 26 L 19 26"]}
                                viewBox="-10 0 50 35"
                                onClick={saveCustomSheet}
                            />
                        }
                        {Object.values(character.characterInfo).length > 0 &&
                            <IconedButton
                                style={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                hoverStyle={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textDecoration: 'underline',
                                    opacity: .7
                                }}
                                svgDimensions={{
                                    width: 60,
                                    height: 30,
                                }}
                                text="Save Character"
                                paths={["M 22 44 L 24 44 L 24 20 L 30 24 L 23 11 L 16 24 L 22 20 M 19 28 L 7 28 C 3 26 2 21 7 18 C 4 9 10 8 16 10 C 21 2 30 4 33 10 C 40 8 43 16 39 18 C 44 20 44 27 39 28 L 27 28 L 27 26 L 38 26 C 42 25 41 20 37 18 C 41 15 39 10 32 12 C 29 6 21 5 17 12 C 11 10 6 11 9 18 C 4 21 4 25 9 26 L 19 26"]}
                                viewBox="-10 0 50 35"
                                onClick={saveCharacter}
                            />
                        }
                        {
                            character.character_uuid && <IconedButton
                                style={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                hoverStyle={{
                                    cursor: `pointer`,
                                    backgroundColor: theme.navColor,
                                    color: theme.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textDecoration: 'underline',
                                    opacity: .7
                                }}
                                svgDimensions={{
                                    width: 40,
                                    height: 30,
                                }}
                                text="Delete Character"
                                paths={["M 72.002 10.915 H 17.998 c -3.134 0 -5.675 2.541 -5.675 5.675 v 7.049 h 65.354 V 16.59 C 77.677 13.456 75.136 10.915 72.002 10.915 z",
                                    "M 57.546 15.544 H 32.454 c -1.42 0 -2.571 -1.151 -2.571 -2.571 V 6.19 c 0 -3.413 2.777 -6.19 6.19 -6.19 h 17.854 c 3.413 0 6.191 2.777 6.191 6.19 v 6.782 C 60.117 14.392 58.966 15.544 57.546 15.544 z M 35.026 10.401 h 19.949 V 6.19 c 0 -0.578 -0.47 -1.047 -1.048 -1.047 H 36.073 c -0.578 0 -1.047 0.47 -1.047 1.047 V 10.401 z",
                                    "M 74.016 28.782 H 15.984 v 55.543 c 0 3.134 2.541 5.675 5.675 5.675 h 46.682 c 3.134 0 5.675 -2.541 5.675 -5.675 V 28.782 z M 31.915 79.328 c 0 1.42 -1.151 2.571 -2.571 2.571 c -1.42 0 -2.571 -1.151 -2.571 -2.571 V 41.509 c 0 -1.42 1.151 -2.571 2.571 -2.571 c 1.42 0 2.571 1.151 2.571 2.571 V 79.328 z M 47.571 79.328 c 0 1.42 -1.151 2.571 -2.571 2.571 s -2.571 -1.151 -2.571 -2.571 V 41.509 c 0 -1.42 1.151 -2.571 2.571 -2.571 s 2.571 1.151 2.571 2.571 V 79.328 z M 63.228 79.328 c 0 1.42 -1.151 2.571 -2.571 2.571 c -1.42 0 -2.571 -1.151 -2.571 -2.571 V 41.509 c 0 -1.42 1.151 -2.571 2.571 -2.571 c 1.42 0 2.571 1.151 2.571 2.571 V 79.328 z"
                                ]}
                                viewBox="-30 0 100 100"
                                onClick={removeCharacter}
                            />
                        }
                        {characterList && <DropDownMenu
                            style={{
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                width: isMobile ? 200 : 250,
                                position: 'relative',
                                color: theme.color,
                                marginTop: 18,
                                backgroundColor: theme.navColor ? theme.navColor : `rgb(244,244,244)`,
                            }}
                            labelText={`Load your Character`}
                            inputList={characterList}
                            className={`Load your Character`}
                            defaultValue={character.character_name ? character.character_name : character.characterInfo.character_name}
                            changeFunction={loadCharacter}
                            onScrollEnd={() => getCharacterList()} />}
                        <div id='custom_sheet_options_container'
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: isMobile ? 200 : 250,
                            }}>
                            {customSheetsList && <DropDownMenu
                                style={{
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    color: theme.color,
                                    marginTop: 18,
                                    backgroundColor: theme.navColor ? theme.navColor : `rgb(244,244,244)`
                                }}
                                labelText={`Custom Sheets`}
                                inputList={customSheetsList}
                                className={`Custom Sheets`}
                                defaultValue={character.templateData.system_name as string}
                                changeFunction={loadCustomSheet}
                                onScrollEnd={() => getCustomSheetList()} />}

                            {(!checkSheetID(userID, character.templateData) && character.templateData.creatorID) &&
                                <div style={{
                                    width: isMobile ? 200 : 300,
                                    fontFamily: 'Roboto'
                                }}>Created by {character.templateData.creatorID}</div>
                            }
                        </div>
                        {checkSheetID(userID, character.templateData) &&
                            <>
                                <IconedButton
                                    style={{
                                        cursor: `pointer`,
                                        backgroundColor: theme.navColor,
                                        color: theme.color,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    hoverStyle={{
                                        cursor: `pointer`,
                                        backgroundColor: theme.navColor,
                                        color: theme.color,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'underline',
                                        opacity: .7,
                                    }}
                                    svgDimensions={{
                                        width: 60,
                                        height: 30,
                                    }}
                                    text="Share Custom Sheet"
                                    paths={["M 44 5 A 1 1 0 0 0 44 9 L 44 11 C 39 11 39 3 44 3 C 49 3 49 11 44 11 L 44 9 A 1 1 0 0 0 44 5 M 44 21 A 1 1 0 0 0 44 25 L 44 27 C 39 27 39 19 44 19 C 49 19 49 27 44 27 M 44 25 A 1 1 0 0 0 44 21 M 29 13 A 1 1 0 0 0 29 17 L 29 19 C 24 19 24 11 29 11 C 34 11 34 19 29 19 L 29 17 A 1 1 0 0 0 29 13 M 42 9 L 32 14 L 31 12 L 41 7 M 32 15 L 42 21 L 41 23 L 31 17"]}
                                    viewBox="-10 0 50 35"
                                    onClick={() => showSharingModal(true)}
                                />
                                <div>

                                </div>
                                <IconedButton
                                    style={{
                                        cursor: `pointer`,
                                        backgroundColor: theme.navColor,
                                        color: theme.color,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    hoverStyle={{
                                        cursor: `pointer`,
                                        backgroundColor: theme.navColor,
                                        color: theme.color,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textDecoration: 'underline',
                                        opacity: .7,
                                    }}
                                    svgDimensions={{
                                        width: 60,
                                        height: 30,
                                    }}
                                    text="Delete Custom Sheet"
                                    children={[
                                        <g key="delete_icon" xmlns="http://www.w3.org/2000/svg" >
                                            <path d="M 30.548 89.646 l 57.97 -33.877 c 0.434 -0.282 0.61 -0.718 0.607 -1.373 C 88.355 29.93 78.382 14.441 61.383 6.943 c -0.477 -0.217 -1.306 -0.059 -1.935 0.268 L 1.647 40.956 L 30.548 89.646 z"
                                                style={{ fill: 'rgb(187,201,220)' }}
                                            />
                                            <path d="M 28.632 89.765 L 3.847 75.455 c -1.839 -1.062 -2.972 -3.024 -2.972 -5.148 l 0 -27.834 c 0 -1.352 1.393 -2.273 2.63 -1.727 c 16.999 7.498 26.972 22.987 27.742 47.453 C 31.29 89.562 29.814 90.447 28.632 89.765 z"
                                                style={{ fill: "rgb(145,161,185)" }}
                                            />
                                            <path d="M 63.841 80.505 l 2.995 -1.714 c -1.626 -5.212 -6.578 -9.356 -13.016 -12.799 l -3.38 1.952 C 57.338 70.886 62.197 74.63 63.841 80.505 z"
                                                style={{ fill: "rgb(231,235,242)" }}
                                            />
                                            <path d="M 69.643 77.046 l 2.995 -1.714 c -1.626 -5.212 -6.578 -9.356 -13.016 -12.799 l -3.38 1.952 C 63.14 67.427 67.999 71.171 69.643 77.046 z"
                                                style={{ fill: "rgb(231,235,242)" }}
                                            />
                                            <path d="M 75.142 73.706 l 2.995 -1.714 c -1.626 -5.212 -6.578 -9.356 -13.016 -12.799 l -3.38 1.952 C 68.639 64.087 73.498 67.832 75.142 73.706 z"
                                                style={{ fill: "rgb(231,235,242)" }}
                                            />
                                            <path d="M 81.25 70.419 l 2.995 -1.714 c -1.626 -5.212 -6.578 -9.356 -13.016 -12.799 l -3.38 1.952 C 74.748 60.799 79.607 64.544 81.25 70.419 z"
                                                style={{ fill: "rgb(231,235,242)" }}
                                            />
                                            <path d="M 44.431 59.472 L 70.16 44.618 c 0.643 -0.371 0.992 -1.114 0.842 -1.842 C 68.02 28.312 58.267 19.793 44.678 15.834 L 16.062 32.516 c 13.237 3.856 22.585 12.04 25.803 25.83 C 42.132 59.488 43.415 60.059 44.431 59.472 z"
                                                style={{ fill: "rgb(145,161,185)" }}
                                            />
                                            <path d="M 46.412 71.302 c -0.172 0 -0.341 -0.09 -0.433 -0.25 c -0.139 -0.239 -0.057 -0.545 0.183 -0.683 l 28.894 -16.682 c 0.238 -0.138 0.545 -0.057 0.683 0.183 c 0.139 0.239 0.057 0.545 -0.183 0.683 L 46.662 71.234 C 46.583 71.28 46.497 71.302 46.412 71.302 z"
                                                style={{ fill: "rgb(145,161,185)" }}
                                            />
                                            <ellipse cx="85.227" cy="51.586" rx="1.047" ry="1.766"
                                                style={{ fill: "rgb(145,161,185)" }}
                                            />
                                            <ellipse cx="81.267" cy="53.745999999999995" rx="1.047" ry="1.766"
                                                style={{ fill: "rgb(145,161,185)" }}
                                            />
                                            <path d="M 23.964 35.579 L 52.756 18.97 c -1.89 -0.923 -3.72 -1.714 -5.453 -2.297 L 18.831 33.406 C 20.599 34.103 22.348 34.786 23.964 35.579 z"
                                                style={{ fill: "rgb(129,146,171)" }}
                                            />
                                            <polygon points="46.75,22.43 23.96,35.58 22.06,34.74 22.06,14.25 46.75,0 "
                                                style={{ fill: "rgb(231,235,242)" }}
                                            />
                                        </g>
                                    ]}
                                    viewBox="-30 0 140 105"
                                    onClick={removeCustomSheet}
                                />
                            </>
                        }
                        <button onClick={signout}>Sign Out</button>
                    </div>
                }
                {!isMobile &&
                    <div style={{
                        display: 'flex',
                        margin: 20,
                        width: 90,
                        justifyContent: 'space-between'
                    }}>
                        <a rel="noreferrer" target="_blank" href="https://github.com/Bdazzle/RPG_sheet_generator">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <div id="theme_button_container" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: 25,
                            width: 60,
                            border: `1px solid`,
                            borderRadius: '2px',
                            boxShadow: `0px 0px 2px`,
                            justifySelf: 'flex-end'
                        }}>
                            <button id="dark_theme_button" className="dark theme_button" value='dark' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
                            <button id="light_theme_button" className="light theme_button" value='light' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
                            <button id="pink_theme_button" className="pink theme_button" value='pink' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
                        </div>
                    </div>
                }

            </nav>
        </>
    )
}