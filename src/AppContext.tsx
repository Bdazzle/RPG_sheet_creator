import React, { CSSProperties, useReducer, useState } from "react";
import rainbow from './Icons/rainbow.jpeg'
import { SheetData, CharacterData, CustomSheetData } from "./types/RPGtypes";

export const AppContext = React.createContext<any>(null)

const themeReducer = (state: CSSProperties, action: string) => {
  switch (action) {
    case "light":
      return {
        backgroundColor: `#ffffff`,
        color: `#000000`,
        backgroundImage: `none`,
        scheme: 'light',
        scrollColor: `rgb(145, 145, 145)`,
        navColor: `rgb(244,244,244)`,
      };
    case "dark":
      return {
        backgroundColor: `rgb(24,24,24)`,
        color: `#ffffff`,
        backgroundImage: `none`,
        scheme: 'dark',
        scrollColor: `#ffffff`,
        navColor: `#454545`
      };
    case "pink":
      return {
        backgroundColor: `rgb(237,225,243)`,
        color: `#ff5858`,
        backgroundImage: rainbow,
        scheme: 'pink',
        scrollColor: `#FFC3F5`,
        navColor: `rgb(244,203,237)`
      };
    default:
      return state;
  }
};

// const characterReducer = (state : CharacterData<SheetData | CustomSheetData | {}, any>, action: string, field: string) =>{
//     switch (action) {

//     }
// }

export const AppProvider: React.FC = ({ children }) => {
  const [theme, dispatchTheme] = useReducer(themeReducer, {
    backgroundColor: `#ffffff`,
    color: `#000000`,
    backgroundImage: `none`,
    scheme: 'light',
    scrollColor: `rgb(145, 145, 145)`
  })
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [character, setCharacter] = useState<CharacterData<SheetData | CustomSheetData | {}, any>>({ 
    templateData: {}, 
    characterInfo: {}, 
    character_uuid: undefined 
  })
  const [userID, setUserID] = useState<string>()
  const [token, setToken] = useState<string | void>()

// console.log('token', token)

  return <AppContext.Provider value={{
    theme: theme,
    dispatchTheme: dispatchTheme,
    isMobile: isMobile,
    setIsMobile: setIsMobile,
    character: character,
    setCharacter: setCharacter,
    userID:userID,
    setUserID: setUserID,
    setToken: setToken,
    token: token,
  }}>{children}</AppContext.Provider>
}