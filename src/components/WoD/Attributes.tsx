import React, { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../../AppContext"
import { radioFill } from "../../functions/radioButtons"
import { AttributeFields, WoD5eStatCategory } from "../../types/RPGtypes"
import { Radio } from "../buttons"

const AttributesFields: React.FC<WoD5eStatCategory> = ({ rows, fields, max, category, categoryHeads, addToCharacter }) => {
    const { templateStyle } = useContext(AppContext)
    const fieldKeys = Object.keys(fields)
    const columns: string[][] = [...Array(Math.ceil(fieldKeys.length / rows))].map((_, i) => fieldKeys.slice(i * rows, i * rows + rows))
    const attributePoints: number[] = [...Array(max)].map((_, i) => 1 + i)

    return (
        <div id={`${category}_container`}>
            <div key={`${category}_title`} style={templateStyle.section_header} className="section_header">{category.toUpperCase()}</div>
            <div key={`${category}_category`} id={`${category}_category`} style={templateStyle[`${category}_category`]}>
                {/* <div key={category + "_category"} id={`${substat}_category`} style={WoDStyles[`${(substat as string).toLowerCase()}_category`]}> */}
                {columns.map((val, i) => {
                    return (
                        <div
                            key={category + ' column' + val}
                            className={category + ' column'}
                            style={templateStyle[category]}>
                            {categoryHeads ? <div style={templateStyle.sub_category_header} className="sub_category_header" key={categoryHeads[i]}>{categoryHeads[i]}</div> : null}
                            {val.map(el => {
                                return (
                                    <AttributeRow savedValue={fields[el]} key={el + "row"} name={el} max={attributePoints} addToCharacter={addToCharacter} category={category} />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
const AttributeRow: React.FC<AttributeFields> = ({ savedValue, name, max, addToCharacter, category, substat}) => {
    const [current, setCurrent] = useState<number>(0)
    const { templateStyle } = useContext(AppContext)

    useMemo(() => {
        setCurrent(savedValue)
        radioFill(max, savedValue, name, "circle")
    }, [])

    function checkStat(val: number) {
        if (current === val) {
            substat? addToCharacter(name, val - 1, category, substat) : addToCharacter(name, val - 1, category)
        } else {
            substat? addToCharacter(name, val, category, substat) : addToCharacter(name, val, category)
        }
        setCurrent(val)
        radioFill(max, val, name, "circle")
    }

    useEffect(() => {
        radioFill(max, current, name, "circle")
    }, [current])

    return (
        <div key={name} id={name} className={`points`} style={templateStyle[`${category}_points`]}>
            <div key={`${category}_name`}
                className={`${category}_name`}
                // style={templateStyle[`${category.toLowerCase()}_name`]}
                style={templateStyle.attributes_name}
            >
                {name}
            </div>
            <div key={category + "_button_container"}
                className="button-container"
                style={templateStyle.button_container}>
                {max.map(i => {
                    return (
                        <Radio key={name + "radio" + i} checkStat={checkStat} value={i} stat={name} />
                    )
                })}
            </div>
        </div>
    )
}
// //if(val>curr)..., if(val<curr)..., if(val=curr). conditions to generically consider for displaying pips.
// const AttributeRow: React.FC<AttributeFields> = ({ savedValue, name, max, addToCharacter, category }) => {
//     // const [current, currentDispatch] = useReducer(currentReducer, 0)
//     const { templateStyle } = useContext(AppContext)
//     const [current, setCurrent] = useState<number>(0)

//     useEffect(() => {
//         // currentDispatch(savedValue)
//         setCurrent(savedValue)
//         radioFill(max, savedValue, name, "circle")
//     }, [])

//     function checkStat(val: number) {
//         current === val ? addToCharacter(name, val - 1, category) : addToCharacter(name, val, category)
//         // currentDispatch(val)
//         setCurrent(val)
//         radioFill(max, val, name, "circle")
//     }

//     return (
//         <div key={name} id={name} className={`${category}_points`} style={templateStyle[`${category}_points`]}>
//             <div key={`${category}_name`} className={`${category}_name`} style={templateStyle[`${category}_name`]}>{name}</div>
//             <div key={category + "_button_container"} className="button_container" style={templateStyle.button_container}>
//                 {max.map(i => {
//                     return (
//                         <Radio key={name + "radio" + i} checkStat={checkStat} value={i} stat={name} />
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }