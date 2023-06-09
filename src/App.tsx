import React, { useContext, useCallback, useState, useMemo, CSSProperties, useEffect, useRef } from 'react';
import './App.css';
import { ShareModal } from './components/modals/sharemodal';
import { Navbar } from './components/navbar/navheader';
import { SheetCreator } from "./pages/sheet_creator"
import { SheetScreen } from "./pages/sheetScreen"
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import CanvasEditor from "./CanvasEditor/CanvasEditor"
import { SheetEditor } from "./pages/sheet_editor"
import { Sections, SheetData, CharacterData, CustomSheetData, SheetTypes } from './types/RPGtypes.d.js'
import { AppContext } from './AppContext';
import { IconedButton } from './components/IconedButton';
import { useDebouncedCallback } from 'use-debounce';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@apollo/client';
import { insertShares, insertUser } from './graphql/mutations';
import { staticQuery } from './graphql/queryHooks';
import { Routes } from 'react-router';
import { getExistingUser } from './graphql/queries';
import { auth } from './firebase/config';

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
}
const mobileHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
}
/*
App Login/Save flow:
1)OAth2/Google, get user email
2)user email as userID
3)getCustomSheets, getsharedCustomSheets, getCharacterList
*/
export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>()
  const [scale, setScale] = useState<number>()
  const [showSharingModal, setshowSharingModal] = useState<boolean>(false)
  const { theme, dispatchTheme, isMobile, setIsMobile, character, setCharacter, userID, setUserID,
    setToken, signedInWithGoogle, setSignedInWithGoogle } = useContext(AppContext)
  const { user, getAccessTokenSilently } = useAuth0();
  const [addUser] = useMutation(insertUser)
  const [updateSharedUsers] = useMutation(insertShares, {
    context: {
        headers: {
            "X-Hasura-User-Id": userID
        }
    }
})
const nameref = useRef<HTMLInputElement>(null)

useEffect(() =>{
  if(character.characterInfo.character_name){
    nameref.current!.value = character.characterInfo.character_name
  }
},[character.characterInfo.character_name])

