import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { CustomSheetData, SheetData, SheetStats, WoDstatSection } from '../types/RPGtypes.js'
import { DropDownMenu } from '../components/dropdownmenu';
import { AppContext } from '../AppContext';
import { staticQuery } from '../graphql/queryHooks';
import { getGameSheet, getGamesList, getSystemsList } from '../graphql/queries';
// import { WoD5EdefaultTemplates } from '../World of Darkness/templateDefaults.js';

/*
Character sheet will look like:
/Character Sheet
    -/Stat Category
        -/statname : value
        or
        -/substat :{
            statname : value
        }
Data will look like:
Stat Category: [Array to turn into key:value pairs]
or Stat Category[substat] : [Array to turn into key:value pairs]
or Stat Category : { 
    substat : {
        key (perm/temp points): value
    }
}
*/
/*
recurrable?
1)if statblock[category] is an array, assign to input object as [key: array val] : value
2)if statblock[category] is not an array:
    if statblock[category][first_key] IS NOT an array, assign to input object
    if statblock[category][first_key] IS an array, recur as makeSheetObj(statblock[category], objToAssign),
    which should end up recurring as an array and assigning as step 1)
*/
export const makeSheetObj = (statblock: any, objToAssign: object): object => {
    // console.log('makeSheet', statblock)
    for (let category in statblock) {

        if (Array.isArray(statblock[category])) {

            if (!statblock[category].length) {
                // console.log('makeSheet', category, statblock[category])
                Object.assign(objToAssign, { [category]: [] })
            } else {
                const substats = (statblock[category] as string[]).reduce((acc: { [key: string]: string }, curr: string) => {
                    return { ...acc, [curr]: '' }
                }, {})
                // console.log(substats)
                Object.assign(objToAssign, { [category]: { ...substats } })
            }

        } else {
            let nest = { [category]: {} }
            Object.assign(objToAssign, nest)
            makeSheetObj(statblock[category], nest[category])
        }
    }
    return objToAssign
}

const sheet_options_style: CSSProperties = {
    position: 'relative'
}

const mobile_sheet_options_style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
}

