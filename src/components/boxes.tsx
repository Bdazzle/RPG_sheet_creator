import React, { useState } from 'react';
// import './boxes.css'
/* 
Requires CSS attached to classes so that if a box/pip w/value > or < styles can be removed for any pip in that range.
so can't use inline styles?
*/
type Box = {
    value: number;
    stat: string
    checkStat: (val: number) => void;
}

export const CheckBox: React.FC<Box> = ({ checkStat, value, stat }) => {
    const [selected, setSelected] = useState<boolean>(false);

    function handleClick() {
        setSelected(!selected)
        checkStat(value)
    }

    return (
        <div key={stat + value + `checkbox-container`}
            className="modern-checkbox-container"
            onClick={() => handleClick()}>
            <div key={stat + value + `checkbox-outer`}
                className={`${stat.split(' ').join('') + value} checkbox-outer-square ${!selected && "unselected"}`}
            >
                <div key={stat + value + `checkbox-inner`}
                    className={`${stat.split(' ').join('') + value}inner checkbox-inner-square ${!selected && "unselected-square"}`}
                />
            </div>
        </div >
    )
}

