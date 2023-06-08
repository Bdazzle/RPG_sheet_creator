
interface StatLayers {
    val: string | number | object,
    statName: string //bottom layer
}

interface WoDStat extends StatLayers {
    category?: string, //layer 1
    subCategory?: string, //layer 2
}

export type WoDStatAction = {
    type: string,
    payload: WoDStat
}

export const WoDreducer = (state: { [key: string]: any }, action: WoDStatAction) => {
    switch (action.type) {
        case 'update_stat': {
            const { category, subCategory, statName, val } = action.payload;
            let newState = { ...state }
            if (subCategory && category) {
                newState = {
                    ...newState,
                    [category]: {
                        ...newState[category],
                        [subCategory]: {
                            ...newState[category][subCategory],
                            [statName]: val
                        }
                    }
                }
            } else if (category) {
                newState = {
                    ...newState,
                    [category]: {
                        ...newState[category],
                        [statName]: val
                    }
                }
            } else {
                newState = {
                    ...newState,
                    [statName]: val
                }
            }
            return newState
        };
    /*
    character[layer1][layer2][layer3?] : val, ex:character[Advantages][Disciplines][x] : val as object{1:..., 2:...}?
    or ex:character[Advantages][Gifts] : [val] as string[]?
    or ex:character[Advantages][Arts]:{val:x} as object? if pips
    */
        case 'delete_stat': {
            const { category, statName } = action.payload
            let newState = { ...state }
            console.log(category, statName)
            if (category && newState[category]) {
                if (Array.isArray(newState[category][statName])) {
                    newState[category][statName] = newState[category][statName].filter(
                        (item: string) => item !== action.payload.val
                    );
                } else {
                    delete newState[category][statName]
                    if (Object.keys(newState[category]).length === 0) {
                        delete newState[category];
                    }
                }
            } else {
                delete newState[statName]
            }
            return newState
        }
        default: return state;
    }
}

// export type WoD5EStatAction = {
//     type: string,
//     payload: WoD5Estat
// }

// export const WoD5Ereducer = (state: { [key: string]: any }, action: WoD5EStatAction) =>{
//     switch(action.type) {
//         case "update_stat" : {
//             const { category, statName, val } = action.payload;
//             if (category) {
//                 return {
//                     ...state,
//                     [category] :{
//                         ...state[category],
//                         [statName] : val
//                     }
//                 }
//             } else {
//                 return {
//                     ...state,
//                     [statName] : val
//                 }
//             }
//         }
//         case "delete_stat" :{
//             const { category, statName } = action.payload;
//             return delete state.characterInfo[statName]
//         }
//         default: return state
//     }
// }