
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
            
            if(!statblock[category].length){
                // console.log('makeSheet', category, statblock[category])
                Object.assign(objToAssign, {[category] :[]})
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

