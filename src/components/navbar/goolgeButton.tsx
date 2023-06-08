import React, { CSSProperties, useContext } from "react";
import { AppContext } from "../../AppContext";

interface ButtonProps {
    onSignIn: () => Promise<void>
    onSignOut: () => Promise<void>
}

const buttonStyle: CSSProperties = {
    borderRadius: 4,
    boxSizing: 'border-box',
    border: '2px solid black',
    color: "#3c4043",
    cursor: 'pointer',
    fontFamily: `"Google Sans",arial,sans-serif`,
    fontSize: 14,
    height: 40,
    letterSpacing: 0.25,
    outline: 'none',
    // overflow:'hidden',
    padding: '0 12px',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    width: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
}

const GoogleSigninButton: React.FC<ButtonProps> = ({ onSignIn, onSignOut }) => {
    const { signedInWithGoogle } = useContext(AppContext)

    return (
        <>
            <div id="google_button_wrapper" style={{
                gridColumn: '2 / auto',
                maxWidth: 200,

                // border:'2px solid black'
            }}>
                <div style={{
                    height: 40
                }}>
                    <div style={{
                        position: 'relative',
                        border: 'none',
                        margin: 0,
                        padding: 0
                    }}>
                        <div className="container"
                            style={{
                                padding: '2px 10px',
                                display: 'inline-block'
                            }}
                        >
                            <div role={'button'} aria-labelledby={'button-label'} tabIndex={0}
                                onClick={() => { !signedInWithGoogle ? onSignIn() : onSignOut() }}
                                style={{
                                    ...buttonStyle,
                                    maxWidth: 400,
                                    minWidth: 200,
                                }}
                            >
                                {/* <img src={googleData.picture} alt={`${googleData.name} profile image`}
                                style={{
                                    borderRadius:'50%',
                                    // display:'flex',
                                    height: 20,
                                    minWidth: 20,
                                    width: 20,
                                    margin:'0 8px 0 -4px'
                                }}
                                ></img> */}
                                <div className="button-text"
                                    style={{
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        fontFamily: 'Roboto',
                                        flexGrow: 1,
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'top',
                                        color: '#5f6368',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* <div>Sign in as {googleData.name}</div> */}
                                    {!signedInWithGoogle ?
                                        <div id="button-label">Sign In with Google</div>
                                        :
                                        <div id="button-label">Sign out</div>
                                    }
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#5f6368',
                                        fill: '#5f6368',
                                        fontSize: '11px',
                                        fontWeight: 400
                                    }}>
                                        {/* <div style={{
                                            overflow:'hidden',
                                            textOverflow:'ellipsis',
                                            height:18,
                                            width:18,
                                            minWidth:18,
                                            margin:"-3px -3px -3px 2px"
                                        }}>
                                            {googleData.email}
                                        </div> */}
                                        <svg className="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            style={{
                                                height: 18,
                                                width: 18,
                                                minWidth: 18,
                                                margin: "-3px -3px -3px 2px"
                                            }}
                                        >
                                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                            <path fill="none" d="M0 0h24v24H0V0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="google-brand"
                                    style={{
                                        marginLeft: 8,
                                        marginRight: -4,
                                        height: 18,
                                        minWidth: 18,
                                        width: 18
                                    }}
                                >
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" >
                                        <g>
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z">
                                            </path>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z">
                                            </path>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z">
                                            </path>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z">
                                            </path>
                                            <path fill="none" d="M0 0h48v48H0z">
                                            </path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GoogleSigninButton