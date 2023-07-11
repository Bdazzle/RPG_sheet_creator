import React, { useContext } from 'react';
import { WoD5EOverlay } from "../World of Darkness/WoD5EOverlay"
import { WoDOverlay } from '../World of Darkness/WoDOverlay';
import { CustomSheetData, SheetData } from '../types/RPGtypes.js'
import { AppContext } from '../AppContext';
/*
SheetScreen will save character info, not sheet info, that will be provided, or saved by Cropping Tool.
*/


const SheetScreen: React.FC= ({}) => {
  const { theme, character } = useContext(AppContext)

  return (
    <>
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

export default SheetScreen