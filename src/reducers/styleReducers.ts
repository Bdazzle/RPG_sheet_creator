import { CSSProperties } from "react";
import WoD5Estyles from "../styles/WoD5EStyles";
import WoDStyles from "../styles/WoDStyles";
import rainbow from '../Icons/rainbow.jpeg'

export interface ThemeVars {
    [key: string]: string
  }

export const templateStyleReducer = (state: { [key: string]: CSSProperties }, action: string) => {
    switch (action) {
      case "Werewolf The Apocalypse":
        return WoDStyles;
      case "Vampire 5th Edition":
        return WoD5Estyles;
      case "Custom World of Darkness 5E":
        return WoD5Estyles;
      default:
        return state;
    }
  }

 export const themeReducer = (state: ThemeVars, action: string) => {
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