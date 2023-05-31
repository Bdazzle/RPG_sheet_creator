import { SheetData, CharacterData, SheetStats } from "../types/RPGtypes";

// const replaceStat = (newVal: string, position: number, statType: keyof SheetStats) => {
//     const newStatArray = ((character.templateData as SheetData).stat_block as SheetStats)[statType].map((oldVal, i) => i === position ? newVal : oldVal)
//     setCharacter({
//       ...character,
//       templateData: {
//         ...character.templateData,
//         stat_block: { ...((character.templateData as SheetData).stat_block as SheetStats), [statType]: newStatArray }
//       }
//     })
//   }

// console.log('add', layer1, bottomLayer, val)
        // if (layer1) {
        //     saveCharacter({
        //         ...savedCharacter,
        //         [layer1]: {
        //             ...savedCharacter![layer1] as object,
        //             [bottomLayer]: val
        //         }
        //     }, `character`)
        // }
        // else {
        //     saveCharacter({ ...savedCharacter, [bottomLayer]: val }, `character`)
        // }

type CustomStatAction = {
    type: string,
    payload: {
        newVal: string,
        position: number,
        statType: keyof SheetStats
    }
}

const customStatReducer = (state: any, action: CustomStatAction) => {

}