import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"
import { AppContext } from '../AppContext';

interface Editor {
    setPath: (path: string) => void;
}

export const SheetEditor: React.FC<Editor> = ({ setPath }) => {
    let location = useLocation()
    const { theme } = useContext(AppContext)

    useEffect(() => {
        setPath(location.pathname)
    }, [location.pathname, setPath])

    return (
        <div>
            <h2 className='page_route_text'
                style={{
                    marginBottom: 0
                }}>
                Custom Sheet Editor
            </h2>
            <div style={{ lineHeight: 1.5 }}>This is the Editor screen. <br />
                It's used to edit your custom character sheet from images you upload.<br />
                Select "Custom" from the <Link to={'/creator'} className="link_text"
                    style={{
                        color: theme.color,
                        textDecoration: 'underline'
                    }}
                >Creator</Link> "System" dropdown menu to make a sheet.<br />
                The <Link to={'/creator'} className="link_text"
                    style={{
                        color: theme.color,
                        textDecoration: 'underline'
                    }}
                >Creator</Link> screen is used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template.<br />
                The <Link to={'/sheet'} className="link_text"
                    style={{
                        color: theme.color,
                        textDecoration: 'underline'
                    }}
                >Sheet</Link> screen is used to make changes to your character as you play. It won't show selection lines if you are making your own character sheet.</div>
        </div>
    )
}
