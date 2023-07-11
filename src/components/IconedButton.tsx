import React, { CSSProperties, useState } from "react";

interface ButtonProps {
    style: CSSProperties;
    text: string;
    paths?: string[];
    children?: [React.SVGAttributes<SVGGElement>]
    viewBox: string;
    svgDimensions: {
        width: number,
        height: number,
    }
    hoverStyle?: CSSProperties;
    onClick?: () => void;
}

export const IconedButton: React.FC<ButtonProps> = ({ style, text, paths, children, viewBox, svgDimensions, hoverStyle, onClick }) => {
    const [hovering, setHovering] = useState<boolean>(false)

    return (
        <div className="iconed-button"
            onMouseDown={() => {
                onClick && onClick();
                setHovering(false)
            }}
            onMouseMove={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
            style={hovering ? hoverStyle : style}
        >
            <button style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems:'center',
                cursor:"pointer",
                backgroundColor: style.backgroundColor,
                color: style.color,
                fontSize: style.fontSize,
                borderRadius: style.borderRadius
            }}>
                {text}
                <svg id="share_icon" viewBox={viewBox} height={svgDimensions.height} width={svgDimensions.width}>
                    {
                        paths ? paths.map((p, i) => <path
                            key={`${text}${i}`}
                            fill={hovering ? hoverStyle?.color : style.color}
                            d={p}>
                        </path>)
                            :
                            children
                    }
                </svg>
            </button>
        </div>
    )
}