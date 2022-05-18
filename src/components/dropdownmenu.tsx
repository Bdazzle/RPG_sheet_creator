import React, { useEffect, useState, useContext, CSSProperties } from "react"
import { AppContext } from '../AppContext'
import './dropdownmenu.css'

interface DropMenu {
    inputList: string[];
    className: string;
    changeFunction: (val: string) => void;
    labelText: string;
    style: CSSProperties;
    defaultValue?: string;
    onScrollEnd?: () => void
}

export const DropDownMenu: React.FC<DropMenu> = ({ inputList, className, changeFunction, labelText, defaultValue, style, onScrollEnd }) => {
    const [focused, setFocused] = useState<boolean>(false)
    const [droppedHeight, setDroppedHeight] = useState<number>(0)
    const [currentHover, setCurrentHover] = useState<number>()
    const { theme } = useContext(AppContext)
    const classSelector = className.split(' ').join('')
    const {marginTop, ...parentStyles} = style
    /*
    height is equal to combined height of all list items (since long item text may take up multiple lines)
    or the current selection height
    */
    useEffect(() => {
        const height = focused ? Array.from(document.querySelectorAll(`.${classSelector}item`)).reduce((acc, curr) => curr.clientHeight + acc, 0)
            : document.querySelector(`.${classSelector}_selection`) && document.querySelector(`.${classSelector}_selection`)!.clientHeight > 18 ? document.querySelector(`.${classSelector}_selection`)!.clientHeight
                : 18
        setDroppedHeight(height)
    }, [focused, classSelector])

    function scrolled(e: React.UIEvent<HTMLDivElement, UIEvent>) {
        e.preventDefault()
        const target = e.target as HTMLDivElement
        if (target.offsetHeight + target.scrollTop > target.scrollHeight) {
            onScrollEnd && onScrollEnd()
        }
    }
   
    return (
        <div style={parentStyles}>
            <div>{labelText}</div>
            <div id="selection_container" style={{
                display: 'flex',
                flexDirection: 'row',
                border: `1px solid ${theme.color}`,
                borderRadius: focused ? `5px 5px 0px 0px` : 5,
                width: 200,
                boxShadow: `0px 2px 2px 0px rgba(0,0,0,0.3)`
            }}
                onClick={() => setFocused(!focused)}
            >
                <div className={`${className}_selection`} style={{
                    marginLeft: 5,
                    flexGrow: 1,
                    minHeight: 18,
                }}>{defaultValue}</div>
                <i style={{
                    marginRight: 5,
                    marginTop: 5,
                    height: 1,
                    width: 1,
                    borderStyle: `solid`,
                    borderColor: theme.color,
                    borderWidth: `0 2px 2px 0`,
                    display: `inline-block`,
                    padding: `2px`,
                    transform: `rotate(45deg)`,
                    right: 0,
                }}></i>
            </div>
            {
            focused &&
                <div className={`menu-container${theme.scheme}`} style={{
                    overflow: focused ? 'none' : 'hidden scroll',
                    alignContent: 'center',
                    position:'absolute',
                    marginTop: style.marginTop,
                    height: droppedHeight,
                    maxHeight: 20 * 18,
                    width: 200,
                    top: document.querySelector(`.${className}_selection`)! ? 18 + document.querySelector(`.${className}_selection`)!.clientHeight : 18,
                    backgroundColor: theme.backgroundColor,
                }}
                    onClick={() => setFocused(!focused)}
                    onMouseLeave={() => setFocused(false)}
                    onScroll={(e) => scrolled(e)}
                >
                    <menu id='menu-options' style={{
                        maxHeight: 20 * 18,
                        backgroundColor: theme.backgroundColor,
                        margin: 0,
                        padding: 0,
                        height: droppedHeight,
                        zIndex: style.zIndex,
                    }} >
                        {inputList.map((item, index) =>
                            <li className={`${className}item`} 
                            key={`${item}${index}`}
                                style={{
                                    borderRadius: index === inputList.length - 1 ? `0px 0px 5px 5px` : 'none',
                                    width:195,
                                    borderBottom: index === inputList.length - 1 ? `1px solid ${theme.color}` : 'none',
                                    borderLeft: `1px solid ${theme.color}`,
                                    borderRight: `1px solid ${theme.color}`,
                                    listStyleType: `none`,
                                    paddingLeft: 5,
                                    cursor: `pointer`,
                                    backgroundColor: currentHover === index ? theme.color : style.backgroundColor,
                                    color: currentHover === index ? theme.backgroundColor : theme.color
                                }}
                                onMouseDown={() => changeFunction(item)}
                                onMouseEnter={() => setCurrentHover(index)}
                            >{item}</li>)
                        }
                    </menu>
                </div>
            }
        </div>
    )
}
