"use strict";
exports.__esModule = true;
exports.SheetEditor = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
exports.SheetEditor = function (_a) {
    var setPath = _a.setPath;
    var location = react_router_dom_1.useLocation();
    react_1.useEffect(function () {
        setPath(location.pathname);
    }, [location.pathname, setPath]);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { className: "creator_link_container" },
            react_1["default"].createElement(react_router_dom_1.Link, { to: "sheet", className: "navigation_button" }, "Go To Sheet"),
            react_1["default"].createElement("i", { className: "fas fa-forward" }),
            react_1["default"].createElement(react_router_dom_1.Link, { to: "creator", className: "navigation_button" }, "Go To Creator"),
            react_1["default"].createElement("i", { className: "fas fa-forward" })),
        react_1["default"].createElement("div", null, "This is the Editor screen. It's used to edit your custom character sheet from images you upload."),
        react_1["default"].createElement("div", null, "The Creator screen is used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template."),
        react_1["default"].createElement("div", null, "The Sheet screen is used to make changes to your character as you play.It won't show selection lines if you are making your own character sheet.")));
};