/* 
used for Auth0
remove this useEffect, make normal function so that it doesn't trigger when signed in with Google 
*/
  useEffect(() => {
    if (user) {
      let validateUser = async () => {
        const token = await getAccessTokenSilently().catch((err) => console.log(err))
        if (token) { setToken(token) }
        const existingUser = await staticQuery(getExistingUser, process.env.REACT_APP_HASURA_ENDPOINT as string, {
          Authorization: `Bearer ${token}`
        }, {
          email: user.email
        }, "GetExistingUser")

        if (existingUser.data.users.length === 0) {
          addUser({
            variables: {
              email: user.email,
              username: user.nickname,
            }
          })
        }
      }
      validateUser()
      setUserID(user!.email)
      if(signedInWithGoogle) {
        auth.signOut()
        setSignedInWithGoogle(false)
      }
    }

  }, [user])

  const saveTemplate = useCallback((selections: CustomSheetData) => {
    if (selections.system && selections.system !== (character.templateData as CustomSheetData).system) {
      setCharacter({ ...character, templateData: selections })
    }
    /*
    selections.sections will only be for custom sheets, as sections will contain coordinates and labels for them.
    */
    setCharacter((character: CharacterData<SheetTypes, any>) => ({ ...character, characterInfo: { ...character.characterInfo, ...selections } }))
  }, [character])

  const saveCurrentPath = useCallback((path: string) => {
    setCurrentPath(path.substring(1))
    const newScale = path.substring(1) === 'creator' ? .5 : 1
    setScale(newScale)
  }, [])

  const addCharacterName = (characterName: string) => {
    if (characterName.length >= 1) {
      if ((character.templateData as SheetData | CustomSheetData).system === "Custom") {
        setCharacter({...character,
          characterInfo:{
            ...character.characterInfo,
            character_name: characterName
          }
        })
      }
    }
  }

  const addShareUsers = async (sharedUsers: string[]) => {
    if ((character.templateData as CustomSheetData).sheet_uuid) {
      sharedUsers.forEach(async (userEmail) =>{
        let { data } = await updateSharedUsers({
          variables: {
            creator_id: userID,
            sheet_id: (character.templateData as CustomSheetData).sheet_uuid,
            system_id: (character.templateData as CustomSheetData).system_name,
            user_id: userEmail
          }
        })
      })

      setshowSharingModal(false)
      setCharacter({ ...character, sharedWith: sharedUsers })
    } else {
      alert('Save your Custom sheet before sharing')
    }
  }

  const addCharacterNotes = (textEvent: React.ChangeEvent<HTMLTextAreaElement>) => {
    textEvent.preventDefault()
    setCharacter({
      ...character,
      characterInfo: {
        ...character.characterInfo,
        character_notes: textEvent.target.value
      }
    })
  }

  useMemo(() => {
      document.body.style.setProperty("background-color", theme.backgroundColor);
      document.body.style.setProperty("color", theme.color);
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
      document.querySelectorAll('.navigation_button').forEach((node) => {
        (node as HTMLAnchorElement).style.setProperty("color", theme.color)
      })
  }, [theme])

  const handleResize = useDebouncedCallback(() => setIsMobile(window.innerWidth as number <= 640), 200)

  useEffect(() => {
    setIsMobile(window.innerWidth as number <= 640)
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar
        showSharingModal={setshowSharingModal}
      />
      {isMobile &&
        <div>
          <a rel="noreferrer" target="_blank" href="https://github.com/Bdazzle/RPG_sheet_generator" style={{
            position: 'absolute',
            right: 85
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <div id="theme_button_container" style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'row',
            height: 25,
            width: 60,
            border: `1px solid`,
            borderRadius: '2px',
            boxShadow: `0px 0px 2px`,
            right: 10,
            zIndex: 2,
          }}>
            <button aria-label="dark theme" id="dark_theme_button" className="dark theme_button" value='dark' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
            <button aria-label="light theme" id="light_theme_button" className="light theme_button" value='light' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
            <button aria-label="pink theme" id="pink_theme_button" className="pink theme_button" value='pink' onClick={(e) => dispatchTheme(e.currentTarget.value)}></button>
          </div>
        </div>
      }
      <div className="main_container">
        <Router >
          <div className="creator_link_container" style={
            isMobile ? mobileHeaderStyle : headerStyle
          }>
            <Link to={currentPath === 'creator' ? "sheet"
              : currentPath === 'editor' ? "sheet"
                : "creator"}
              className="navigation_button">
              <IconedButton
                style={{
                  color: theme.backgroundColor,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '105px',
                  backgroundColor: theme.color,
                  borderRadius: 5,
                }}
                hoverStyle={{
                  color: theme.backgroundColor,
                  backgroundColor: theme.color,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '105px',
                  textDecoration: 'underline',
                  opacity: .7,
                  borderRadius: 5,
                }}
                svgDimensions={{
                  width: 16,
                  height: 16
                }}
                text={currentPath === 'creator' ? "Sheet"
                  : currentPath === 'editor' ? "Sheet"
                    : "Creator"}
                viewBox="0 0 512 512"
                paths={["M500.5 231.4l-192-160C287.9 54.3 256 68.6 256 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2zm-256 0l-192-160C31.9 54.3 0 68.6 0 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2z"]}
              />
            </Link>
            <h1 style={{
              width: '313px',
              height: '35px',
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: isMobile ? 0 : 10,
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: isMobile ? '24px' : '36px',
            }}>RPG sheet creator</h1>
            <Link to={currentPath === 'creator' ? "editor" :
              currentPath === 'editor' ? "creator"
                : "editor"
            }
              className="navigation_button">
              <IconedButton
                style={{
                  color: theme.backgroundColor,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '107px',
                  backgroundColor: theme.color,
                  borderRadius: 5,
                }}
                hoverStyle={{
                  color: theme.backgroundColor,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '107px',
                  textDecoration: 'underline',
                  opacity: .7,
                  backgroundColor: theme.color,
                  borderRadius: 5,
                }}
                svgDimensions={{
                  width: 16,
                  height: 16
                }}
                text={currentPath === 'creator' ? "Editor" :
                  currentPath === 'editor' ? "Creator"
                    : "Editor"}
                viewBox="0 0 512 512"
                paths={["M500.5 231.4l-192-160C287.9 54.3 256 68.6 256 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2zm-256 0l-192-160C31.9 54.3 0 68.6 0 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2z"]}
              />
            </Link>
          </div>
          <Routes>
            <Route path="/creator" element={
              <SheetCreator
                setPath={saveCurrentPath}
                savedTemplate={character.templateData as SheetData}
              />
            }
            />
            <Route path="/" element={
              <SheetCreator
                setPath={saveCurrentPath}
                savedTemplate={character.templateData as SheetData}
              />
            }
            />
            <Route path="/sheet" element={
              <SheetScreen 
              addCharacterName={addCharacterName} 
              setPath={saveCurrentPath} 
              />
            } />
            <Route path="/editor" element={
              <SheetEditor 
              setPath={saveCurrentPath} 
              />
            }>
            </Route>
          </Routes>
          <div>
          {(character.templateData as SheetData | CustomSheetData).system === "Custom" &&
        <>
          <label htmlFor='character_name'>Character Name: </label>
          <input ref={nameref} id='character_name' style={{ width: '25%' }} onChange={(e) => addCharacterName(e.target.value)}></input>
        </>
      }
            {(character.templateData as CustomSheetData).system === "Custom" && currentPath !== 'sheet' &&
              <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                <label>System Name: </label>
                { (character.templateData as CustomSheetData).creatorID === userID ?
                <input id="system_name" key={(character.templateData as CustomSheetData).system_name as string} 
                defaultValue={(character.templateData as CustomSheetData).system_name as string} 
                type="text"
                  onBlur={(e) => setCharacter({
                    ...character,
                    templateData: {
                      ...character.templateData,
                      "system_name": e.target.value
                    }
                  })}
                />
                :
                <div>
                  {(character.templateData as CustomSheetData).system_name}
                </div>
}
              </div>
            }
          </div>
        </Router>
        {
          showSharingModal === true && 
          <ShareModal 
          showSharingModal={showSharingModal} 
          setSharing={setshowSharingModal} 
          addUsers={addShareUsers} 
          savedCharacter={character as CharacterData<SheetData, any>} 
          />
        }

        {
          character.templateData && (character.templateData as CustomSheetData).system === "Custom" &&
          <CanvasEditor
            savedimageUri={ character.characterInfo.image}
            savedSections={character.characterInfo && character.characterInfo.sections as Sections}
            storeSections={saveTemplate}
            scale={scale}
            editorMode={currentPath}
            system_name={(character.templateData as CustomSheetData).system_name as string}
          />
        }
      </div>
      {(character.templateData as CustomSheetData).system &&
        <div id="notes_container" style={{ display: 'flex', flexDirection: 'column', bottom: 0 }}>
          <label htmlFor="character_notes">Character Notes</label>
          <textarea onChange={(e) => addCharacterNotes(e)}
            defaultValue={character.characterInfo && character.characterInfo.character_notes}
            style={{ maxHeight: '100vh', maxWidth: '95vw' }}>
          </textarea>
        </div>
      }
    </>
  )
}
