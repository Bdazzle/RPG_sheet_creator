"use strict";
exports.__esModule = true;
exports.Sheet = void 0;
var react_1 = require("react");
var WoD5EOverlay_1 = require("./World of Darkness/WoD5EOverlay");
var WoDOverlay_1 = require("./World of Darkness/WoDOverlay");
var react_router_dom_1 = require("react-router-dom");
/*
SheetScreen will save character info, not sheet info, that will be provided, or saved by Cropping Tool.
*/
exports.Sheet = function (_a) {
    var characterData = _a.characterData, sheet = _a.sheet, setPath = _a.setPath, saveCharacter = _a.saveCharacter, addCharacterName = _a.addCharacterName;
    var location = react_router_dom_1.useLocation();
    react_1.useEffect(function () {
        setPath(location.pathname);
    }, [location.pathname, setPath]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "sheet_link_container" },
            react_1["default"].createElement("i", { className: "fas fa-backward" }),
            react_1["default"].createElement(react_router_dom_1.Link, { to: "creator", className: "navigation_button" }, "Go To Creator"),
            react_1["default"].createElement("i", { className: "fas fa-backward" }),
            react_1["default"].createElement(react_router_dom_1.Link, { to: "editor", className: "navigation_button" }, "Go To Editor")),
        react_1["default"].createElement("div", null, "This is the Sheet screen. It's used to make changes to your character as you play. It won't show selection lines if you are making your own character sheet."),
        react_1["default"].createElement("div", null, "The Creator screen is used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template."),
        sheet.system === "Custom" &&
            react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("label", { htmlFor: 'character_name' }, "Character Name:"),
                react_1["default"].createElement("input", { id: 'character_name', style: { width: '25%' }, onBlur: function (e) { return addCharacterName(e.target.value); } })),
        sheet.system !== "Custom" ?
            react_1["default"].createElement("div", { style: { height: '100vh', width: '100vw', position: "relative", backgroundSize: "100%", background: "url(" + sheet.previewSheet + ") no-repeat " } },
                react_1["default"].createElement("div", { key: "sheet", id: "sheet", style: { position: "absolute", top: 20, minWidth: '672px', minHeight: '869px', color: 'black' } }, sheet.system === "World of Darkness 5th Edition" ?
                    react_1["default"].createElement(WoD5EOverlay_1.WoD5EOverlay, { savedCharacter: characterData, saveCharacter: saveCharacter, game: sheet.template }) :
                    sheet.system === "World of Darkness" ?
                        react_1["default"].createElement(WoDOverlay_1.WoDOverlay, { savedCharacter: characterData, saveCharacter: saveCharacter, game: sheet.template })
                        : '')) : ''));
};
