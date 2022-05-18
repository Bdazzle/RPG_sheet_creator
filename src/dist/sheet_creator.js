"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.SheetCreator = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./sheet_creator_styles.css");
var templateDefaults_1 = require("./templateDefaults");
var config_1 = require("./firebase/config");
var storage_1 = require("firebase/storage");
var dropdownmenu_1 = require("./dropdownmenu");
var makeObject = function (arr) {
    return Object.assign.apply(Object, __spreadArrays([{}], arr.map(function (key) {
        var _a;
        return (_a = {}, _a[key] = '', _a);
    })));
};
//alphabet string used for testing pagination
// ,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s'
var systems = ["Custom", "World of Darkness 5th Edition", "World of Darkness"];
exports.SheetCreator = function (_a) {
    var saveCharacter = _a.saveCharacter, setPath = _a.setPath, savedTemplate = _a.savedTemplate, replaceStat = _a.replaceStat, systemChange = _a.systemChange;
    var _b = react_1.useState(), templatesOptions = _b[0], setTemplatesOptions = _b[1]; //different sheets from each game system
    var location = react_router_dom_1.useLocation();
    react_1.useEffect(function () {
        setPath(location.pathname);
    });
    /*
    create a new template object with storage.ref gets for logo and previewSheet before passing?
    when template changes for non-Custom games (ex: World of Darkness, D&D, w/e)
    get background image (template.previesheet) from firebase/templates storage ref
    get logo (template.logo) from firebase/templates storage ref
    */
    var handleTemplateChange = function (val) {
        var _a;
        if (savedTemplate.system === "World of Darkness 5th Edition") {
            var getWoD5E = function () { return __awaiter(void 0, void 0, void 0, function () {
                var updatedSheetdata, sheetImageRef, sheetImage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            updatedSheetdata = __assign(__assign({}, savedTemplate), templateDefaults_1.WoD5Egames[val]);
                            updatedSheetdata.template = val;
                            sheetImageRef = storage_1.ref(config_1.storage, "templates/" + updatedSheetdata.previewSheet);
                            return [4 /*yield*/, storage_1.getDownloadURL(sheetImageRef)];
                        case 1:
                            sheetImage = _a.sent();
                            updatedSheetdata.previewSheet = sheetImage;
                            saveCharacter(updatedSheetdata, "template");
                            return [2 /*return*/];
                    }
                });
            }); };
            getWoD5E();
            var newCharacterSheet = {};
            for (var substat in templateDefaults_1.WoD5Egames[val].stats) {
                var statObj = makeObject(templateDefaults_1.WoD5Egames[val].stats[substat]);
                Object.assign(newCharacterSheet, (_a = {}, _a[substat] = statObj, _a));
            }
            saveCharacter(newCharacterSheet, "character");
        }
        if (savedTemplate.system === "World of Darkness") {
            var getWoD = function () { return __awaiter(void 0, void 0, void 0, function () {
                var updatedSheetdata, sheetImageRef, sheetImage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            updatedSheetdata = __assign(__assign({}, savedTemplate), templateDefaults_1.WoDgames[val]);
                            updatedSheetdata.template = val;
                            sheetImageRef = storage_1.ref(config_1.storage, "templates/" + updatedSheetdata.previewSheet);
                            return [4 /*yield*/, storage_1.getDownloadURL(sheetImageRef)];
                        case 1:
                            sheetImage = _a.sent();
                            updatedSheetdata.previewSheet = sheetImage;
                            saveCharacter(updatedSheetdata, "template");
                            return [2 /*return*/];
                    }
                });
            }); };
            getWoD();
            saveCharacter(__assign({}, templateDefaults_1.WoDgames[val].stats), "character");
        }
    };
    /*
    1)when the system option changes, add to sheetData.system with addToSheet
    2)below useEffect triggers when system option changes,
    with check for !undefined to prevent sheetData being set to "system:undefined" on navigation changes to preserve statefulness
    resets template choices if user changes game system
    */
    react_1.useEffect(function () {
        if (savedTemplate) {
            if (savedTemplate.system === "World of Darkness") {
                setTemplatesOptions(Object.keys(templateDefaults_1.WoDgames));
            }
            if (savedTemplate.system === "World of Darkness 5th Edition") {
                setTemplatesOptions(Object.keys(templateDefaults_1.WoD5Egames));
            }
        }
    }, [savedTemplate.system, savedTemplate]);
    return (react_1["default"].createElement("div", { style: { width: '100vw' } },
        react_1["default"].createElement("div", { className: "creator_link_container" },
            react_1["default"].createElement(react_router_dom_1.Link, { to: "sheet", className: "navigation_button" }, "Go To Sheet"),
            react_1["default"].createElement("i", { className: "fas fa-forward" }),
            react_1["default"].createElement(react_router_dom_1.Link, { to: "editor", className: "navigation_button" }, "Go To Editor"),
            react_1["default"].createElement("i", { className: "fas fa-forward" })),
        react_1["default"].createElement("div", null, "This is the Creator screen. It's used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template."),
        react_1["default"].createElement("div", null, "The Editor screen is used to edit your custom character sheet from images you upload."),
        react_1["default"].createElement("div", null, "The Sheet screen is used to make changes to your character as you play.It won't show selection lines if you are making your own character sheet."),
        react_1["default"].createElement("div", { className: "sheet_options" },
            savedTemplate.previewSheet && react_1["default"].createElement("img", { alt: "blank character sheet preview", src: savedTemplate.previewSheet, className: "mini_sheet_preview" }),
            react_1["default"].createElement("div", { id: "sheet_form" },
                react_1["default"].createElement(dropdownmenu_1.DropDownMenu, { inputList: systems, title: "System", changeFunction: systemChange, defaultValue: savedTemplate.system ? savedTemplate.system : "--Choose a System--", zVal: 10 }),
                templatesOptions && savedTemplate.system.includes("World of Darkness") ?
                    react_1["default"].createElement(dropdownmenu_1.DropDownMenu, { inputList: templatesOptions, title: "Template", changeFunction: handleTemplateChange, defaultValue: savedTemplate ? savedTemplate.template : "--Choose a Template--", zVal: 9 })
                    :
                        react_1["default"].createElement("div", null),
                savedTemplate.system === "World of Darkness 5th Edition" ?
                    react_1["default"].createElement("div", { className: "template_stats" }, savedTemplate.stats ? Object.entries(savedTemplate.stats).map(function (_a) {
                        var key = _a[0], val = _a[1];
                        return Array.isArray(val) ?
                            react_1["default"].createElement("div", { key: key },
                                react_1["default"].createElement("span", { key: key + "_stat_title", className: "stat_title" }, key[0].toUpperCase() + key.substr(1)),
                                react_1["default"].createElement("div", { key: key + "_stat_container", className: "stat_container" }, savedTemplate.template === "Custom" ?
                                    val.map(function (stat, index) { return react_1["default"].createElement("input", { key: stat, defaultValue: stat, onBlur: function (e) { return replaceStat(e.target.value, index, key); } }); })
                                    : val.map(function (stat) { return react_1["default"].createElement("div", { key: stat }, stat); })))
                            : '';
                    }) : '') :
                    savedTemplate.system === "World of Darkness" ?
                        react_1["default"].createElement("div", { className: "template_stats" }, savedTemplate.stats ? Object.entries(savedTemplate.stats).map(function (_a) {
                            var key = _a[0], val = _a[1];
                            return react_1["default"].createElement("div", { key: key },
                                react_1["default"].createElement("span", { key: key + "_stat_title", className: "stat_title" }, key[0].toUpperCase() + key.substr(1)),
                                react_1["default"].createElement("div", { key: key + "_stat_container", id: key, style: key === "Character Info" ? { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "minmax(50px, auto)" } : {} }, savedTemplate.template === "Custom" ?
                                    Object.entries(val).map(function (_a) {
                                        var key2 = _a[0], val2 = _a[1];
                                        return typeof val2 === 'object' ?
                                            react_1["default"].createElement("div", { key: key2 + val2 },
                                                react_1["default"].createElement("div", { key: key2, className: "stat_title" }, key2),
                                                react_1["default"].createElement("div", { key: key2 + "stat_container", className: 'stat_container' }, Object.keys(val2).map(function (stat, index) { return react_1["default"].createElement("input", { key: stat, defaultValue: stat, onBlur: function (e) { return replaceStat(e.target.value, index, key); } }); }))) :
                                            react_1["default"].createElement("div", { key: key2 }, key2);
                                    })
                                    :
                                        Object.entries(val).map(function (_a) {
                                            var key2 = _a[0], val2 = _a[1];
                                            return typeof val2 === 'object' ?
                                                react_1["default"].createElement("div", { key: key2 + val2 },
                                                    react_1["default"].createElement("div", { key: key2, className: "stat_title" }, key2),
                                                    react_1["default"].createElement("div", { key: key2 + "stat_container", className: 'stat_container' }, Object.keys(val2).map(function (stat) { return react_1["default"].createElement("div", { key: stat }, stat); }))) :
                                                react_1["default"].createElement("div", { key: key2 }, key2);
                                        })));
                        }) : '')
                        : ''))));
};
