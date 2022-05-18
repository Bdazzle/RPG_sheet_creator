import { CSSProperties, useState } from "react"

interface Burger {
    barstyle: CSSProperties,
    containerstyle: CSSProperties,
    onClick: () => void,
  }

export const BurgerMenu: React.FC<Burger> = ({ barstyle, containerstyle, onClick }) => {
    const [isClicked, setIsClicked] = useState<boolean>()
  
    const handleClick = (): void => {
      onClick()
      setIsClicked(!isClicked)
    }
  
    return (
      <div id="menu" style={containerstyle} onClick={() => handleClick()}>
        <div id="bar1" style={
          isClicked ? {
            ...barstyle,
            transition: 'all .5s ease-in-out',
            transform: `rotate(45deg) translate(40%)`,
          } : barstyle
        }></div>
        <div id="bar2" style={
          isClicked ? {
            ...barstyle,
            transition: 'opacity .3s',
            opacity: 0,
          } : barstyle
        }></div>
        <div id="bar3" style={isClicked ? {
          ...barstyle,
          transition: 'all .5s ease-in-out',
          transform: `rotate(-45deg) translate(40%)`,
        } : barstyle}></div>
      </div>
    )
  }