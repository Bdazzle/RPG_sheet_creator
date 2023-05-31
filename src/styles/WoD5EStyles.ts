import { CSSProperties } from "react"
/*
attributes, skills, etc. handled inline as styleSheet.[`${var}_something`]
*/
const WoD5Estyles: { [key: string]: CSSProperties } = {
    character_info: {
        marginTop: `100px`,
        marginLeft: `85px`,
        display: `flex`,
        flexDirection: `row`,
    },
    character_text_field: {
        width: `175px`,
        display: `flex`,
        flexDirection: `column`,
        height: `75px`,
        alignContent: `space-between`,
        justifyContent: `center`,
    },
    character_text: {
        height: `20px`,
        backgroundColor: `#fcf5ed`,
        border: 0,
        width: `112px`,
    },
    character_text_container: {
        display: `flex`,
        flexDirection: `row`,
        height: `23px`,
        justifyContent: `space-between`,
        alignItems: `center`,
        border: `1px solid black`,
    },
    attributes_category: {
        marginLeft: `73px`,
        display: `flex`,
        flexDirection: `row`,
        gap: 30
    },
    attributes_points: {
        fontFamily: `'Cormorant', serif`,
        fontSize: `12px`,
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`,
    },
    attributes_name: {
        fontFamily: `'Cormorant', serif`,
        fontSize: `14px`,
        fontWeight: 900,
        textAlign: `center`,
        width: `90px`
    },
    attributes: {
        height: `75px`,
    },
    skills_category: {
        marginLeft: `85px`,
        display: `flex`,
        flexDirection: `row`,
    },
    skills: {
        height: `180px`,
        width: `175px`,
    },
    skills_points: {
        fontFamily: `'Cormorant', serif`,
        fontWeight: 900,
        fontSize: `14px`,
        display: `flex`,
        flexDirection: `row`,
        marginRight: `19.5px`,
        justifyContent: `space-between`,
        borderBottom: `1px dotted black`,
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
    button_container: {
        display: `flex`,
        flexDirection: `row`,
        alignItems: `center`,
    },
    /*Power Table and Cell styles*/
    powers_container: {
        marginLeft: 85,
        display: "grid",
    },
    power_cell_container: {
        minWidth: 170,
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        backgroundColor: " #fcf5ed"
    },
    power_header: {
        borderBottom: `1px solid black`,
        display: "flex",
        flexDirection: "row"
    },
    pips_power_header: {
        borderBottom: `1px solid black`,
        display: "flex",
        flexDirection: "row"
    },
    power_group: {
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        border: 0,
        backgroundColor: `#fcf5ed`,
        // height: cellheight / (maxlevel + 1),
        // width: cellwidth * (2 / 3) - 2
    },
    power_name: {
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        backgroundColor: `#fcf5ed`,
        // height: cellheight / (maxlevel + 1),
        borderBottom: `1px solid black`,
        // padding: 0,
        // borderTop: 0,
        // borderLeft: 0,
        // borderRight: 0,
        // backgroundColor: `#fcf5ed`,
    },
    power_point:{
        borderBottom: `1px solid black`,
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        backgroundColor: `#fcf5ed`,
        // height: cellheight / (maxlevel + 1)
    },
    section_header: {
        textAlign: `center`,
        width: `510px`,
        marginLeft: `85px`,
        color: `#81181f`,
        borderBottom: `2px solid #81181f`,
        fontFamily: `'Bodoni Moda', serif`,
        fontSize: `12px`,
        fontWeight: 900,
        letterSpacing: `2px`,
    },
    sub_category_header: {
        textAlign: `center`,
        fontFamily: `'Bodoni Moda', serif`,
        fontStyle: `italic`,
        fontSize: `10px`,
        fontWeight: 800,
    }
}

export default WoD5Estyles