const SheetCreator: React.FC = ({ }) => {
    const [templatesOptions, setTemplatesOptions] = useState<string[]>([]) //different sheets from each game system
    const { theme, isMobile, token, setCharacter, character, userID, saveTemplate, saveCharacterStat, replaceStat } = useContext(AppContext)
    const [systems, setSystems] = useState<string[]>([])
    const [gameData, setGameData] = useState<SheetData>()

    useEffect(() => {
        const systemList = async () => {
            try {
                if (token) {
                    let { data } = await staticQuery(getSystemsList, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                        Authorization: `Bearer ${token}`
                    }, {}, 'GetSystemsList')

                    if (data) {
                        /*
                        always include "Custom" as first option for custom sheets
                        */
                        setSystems(["Custom", ...data.templates_games.map((sys: { system: string }) => sys.system)])
                    }
                }
            } catch (err) {
                console.log('system list fetch fail', err)
            }

        }
        systemList()
    }, [token])

    /*
    1)when the system option changes, add to sheetData.system with addToSheet
    2)below useEffect triggers when system option changes, 
    with check for !undefined to prevent sheetData being set to "system:undefined" on navigation changes to preserve statefulness
    resets template choices if user changes game system
    */
    useEffect(() => {
        const gamesList = async () => {
            if ((character.templateData as SheetData | CustomSheetData).system) {
                let { data } = await staticQuery(getGamesList, process.env.REACT_APP_HASURA_ENDPOINT as string, {
                    Authorization: `Bearer ${token}`
                }, {
                    system: (character.templateData as SheetData | CustomSheetData).system
                }, 'GetGamesList')
                if (data) {
                    // setTemplatesOptions(["Custom", ...data.templates_games.map((game: { game_name: String }) => game.game_name)])
                    setTemplatesOptions([...data.templates_games.map((game: { game_name: String }) => game.game_name)])
                    //causing "Game" dropdown to show up when selecting custom system?
                }
            }
        }
        gamesList()
    }, [(character.templateData as SheetData | CustomSheetData).system])


    const systemChange = (systemOption: string) => {
        systemOption === "Custom" ? setCharacter({
            ...character,
            templateData: {
                system: systemOption,
                creatorID: userID!
            },
            characterInfo: {}
        })
            :
            setCharacter({ templateData: { system: systemOption }, characterInfo: {} })
    }

    /*
    create a new template object with storage.ref gets for logo and sheet_url before passing?  
    when template changes for non-Custom games (ex: World of Darkness, D&D, w/e)
    get background image (template.previesheet) from firebase/templates storage ref
    get logo (template.logo) from firebase/templates storage ref 
    */
    useEffect(() => {
        if (gameData) {
            saveTemplate(gameData)
        }
    }, [gameData])

    const handleGameChange = async (val: string) => {

        let { data } = await staticQuery(getGameSheet, process.env.REACT_APP_HASURA_ENDPOINT as string, {
            Authorization: `Bearer ${token}`
        }, {
            game_name: val
        }, 'GetGameSheet')
        const updatedSheetdata: SheetData = { ...(character.templateData as SheetData | CustomSheetData), ...data.templates_game_sheets[0], template: val }
        const newCharacterSheet = makeSheetObj(data.templates_game_sheets[0].stat_block, {})
        saveCharacterStat(newCharacterSheet)
        setGameData(updatedSheetdata)

    }

    return (
        <div style={{ width: '90vw', lineHeight: 1.5 }}>
            <div className="sheet_options"
                style={isMobile ? mobile_sheet_options_style : sheet_options_style}>
                {(character.templateData as SheetData).sheet_url &&
                    <img
                        alt={`blank ${(character.templateData as SheetData).template} character sheet`}
                        itemProp="image"
                        src={((character.templateData as SheetData).sheet_url as string)}
                        className="mini_sheet_preview"
                        style={{
                            width: '150px',
                            right: 0,
                            position: isMobile ? 'relative' : 'absolute',
                            boxShadow: '0px 4px 8px 0px black',
                            borderRadius: '5%',
                        }}
                    ></img>}
                <div id="sheet_form" style={{ width: '50%', marginTop: 20 }}>
                    <DropDownMenu
                        inputList={systems}
                        className={`System`}
                        changeFunction={systemChange}
                        labelText={`System (Custom to create your own)`}
                        defaultValue={(character.templateData as SheetData | CustomSheetData).system ? (character.templateData as SheetData | CustomSheetData).system as string : "--Choose a System--"}
                        style={{
                            zIndex: 9,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 250,
                            position: 'relative',
                            color: theme.color,
                            lineHeight: 1,
                            paddingBottom: 10,
                        }}
                    />
                    {(templatesOptions as string[]).length > 0 ?
                        <DropDownMenu
                            inputList={templatesOptions}
                            className={`Game`}
                            changeFunction={handleGameChange}
                            labelText={`Game`}
                            defaultValue={(character.templateData as SheetData | CustomSheetData) ? (character.templateData as SheetData)!.template as string : "--Choose a Game--"}
                            style={{
                                zIndex: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 250,
                                position: 'relative',
                                color: theme.color,
                                lineHeight: 1,
                                paddingBottom: 10,
                            }}
                        />
                        :
                        <div></div>
                    }

                    {(character.templateData as SheetData | CustomSheetData).system === "World of Darkness 5th Edition" ?
                        <div className="template_stats" style={{
                            width: '100vw',
                            maxWidth: '672px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {(character.templateData as SheetData).stat_block ? Object.entries((character.templateData as SheetData).stat_block as SheetStats).map(([key, val]) =>
                                Array.isArray(val) ?
                                    <div key={key}>
                                        <div key={`${key}_stat_title`} className="stat_title"
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                fontSize: 24
                                            }}
                                        >{key[0].toUpperCase() + key.substring(1)}</div>
                                        <div key={`${key}_stat_container`} className="stat_container"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gridAutoRows: 'minmax(50px, auto)'
                                            }}
                                        >
                                            {
                                                (character.templateData as SheetData).template.includes("Custom") ?
                                                    val.map((stat, index) => <input
                                                        key={stat}
                                                        defaultValue={stat}
                                                        onBlur={(e) => replaceStat(e.target.value, index, key)}>
                                                    </input>)
                                                    : val.map(stat => <div key={stat}>{stat}</div>)
                                            }
                                        </div>
                                    </div>
                                    : ''
                            ) : ''
                            }
                        </div> :
                        (character.templateData as SheetData | CustomSheetData).system === "World of Darkness" &&
                        <div className="template_stats" >
                            {
                                (character.templateData as SheetData)!.stat_block && Object.entries((character.templateData as SheetData)!.stat_block).map(([key, val]: [string, WoDstatSection]) =>
                                    <div key={key}>
                                        <div key={`${key}_stat_title`} className="stat_title" id={`${key}_stat_title`}
                                            style={{
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                fontSize: 24
                                            }}
                                        >
                                            {key[0].toUpperCase() + key.substring(1)}
                                        </div>
                                        <div key={`${key}_stat_container`} id={key}
                                            className={`${key === `Character Info` ?
                                                `substat_container` :
                                                key === `Other Stats` ?
                                                    `no_substats_container`
                                                    : ''}`}>
                                            {
                                                Object.entries(val as WoDstatSection).map(([key2, val2]: [string, any], pos: number) =>
                                                    (character.templateData as SheetData).template !== "Custom" ?
                                                        Array.isArray(val2) && val2.length > 0 ?
                                                            <div key={key2 + val2}>
                                                                <div key={key2} className="substat_title" style={{
                                                                    textAlign: 'center',
                                                                    fontWeight: 'bold',
                                                                    textDecoration: 'underline'
                                                                }}>
                                                                    {key2}
                                                                </div>

                                                                <div key={`${key2}_substat_container`} className='substat_container'
                                                                >
                                                                    {Array.isArray(val2) ?
                                                                        val2.map(stat => <div key={stat} id={stat}>{stat}</div>)
                                                                        : ''}
                                                                </div>
                                                            </div>
                                                            :
                                                            typeof val2 === 'object' ?
                                                                <div key={key2 + val2}>
                                                                    <div key={key2} className="substat_title" style={{
                                                                        textAlign: 'center',
                                                                    }}>
                                                                        {key2}
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div key={key2} id={key2} style={{
                                                                    textAlign: 'center'
                                                                }}>{val2}</div>
                                                        :
                                                        <input key={val2} defaultValue={val2} onBlur={(e) => replaceStat(e.target.value, pos, key)} ></input>
                                                )}
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default SheetCreator