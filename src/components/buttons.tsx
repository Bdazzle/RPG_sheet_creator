import React, { useState } from 'react'
// import './button.css'
/* 
Requires CSS attached to classes so that if a box/pip w/value > or < styles can be removed for any pip in that range.
so can't use inline styles?
*/

type RadioButton = {
    value: number
    stat: string | undefined
    checkStat: (val: number) => void
}

export const Radio: React.FC<RadioButton> = ({ checkStat, value, stat = "" }) => {
    const [selected, setSelected] = useState<boolean>(false)

    function handleClick() {
        setSelected(!selected)
        checkStat(value)
    }

    return (
        <div key={stat + value + `radio-container`} className="modern-radio-container" onClick={() => handleClick()}>
            <div key={stat + value + `radio-outer`} 
            className={`${stat.split(' ').join('') + value} radio-outer-circle ${!selected && "unselected"}`}>
                <div key={stat + value + `radio-inner`} className={`${stat.split(' ').join('') + value}inner radio-inner-circle ${!selected && "unselected-circle"} `} 
                />
            </div>
        </div>
    )
}
