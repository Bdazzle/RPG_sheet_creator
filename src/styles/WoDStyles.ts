import { CSSProperties } from "react"
/*
attributes, skills, etc. handled inline as styleSheet.[`${var}_something`]
*/
const WoDStyles: { [key: string]: CSSProperties } = {
    character_info: {
        marginTop: `70px`,
        marginLeft: `40px`,
        display: `flex`,
        flexDirection: `row`,
    },
    character_text_field: {
        width: `33%`,
        display: `flex`,
        flexDirection: `column`,
        height: `80px`,
        alignContent: `space-between`,
        justifyContent: `center`,
    },
    character_text: {
        height: `18px`,
        border: 0,
        width: `100px`,
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
    },
    character_text_container: {
        display: `flex`,
        flexDirection: `row`,
        height: `20px`,
        alignItems: `center`,
    },
    attributes_category: {
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`,
        height: 60,
    },
    points: {
        fontFamily: `'Cormorant', serif`,
        fontSize: `16px`,
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`,
    },
    attributes_name: {
        fontFamily: `'Cormorant', serif`,
        fontSize: `14px`,
        fontWeight: 900,
        width: `90px`
    },
    abilities_category: {
        display: `flex`,
        flexDirection: `row`,
    },
    abilities_name: {
        fontFamily: `'Cormorant', serif`,
        fontSize: `14px`,
        fontWeight: 900,
        width: `90px`
    },
    boxes_row: {
        marginTop: `5px`,
    },
    box_container: {
        justifyContent: `space-between`,
    },
    box_header: {
        textAlign: `center`,
        fontSize: `10px`,
        fontFamily: `'Open Sans', sans-serif`,
        fontWeight: 800,
        color: `#81181f`,
        paddingRight: `5px`,
    },
    section_header: {
        textAlign: `center`,
        fontFamily: `Werewolf`,
        fontSize: `18px`,
        fontWeight: 600,
    },
    sub_category_header: {
        textAlign: `center`,
        fontStyle: `italic`,
        fontSize: `10px`,
        fontWeight: 800,
    },

    /*Power Table and Cell styles */

    pips_power_header: {
        borderBottom: `1px solid black`,
        display: "flex",
        flexDirection: "row"
    },
    power_header: {
        display: 'grid',
        gridTemplateColumns: `repeat(2, 1fr)`,
        gridTemplateRows: `auto`
    },
    power_group: {
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        border: 0,
    },
    button_container: {
        display: `flex`,
        flexDirection: `row`,
        alignItems: `center`,
    },
    power_cell_container: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid black"
    },
    power_name: {
        borderBottom: `1px solid black`,
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
    },
    power_cell: {
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        border: 0,
    }

}

export default WoDStyles