import React, { useContext, useEffect } from 'react';
import { WoD5EOverlay } from "../World of Darkness/WoD5EOverlay"
import { WoDOverlay } from '../World of Darkness/WoDOverlay';
import { Link, useLocation } from "react-router-dom";
import { CustomSheetData, SheetData } from '../types/RPGtypes.d.js'
import { AppContext } from '../AppContext';
/*
SheetScreen will save character info, not sheet info, that will be provided, or saved by Cropping Tool.
*/

export interface CharacterSheetTemplate {
  setPath: (path: string) => void
  addCharacterName: (characterName: string) => void
}

export const SheetScreen: React.FC<CharacterSheetTemplate> = ({ setPath }) => {
  let location = useLocation()
  const { theme, character } = useContext(AppContext)

  useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname, setPath])

  return (
    <>
      <h2 className='page_route_text'
        style={{
          marginBottom: 0
        }}>
        Character Sheet
      </h2>
      <div style={{ lineHeight: 1.5 }}>This is the Sheet screen. <br />
        It's used to make changes to your character as you play. <br />
        The <Link to={'/creator'} className="link_text"
          style={{
            color: theme.color,
            textDecoration: 'underline'
          }}
        > Creator </Link> screen is used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template.<br />
        The <Link to={'/editor'} className="link_text"
          style={{
            color: theme.color,
            textDecoration: 'underline'
          }}>Editor</Link> screen is used to edit your custom character sheet from images you upload.
      </div>
      {/* {sheet.system === "Custom" &&
        <>
          <label htmlFor='character_name'>Character Name:</label>
          <input id='character_name' style={{ width: '25%' }} onChange={(e) => addCharacterName(e.target.value)}></input>
        </>
      } */}
      {(character.templateData as SheetData | CustomSheetData).system !== "Custom" ?
        <div style={{
          height: '100vh',
          width: '100vw',
          position: "relative",
          backgroundSize: "100%",
          background: `url(${(character.templateData as SheetData).sheet_url as string}) no-repeat `
        }}>
          <div key="sheet" id="sheet"
          itemScope itemType="http://schema.org/CreativeWork"
            style={{
              position: "absolute",
              top: 20,
              minWidth: '672px',
              minHeight: '869px',
              color: 'black'
            }}>
            {
              (character.templateData as SheetData).system === "World of Darkness 5th Edition" ?
                <WoD5EOverlay game={(character.templateData as SheetData).template as string} ></WoD5EOverlay>
                :
                (character.templateData as SheetData).system === "World of Darkness" ?
                  <WoDOverlay game={(character.templateData as SheetData).template as string} ></WoDOverlay>
                  : ''
            }
          </div>
        </div> : ''
      }
    </>
  )
}
