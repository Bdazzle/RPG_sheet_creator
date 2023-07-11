import React, { useContext } from "react";
import Link from "next/link";
import { AppContext } from "../AppContext";
import { IconedButton } from "./IconedButton";
import { useRouter } from "next/dist/client/router";

type SiteKeyProps = {
    pageKeyProps: {
        [path: string]: string,
    }
}

const SiteKeys: React.FC<SiteKeyProps> = ({ pageKeyProps }: SiteKeyProps) => {
    const { theme } = useContext(AppContext)
    const router = useRouter()

    const nonMatchinRoutes = Object.keys(pageKeyProps).filter((pathName: string) => pathName !== router.pathname)

    return (
        <div className="key"
            style={{
                width: 'auto',
                backgroundColor: theme.keyColor,
                border: `5px solid ${theme.backgroundColor}`,
                borderRadius: '5%',
                padding: '2%'
            }}
        >
            {
                nonMatchinRoutes.map((pathName) => (
                    <div className="key-link"
                        key={pathName}
                        style={{
                            lineHeight: 1.5,
                            fontSize: 18,
                            fontWeight: 500,
                            color: theme.backgroundColor,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Link href={`${pathName}`}
                            className="link-text"
                            style={{
                                color: theme.backgroundColor,
                                textDecoration: 'underline',
                                // fontSize:18,
                                fontWeight: 500,
                                // cursor:"pointer"
                            }}
                        >
                            <IconedButton
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    // width: '107px',
                                    width: 130,
                                    // width: '50%',
                                    // backgroundColor: theme.color,
                                    // color: theme.backgroundColor,
                                    color: theme.color,
                                    backgroundColor: theme.backgroundColor,
                                    borderRadius: 5,
                                    fontSize: 24,
                                }}
                                hoverStyle={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    // width: '107px',
                                    width: 130,
                                    // width: '50%',
                                    textDecoration: 'underline',
                                    opacity: .7,
                                    // color: theme.backgroundColor,
                                    // backgroundColor: theme.color,
                                    color: theme.color,
                                    backgroundColor: theme.backgroundColor,
                                    borderRadius: 5,
                                }}
                                svgDimensions={{
                                    width: 16,
                                    height: 16
                                }}
                                text={pathName.charAt(1).toUpperCase() + pathName.slice(2)}
                                viewBox="0 0 512 512"
                                paths={["M500.5 231.4l-192-160C287.9 54.3 256 68.6 256 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2zm-256 0l-192-160C31.9 54.3 0 68.6 0 96v320c0 27.4 31.9 41.8 52.5 24.6l192-160c15.3-12.8 15.3-36.4 0-49.2z"]}
                            />
                        </Link>
                        <div style={theme.scheme === 'pink' ? {
                            color: theme.color
                        } : {
                            color: theme.backgroundColor
                        }
                        }>
                            {pageKeyProps[pathName]}
                        </div>
                    </div>

                ))
            }
        </div>
    )
}

export default SiteKeys