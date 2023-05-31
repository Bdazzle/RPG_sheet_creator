import React, { createContext, CSSProperties, useEffect, useReducer, useState } from "react";
import { SheetData, CharacterData, CustomSheetData, SheetTypes, SheetStats } from "./types/RPGtypes";
import { templateStyleReducer, themeReducer, ThemeVars } from "./reducers/styleReducers";
import { WoD5EdefaultTemplates } from './World of Darkness/templateDefaults'
import { makeSheetObj } from "./pages/sheet_creator";
// import { makeSheetObj } from "./functions/makeSheets";
// import { makeSheetObj } from "./pages/sheet_creator";

export interface AppContextProps {
  signedInWithGoogle: boolean,
  setSignedInWithGoogle: React.Dispatch<React.SetStateAction<boolean>>
  theme: ThemeVars,
  dispatchTheme: React.Dispatch<string>,
  isMobile: boolean,
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
  character: CharacterData<SheetData | CustomSheetData | {}, any>,
  setCharacter: React.Dispatch<React.SetStateAction<CharacterData<SheetData | CustomSheetData | {}, any>>>,
  saveCharacterStat: (data: object) => void,
  saveTemplate: (data: object) => void,
  userID: string | undefined,
  setUserID: React.Dispatch<React.SetStateAction<string | undefined>>,
  setToken: React.Dispatch<React.SetStateAction<string | void>>,
  token: string | void,
  templateStyle: { [key: string]: CSSProperties },
  replaceStat: (newVal: string, position: number, statType: keyof SheetStats) => void
}

export const AppContext = createContext({} as AppContextProps)

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
    // templateData: WoD5EdefaultTemplates["Vampire 5th Edition"],
    // characterInfo: makeSheetObj(WoD5EdefaultTemplates["Vampire 5th Edition"].stat_block, {}),
    character_uuid: undefined
  })
  const [templateStyle, dispatchTemplateStyle] = useReducer(templateStyleReducer, {})
  const [userID, setUserID] = useState<string>()
  const [token, setToken] = useState<string | void>()
  const [signedInWithGoogle, setSignedInWithGoogle] = useState<boolean>(false)

  useEffect(() => {
    if ((character.templateData as SheetData).template) {
      dispatchTemplateStyle((character.templateData as SheetData).template)
    }
  }, [(character.templateData as SheetData).template])

  const saveCharacterStat = (data: object): void => {
    setCharacter({ ...character, characterInfo: data })
  }

  const saveTemplate = (data: object): void => {
    setCharacter((character: CharacterData<SheetTypes, any>) => ({
      ...character,
      templateData: {
        ...character.templateData,
        ...(data as SheetData)
      }
    }))
  }

  /*
  called only if preexisting System option is chosen, but Game option is Custom
  */
  const replaceStat = (newVal: string, position: number, statType: keyof SheetStats) => {
    const newStatArray = ((character.templateData as SheetData).stat_block as SheetStats)[statType].map((oldVal, i) => i === position ? newVal : oldVal)
    
    setCharacter({
      ...character,
      characterInfo:{
        ...character.characterInfo,
        [statType] : newStatArray.reduce<{ [key: string]: any }>((obj, key) =>{
          obj[key] = character.characterInfo[statType][key] ? character.characterInfo[statType][key] : null
          return obj
        },{})
      },
      templateData: {
        ...character.templateData,
        stat_block: { ...((character.templateData as SheetData).stat_block as SheetStats), [statType]: newStatArray }
      }
    })
    
    // console.log(`replace ${statType} with ${newVal} at ${position}`)
    // console.log(newStatArray)
  }
  
console.log('chracter', character)
// console.log('tempalte data',(character.templateData as SheetData))
  return <AppContext.Provider value={{
    signedInWithGoogle: signedInWithGoogle,
    setSignedInWithGoogle: setSignedInWithGoogle,
    theme: theme,
    dispatchTheme: dispatchTheme,
    isMobile: isMobile,
    setIsMobile: setIsMobile,
    character: character,
    setCharacter: setCharacter,
    saveCharacterStat: saveCharacterStat,
    saveTemplate: saveTemplate,
    userID: userID,
    setUserID: setUserID,
    setToken: setToken,
    token: token,
    templateStyle: templateStyle,
    replaceStat: replaceStat
  }}>{children}</AppContext.Provider>
}