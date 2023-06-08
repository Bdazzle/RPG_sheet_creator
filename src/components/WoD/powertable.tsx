
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { radioFill } from '../../functions/radioButtons';
import { AddToCharacter, RemoveFromCharacter, SheetData } from '../../types/RPGtypes';
import { Radio } from '../buttons';

export type Advantages = {
    [key: string]: {
        [key: number]: string
    }
}

export type TableStyles = {
    headerStyle?: CSSProperties,
    tableStyle?: CSSProperties
}

export interface PowersTableProps {
    savedPowers: PowerLevels | string[]
    hasPips: boolean
    totalcells: number;
    powerType: string;
    maxlevels: number;
    addToCharacter: AddToCharacter<string | string[] | number>
    removeFromCharacter: RemoveFromCharacter<string | string[] | number>
    category?: string,
}

export type PowerLevels = [string, string[]]

export interface PowersCellsProps {
    savedPowers?: PowerLevels | string[],
    hasPips: boolean
    maxlevel: number;
    addPower: (levelName: string[], powerTitle?: string) => void;
    removePower: (attr: string) => void;
    cellheight: number;
    cellwidth: number;
}
//savedPowers.length()/totalcells for ex:Gifts or one big Powertable
//set either max rows (ex: totalcells/2) for smaller width columns, or set columns (ex: totalcells/3) for additional cells that would run off sheet
export const PowersTable: React.FC<PowersTableProps> = ({ savedPowers, hasPips, totalcells, powerType, maxlevels, addToCharacter, removeFromCharacter, category }) => {
    const { templateStyle } = useContext(AppContext)
    const fieldsArr = [...Array(totalcells)].map((_, i) => i)//1 +
    //divide gridHeight by 2 to create 2 row. may have to be static, since each column css is styled to this as default
    const gridHeight: number = 650
    //divide gridWidth by totalcells/2, 2 in this case being amount of rows
    const gridWidth: number = 510
    const gridCellWidth: string = `${gridWidth / (totalcells / 2)}px `

    useEffect(() => {
        if (hasPips) {
            fieldsArr.forEach((num) => {
                addToCharacter([], ' ', powerType)
            })
        }

    }, [])

    /*
    2 conditions:
    !hasPips: should just add a list to character.characterInfo[powertype] = [...levelNames]
         except in WoD, it's characterInfo[category][powertype]
    hasPips: should add power title or level name to character.characterInfo[powertype][powerTitle] : [...levelNames]
    */
    const addPower = (levelNames: string[], powerTitle?: string) => {
        if (hasPips) {
            if (powerTitle) {
                addToCharacter(levelNames, powerTitle, powerType)
            }
            else {
                addToCharacter(levelNames, powerType)
            }

        }
        if (category) {
            if (powerTitle) {
                addToCharacter(levelNames, powerTitle, powerType, category)
            } else {
                addToCharacter(levelNames, powerType, category)
            }
        }

    }

    const removePower = (val: string) => {
        category ? removeFromCharacter(val, powerType, category as string,) : removeFromCharacter(val, powerType)
        console.log('remove', category, val, powerType)
    }

    /*
    fieldsArr starts @ 1, so indexes would be num-1
    */
    return (
        <div className='power-table' >
            {powerType &&
                <div key={powerType + "title"}
                    style={templateStyle.section_header}
                    className="section_header">
                    {powerType}
                </div>
            }
            <div className='power-container'
                style={{
                    ...templateStyle.powers_container,
                    gridTemplateColumns: gridCellWidth.repeat(gridWidth / (gridWidth / (totalcells / 2)))
                }}>
                {fieldsArr.map(num =>
                    savedPowers ?
                        <PowersCells
                            savedPowers={hasPips ? Object.entries(savedPowers)[num] as PowerLevels : savedPowers as string[]}
                            key={'power' + num}
                            hasPips={hasPips}
                            maxlevel={maxlevels}
                            addPower={addPower}
                            removePower={removePower}
                            cellheight={gridHeight / totalcells}
                            cellwidth={gridWidth / (totalcells / 2)}
                        />
                        :
                        <PowersCells
                            key={'power' + num}
                            hasPips={hasPips}
                            maxlevel={maxlevels}
                            addPower={addPower}
                            removePower={removePower}
                            cellheight={gridHeight / totalcells}
                            cellwidth={gridWidth / (totalcells / 2)}
                        />
                )
                }
            </div>
        </div>
    )
}

/*
if no pips, typing in a power name causes text to render in different input?
*/
const PowersCells: React.FC<PowersCellsProps> = ({ savedPowers, hasPips, maxlevel, addPower, removePower, cellwidth, cellheight }) => {
    const { templateStyle, character } = useContext(AppContext)
    const [powerLevels, setPowerLevels] = useState<PowerLevels | string[]>([])
    const [current, setCurrent] = useState<number>(0)
    const powerPoints: number[] = [...Array(maxlevel)].map((_, i) => i)
    const [powerName, setPowerName] = useState<string>()// powerName exists as parent/header for powerLevels, ex: [powerName] :[...powerLevels]

    /* 
    if !hasPips : savedPowers = string[]. If powers have no pips, it's just a list.
    if hasPips : savedPower = [string, string[]]. if powers has pips, [powerName, [...powerlevels]]
    */
    useEffect(() => {
        if (hasPips && savedPowers) {
            const [savedName, savedLevels] = savedPowers as PowerLevels
            if (savedName) {
                setPowerName(savedName)
                setPowerLevels(!savedLevels ? [] : savedLevels)
                setCurrent(!savedLevels ? 0 : savedLevels.length -1)
            }
        } else {
            setPowerLevels(savedPowers as string[])
        }
    }, [])

    /*
    as current goes up (num <= current), add numbers less than current to state, unless it already exists
    as current goes down (num > current), remove numbers greater than current from state
    if powerLevels doesn't already have an ability name @ powerLevels[num], add [num] : ''
    else if num > current, delete from powerLevels
    */
    useEffect(() => {
        if (powerName && current > 0) {
            radioFill(powerPoints, current, powerName, "circle")
        }
    }, [current])

    /*
    adds name that powerLevels : string[] is a part of, like a header
    */
    function onNameInput(text: string) {
        if (text) {
            setPowerName(text)
            addPower(powerLevels as string[], text)
        } else {
            removePower(text)
        }
    }

    /*
    changes array of powernames that appear as inputs.
    */
    function onLevelNameChange(text: string, powerLevelIndex: number) {
        let newPowers = powerLevels
        if (text) {
            newPowers[powerLevelIndex] = text
        }
        else {
            newPowers.splice(powerLevelIndex, 1)
        }
        setPowerLevels(newPowers)
    }

    useEffect(() => {
        if (powerLevels && powerLevels.length) {
            if (!powerName) {
                addPower(powerLevels as string[])
            } else {
                addPower(powerLevels as string[], powerName)
            }
        }
    }, [powerLevels])

    /*
     for powers with hasPips. 
     if val === current, remove a pip (val-1)
     when we go up in pips, add slots to powerLevels (num <= clickedCurrent)
     when we go down in pips, remove that index from powerLevels (num > clickedCurrent)? not necessary?
    */
    function checkStat(val: number) {
        const clickedCurrent = current === val ? val - 1 : val
        let newPowerLevels = powerLevels || []
        setCurrent(clickedCurrent)
        if (powerName) {
            powerPoints.forEach((_, i) => {
                if(i <= clickedCurrent && !newPowerLevels[i]){
                    newPowerLevels[i] = '';
                }
            })
            setPowerLevels(newPowerLevels)
        }
    }
    
    //power_header height and each text input height = cellHeight/maxlevel+ 1
    return (
        <div key="power-cell-container" className="power-cell-container"
            style={
                (character.templateData as SheetData).system === "World of Darkness 5th Edition" ?
                    {
                        ...templateStyle.power_cell_container,
                        width: cellwidth,
                        height: cellheight,
                    }
                    :
                    templateStyle.power_cell_container
            }>
            {
                hasPips ?
                    <>
                        <div key="power-header"
                            className="power-header"
                            style={templateStyle.pips_power_header}
                        >
                            <input defaultValue={powerName}
                                key={powerName}
                                type="text"
                                className="power-group"
                                style={
                                    (character.templateData as SheetData).system === "World of Darkness 5th Edition" ?
                                        {
                                            ...templateStyle.power_group,
                                            height: cellheight / (maxlevel + 1),
                                            width: Math.round(cellwidth * (2 / 3) - 2)
                                        }
                                        :
                                        {
                                            ...templateStyle.power_group,
                                            width: Math.round(cellwidth * (2 / 3))
                                        }
                                }
                                onBlur={(e) => onNameInput(e.target.value)}>
                            </input>
                            <div key="power_button_container"
                                className="button-container"
                                style={templateStyle.button_container}>
                                {
                                    powerPoints.map(num => <Radio
                                        key={"power_radio_button" + num}
                                        value={num}
                                        checkStat={checkStat}
                                        stat={powerName}
                                    ></Radio>)
                                }
                            </div>
                        </div>
                    </>
                    :
                    <div key="power_header" className="power_header"
                        style={templateStyle.power_header}>
                        {
                            powerLevels && powerPoints.map((_, i) =>
                                <input
                                    defaultValue={powerLevels[i] as string}
                                    name={powerLevels[i] as string + String(i)}
                                    key={"power point" + i}
                                    className={"power-name"}
                                    style={templateStyle.power_name}
                                    onChange={(e) => { onLevelNameChange(e.target.value, i) }}
                                >

                                </input>)
                        }
                    </div>
            }
            {
                (character.templateData as SheetData).system === "World of Darkness 5th Edition" && powerPoints.map(num =>
                    <input
                        defaultValue={powerLevels ? powerLevels[num] : ''}
                        name={powerName as string + String(num)}
                        key={"power point" + num}
                        className={"power-point"}
                        style={{
                            ...templateStyle.power_point,
                            height: cellheight / (maxlevel + 1)
                        }}
                        onBlur={(e) => onLevelNameChange(e.target.value, num)}>
                    </input>
                )
            }
        </div >
    )
}