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
exports.App = void 0;
var react_1 = require("react");
require("./App.css");
var sheet_creator_1 = require("./sheet_creator");
var sheetScreen_1 = require("./sheetScreen");
var react_router_dom_1 = require("react-router-dom");
var CanvasEditor_1 = require("./CanvasEditor/CanvasEditor");
var sheet_editor_1 = require("./sheet_editor");
var react_google_login_1 = require("react-google-login");
var config_1 = require("./firebase/config");
var storage_1 = require("firebase/storage");
var firestore_1 = require("firebase/firestore");
var client_secret_json_1 = require("./OAuth2/client_secret.json");
var circle_x_icon_png_1 = require("./Icons/circle-x-icon.png");
var dropdownmenu_1 = require("./dropdownmenu");
var AppContext_1 = require("./AppContext");
/*

Add delete options because this is currently a glorified image sharing system, which means offensive shit could be uploaded and shared
*/
/*
check to see if current template is custom and it has a system name && that it doesn't have a creatorID or that the current user is the creatorID
*/
var checkSheetID = function (user, sheetTemplate) {
    if ((sheetTemplate.system === "Custom" && sheetTemplate.system_name) && (user === sheetTemplate.creatorID || !sheetTemplate.creatorID)) {
        return true;
    }
    else {
        return false;
    }
};
/*
App Login/Save flow:
1)OAth2, get user email
2)user email as userID (Gsignin)
3)storage.ref(`
users/userID/Characters/{character name}/{character data,charatersheet image}?
or
users/userID/Custom_Sheets/{custom sheet}_data, {custom sheet}_sheet
`)
(getCustomSheets, getCharacterList)
4) load list of shared custom sheets: firebase get docs structure: users(collection)/user(doc)/sharedSheets(collection)/${system name}(doc)/creatorID and system_name(collection)
(getCustomSheets)
*/
exports.App = function () {
    var _a = react_1.useState({ templateData: {}, characterInfo: {} }), character = _a[0], setCharacter = _a[1];
    var _b = react_1.useState(), currentPath = _b[0], setCurrentPath = _b[1];
    var _c = react_1.useState(), scale = _c[0], setScale = _c[1];
    var _d = react_1.useState(), userID = _d[0], setUserID = _d[1];
    var _e = react_1.useState([]), characterList = _e[0], setCharacterList = _e[1];
    var _f = react_1.useState([]), customSheetsList = _f[0], setCustomSheetsList = _f[1]; //add newly created sheets to this
    var _g = react_1.useState({}), sharedSheets = _g[0], setSharedSheets = _g[1];
    var _h = react_1.useState(false), isSharing = _h[0], setIsSharing = _h[1];
    var _j = react_1.useState(), characterPageToken = _j[0], setCharacterPageToken = _j[1];
    var _k = react_1.useState(), customSheetPageToken = _k[0], setCustomSheetPageToken = _k[1];
    var _l = react_1.useContext(AppContext_1.ThemeContext), theme = _l.theme, dispatchTheme = _l.dispatchTheme;
    var saveTemplate = react_1.useCallback(function (selections) {
        if (selections.system && selections.system !== character.templateData.system) {
            setCharacter(__assign(__assign({}, character), { templateData: selections }));
        }
        /*
        selections.sections will only be for custom sheets, as sections will contain coordinates and labels for them.
        */
        if (selections.sections) {
            setCharacter(__assign(__assign({}, character), { characterInfo: selections }));
        }
        else {
            setCharacter(function (character) { return (__assign(__assign({}, character), { characterInfo: __assign(__assign({}, character.characterInfo), selections) })); });
        }
    }, [character]);
    var saveCurrentPath = react_1.useCallback(function (path) {
        setCurrentPath(path.substr(1));
        var newScale = path.substr(1) === 'creator' ? .5 : 1;
        setScale(newScale);
    }, []);
    var addCharacterName = function (characterName) {
        if (characterName.length >= 1) {
            if (character.templateData.system === "Custom") {
                setCharacter(__assign(__assign(__assign({}, character), character.characterInfo), { character_name: characterName }));
            }
        }
    };
    /*
    getCustomSheets gets all items from storage ref with ref.items,
    maps over them to get fullpath name,
    makes another ref from fullpath,
    getMetadata from item's fullpath ref,
    check's sharedWith to see if user has had custom sheet shared with them
    */
    //firebase get docs structure: users(collection)/user(doc)/sharedSheets(collection)/${system name}(doc)/creatorID and system_name(collection)
    //may have to be changed to await listAll() since list(max:30) may only get 30 sheets from cloud storage, not 30 sheets user has access to 
    var getCustomSheets = function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var sharedSheetsDoc, sharedSheetsData_1, formattedData, customSheetRef, userCustomSheets, accessibleSheets, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, firestore_1.getDocs(firestore_1.collection(config_1.db, 'users', user, 'sharedSheets'))];
                case 1:
                    sharedSheetsDoc = _a.sent();
                    sharedSheetsData_1 = [];
                    sharedSheetsDoc.forEach(function (doc) {
                        sharedSheetsData_1.push(doc.data());
                    });
                    formattedData = sharedSheetsData_1.reduce(function (acc, curr) {
                        var _a;
                        var creatorID = curr.creatorID, system_name = curr.system_name;
                        return __assign(__assign({}, acc), (_a = {}, _a[system_name] = creatorID, _a));
                    }, {});
                    setSharedSheets(formattedData);
                    customSheetRef = storage_1.ref(config_1.storage, "users/" + user + "/Custom_Sheets");
                    userCustomSheets = void 0;
                    accessibleSheets = void 0;
                    if (!customSheetPageToken) return [3 /*break*/, 3];
                    return [4 /*yield*/, storage_1.list(customSheetRef, { maxResults: 30, pageToken: customSheetPageToken })];
                case 2:
                    userCustomSheets = _a.sent();
                    setCustomSheetPageToken(userCustomSheets.nextPageToken);
                    accessibleSheets = userCustomSheets.items.map(function (sheet) {
                        return sheet.name.slice(0, sheet.name.lastIndexOf('_'));
                    });
                    setCustomSheetsList(__spreadArrays(customSheetsList, Array.from(new Set(accessibleSheets)).filter(function (str) { return str !== undefined; }), sharedSheetsData_1.map(function (item) { return item.system_name; })));
                    return [3 /*break*/, 5];
                case 3:
                    if (!!customSheetsList.length) return [3 /*break*/, 5];
                    return [4 /*yield*/, storage_1.list(customSheetRef, { maxResults: 30 })];
                case 4:
                    userCustomSheets = _a.sent();
                    setCharacterPageToken(userCustomSheets.nextPageToken);
                    accessibleSheets = userCustomSheets.items.map(function (sheet) {
                        return sheet.name.slice(0, sheet.name.lastIndexOf('_'));
                    });
                    setCustomSheetsList(__spreadArrays(customSheetsList, Array.from(new Set(accessibleSheets)).filter(function (str) { return str !== undefined; }), sharedSheetsData_1.map(function (item) { return item.system_name; })));
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.info("error getting custom sheets list " + err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getCharacterList = function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var charactersRef, userCharacters, charactersPaths, charactersPaths, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    charactersRef = storage_1.ref(config_1.storage, "users/" + user + "/Characters");
                    userCharacters = void 0;
                    if (!characterPageToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, storage_1.list(charactersRef, { maxResults: 30, pageToken: characterPageToken })];
                case 1:
                    userCharacters = _a.sent();
                    setCharacterPageToken(userCharacters.nextPageToken);
                    charactersPaths = userCharacters.items.map(function (folderRef) { return folderRef.name.slice(0, folderRef.name.lastIndexOf('_')); });
                    setCharacterList(__spreadArrays(characterList, charactersPaths));
                    return [3 /*break*/, 4];
                case 2:
                    if (!!characterList.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, storage_1.list(charactersRef, { maxResults: 30 })];
                case 3:
                    userCharacters = _a.sent();
                    setCharacterPageToken(userCharacters.nextPageToken);
                    charactersPaths = userCharacters.items.map(function (folderRef) { return folderRef.name.slice(0, folderRef.name.lastIndexOf('_')); });
                    setCharacterList(charactersPaths);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.info("error getting character list " + err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /*
    Find a way to put character(json) and image(Image) into one file for uploading
    if character.characterInfo.image typeof File, allow upload,
    but if image is a url (already uploaded, i.e. viewed by another user), don't allow reupload, as it will overwrite remote image File with url string
    */
    var handleCustomSheetUpload = function () {
        if (checkSheetID(userID, character.templateData)) {
            var metaData = {
                customMetadata: {
                    'creatorID': "" + userID,
                    'sharedWith': "" + (character.sharedWith && __spreadArrays(character.sharedWith))
                }
            };
            var customSheetImage = storage_1.ref(config_1.storage, "users/" + userID + "/Custom_Sheets/" + character.templateData.system_name + "_sheet");
            var customSheetData = storage_1.ref(config_1.storage, "users/" + userID + "/Custom_Sheets/" + character.templateData.system_name + "_data");
            if (typeof character.characterInfo.image !== 'string') {
                storage_1.uploadBytes(customSheetImage, character.characterInfo.image, __assign(__assign({}, metaData), { contentType: 'image/jpeg' }));
            }
            var characterBlob = new Blob([JSON.stringify(character)], { type: 'application/json' });
            storage_1.uploadBytes(customSheetData, characterBlob, metaData);
            getCustomSheets(userID);
        }
        else {
            alert('Your Game System needs a name!');
        }
    };
    var handleCharacterUpload = function () {
        if (userID) {
            var characterName = function () {
                if (character.templateData.system === "Custom" && (character === null || character === void 0 ? void 0 : character.templateData.system_name)) {
                    /*
                    check for name field in characterInfo.sections keys, else characterInfo.character_name
                    */
                    if (character.characterInfo.character_name && character.characterInfo.character_name.length > 1) {
                        return character.characterInfo.character_name;
                    }
                    else {
                        return Object.keys(character.characterInfo.sections).map(function (key) {
                            return key.toLowerCase() === "name" && character.characterInfo.sections[key].value.current;
                        })[0];
                    }
                }
                else {
                    return ((character === null || character === void 0 ? void 0 : character.characterInfo)['Character Info'])['Name'];
                }
            };
            if (characterName()) {
                var characterAsString = new Blob([JSON.stringify(character)], { type: 'application/json' });
                var characterRef = storage_1.ref(config_1.storage, "users/" + userID + "/Characters/" + characterName() + "_data");
                storage_1.uploadBytes(characterRef, characterAsString);
                if ((character === null || character === void 0 ? void 0 : character.templateData.system) === "Custom") {
                    var characterSheetRef = storage_1.ref(config_1.storage, "users/" + userID + "/Characters/" + characterName() + "_sheet");
                    storage_1.uploadBytes(characterSheetRef, character.templateData.image);
                    getCharacterList(userID);
                }
                alert(characterName() + " saved!");
            }
            else {
                alert('Your character has no name!');
            }
        }
    };
    var loadCharacter = function (characterName) { return __awaiter(void 0, void 0, void 0, function () {
        var characterDataRef, characterDataURL, fetchedCharacterdata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!characterName) return [3 /*break*/, 4];
                    characterDataRef = storage_1.ref(config_1.storage, "users/" + userID + "/Characters/" + characterName + "_data");
                    return [4 /*yield*/, storage_1.getDownloadURL(characterDataRef)];
                case 1:
                    characterDataURL = _a.sent();
                    return [4 /*yield*/, fetch(characterDataURL)];
                case 2: return [4 /*yield*/, (_a.sent()).json()];
                case 3:
                    fetchedCharacterdata = _a.sent();
                    setCharacter(fetchedCharacterdata);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadCustomSheet = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var sheetCreatorID, sheetDataRef, sheetDataURL, fetchedsheetdata, sheetImageRef, customSheetURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheetCreatorID = userID;
                    if (!name) return [3 /*break*/, 5];
                    if (Object.keys(sharedSheets).includes(name)) {
                        sheetCreatorID = sharedSheets[name];
                    }
                    sheetDataRef = storage_1.ref(config_1.storage, "users/" + sheetCreatorID + "/Custom_Sheets/" + name + "_data");
                    return [4 /*yield*/, storage_1.getDownloadURL(sheetDataRef)];
                case 1:
                    sheetDataURL = _a.sent();
                    return [4 /*yield*/, fetch(sheetDataURL)];
                case 2: return [4 /*yield*/, (_a.sent()).json()];
                case 3:
                    fetchedsheetdata = _a.sent();
                    sheetImageRef = storage_1.ref(config_1.storage, "users/" + sheetCreatorID + "/Custom_Sheets/" + name + "_sheet");
                    return [4 /*yield*/, storage_1.getDownloadURL(sheetImageRef)];
                case 4:
                    customSheetURL = _a.sent();
                    setCharacter({
                        characterInfo: __assign(__assign({}, fetchedsheetdata.characterInfo), { image: customSheetURL }),
                        templateData: fetchedsheetdata.templateData,
                        sharedWith: fetchedsheetdata.sharedWith
                    });
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var Gsigning = function (response) {
        if (response !== 'code') {
            setUserID(response.profileObj.email);
            getCharacterList(response.profileObj.email);
            getCustomSheets(response.profileObj.email);
        }
        if (response === 'code') {
            alert("Error Logging in with Google: " + response);
        }
    };
    var Gsignout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setUserID(undefined);
            setCharacter({ templateData: {}, characterInfo: {} });
            setCustomSheetsList([]);
            setCustomSheetsList([]);
            return [2 /*return*/];
        });
    }); };
    var addShareUsers = function (sharedUsers) {
        var metaData = {
            'creatorID': "" + character.templateData.creatorID,
            'system_name': character.templateData.system_name
        };
        sharedUsers.forEach(function (otherUser) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firestore_1.setDoc(firestore_1.doc(config_1.db, "users", otherUser + "/sharedSheets/" + character.templateData.system_name), metaData, { merge: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        setIsSharing(false);
        setCharacter(__assign(__assign({}, character), { sharedWith: sharedUsers }));
    };
    var replaceStat = function (newVal, position, statType) {
        var _a;
        var newStatArray = character.templateData.stats[statType].map(function (oldVal, i) { return i === position ? newVal : oldVal; });
        setCharacter(__assign(__assign({}, character), { templateData: {
                'stats': __assign(__assign({}, character.templateData.stats), (_a = {}, _a[statType] = newStatArray, _a))
            } }));
    };
    var addCharacterNotes = function (textEvent) {
        textEvent.preventDefault();
        setCharacter(__assign(__assign({}, character), { characterInfo: __assign(__assign({}, character.characterInfo), { character_notes: textEvent.target.value }) }));
    };
    react_1.useMemo(function () {
        document.body.style.setProperty("background-color", theme.backgroundColor);
        document.body.style.setProperty("color", theme.color);
        document.body.style.backgroundImage = "url(" + theme.backgroundImage + ")";
    }, [theme]);
    var saveButtonMouseOver = function (e) {
        document.querySelector("#" + e.target.id).style.background = theme.color + "30";
    };
    var saveButtonMouseOut = function (e) {
        document.querySelector("#" + e.target.id).style.background = "rgba(0, 0, 0, 0)";
    };
    var saveCharacter = function (data, characterSection) {
        if (characterSection === "character") {
            setCharacter(__assign(__assign({}, character), { characterInfo: data }));
        }
        else if (characterSection === "template") {
            setCharacter(function (character) { return (__assign(__assign({}, character), { templateData: __assign(__assign({}, character.templateData), data) })); });
        }
    };
    var handleSystemChange = function (systemOption) {
        systemOption === "Custom" ? setCharacter({
            templateData: {
                system: systemOption,
                creatorID: userID
            },
            characterInfo: {}
        }) :
            setCharacter({ templateData: { system: systemOption }, characterInfo: {} });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { style: { margin: 8, display: "flex", flexDirection: "row", justifyContent: 'space-between' } },
            !userID ?
                react_1["default"].createElement(react_google_login_1.GoogleLogin, { clientId: "" + client_secret_json_1["default"].web.client_id, buttonText: 'Login with Google', onSuccess: Gsigning, onFailure: Gsigning })
                : react_1["default"].createElement("div", { className: 'login_button_container', style: { width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" } },
                    checkSheetID(userID, character.templateData) &&
                        react_1["default"].createElement("button", { id: "save_custom_sheet", className: "save_button", style: {
                                borderColor: "" + theme.color,
                                borderBottom: "1px solid " + theme.color,
                                background: "rgba(0, 0, 0, 0)",
                                color: "" + theme.color,
                                borderRadius: "5px",
                                boxShadow: "0px 2px 0px " + theme.color
                            }, onClick: function () { return handleCustomSheetUpload(); }, onMouseEnter: function (e) { return saveButtonMouseOver(e); }, onMouseOut: function (e) { return saveButtonMouseOut(e); } }, "Save Custom Sheet"),
                    character.characterInfo && react_1["default"].createElement("button", { id: "save_character", className: "save_button", style: {
                            borderColor: "" + theme.color,
                            borderBottom: "1px solid " + theme.color,
                            background: "rgba(0, 0, 0, 0)",
                            color: "" + theme.color,
                            borderRadius: "5px",
                            boxShadow: "0px 2px 0px " + theme.color
                        }, onClick: function () { return handleCharacterUpload(); }, onMouseEnter: function (e) { return saveButtonMouseOver(e); }, onMouseOut: function (e) { return saveButtonMouseOut(e); } }, "Save Character"),
                    characterList && react_1["default"].createElement(dropdownmenu_1.DropDownMenu, { inputList: characterList, title: "Load your Character", defaultValue: character.characterInfo.name, changeFunction: loadCharacter, onScrollEnd: function () { return getCharacterList(userID); } }),
                    react_1["default"].createElement("div", { id: 'custom_sheet_options_contsiner', style: { display: 'flex', flexDirection: 'column' } },
                        customSheetsList && react_1["default"].createElement(dropdownmenu_1.DropDownMenu, { inputList: customSheetsList, title: "Custom Sheets", defaultValue: character.templateData.system_name, changeFunction: loadCustomSheet, onScrollEnd: function () { return getCustomSheets(userID); } }),
                        (!checkSheetID(userID, character.templateData) && character.templateData.creatorID) &&
                            react_1["default"].createElement("div", null,
                                "Created by ",
                                character.templateData.creatorID)),
                    character.templateData.system === "Custom" && react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("button", { id: "share_custom_sheet", style: {
                                borderColor: "" + theme.color,
                                borderBottom: "1px solid " + theme.color,
                                background: "rgba(0, 0, 0, 0)",
                                color: "" + theme.color,
                                borderRadius: "5px",
                                boxShadow: "0px 2px 0px " + theme.color
                            }, onClick: function () { return setIsSharing(!isSharing); }, onMouseEnter: function (e) { return saveButtonMouseOver(e); }, onMouseOut: function (e) { return saveButtonMouseOut(e); } }, "Share Custom Sheet")),
                    react_1["default"].createElement(react_google_login_1.GoogleLogout, { clientId: "" + client_secret_json_1["default"].web.client_id, buttonText: 'Logout of Google', onLogoutSuccess: Gsignout })),
            react_1["default"].createElement("div", { id: "theme_button_container", style: {
                    display: 'flex',
                    flexDirection: 'row',
                    height: 25,
                    width: 60,
                    margin: 5,
                    border: "1px solid",
                    borderRadius: '2px',
                    boxShadow: "0px 0px 2px",
                    justifySelf: 'flex-end'
                } },
                react_1["default"].createElement("button", { id: "dark_theme_button", className: "dark theme_button", value: 'dark', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }),
                react_1["default"].createElement("button", { id: "light_theme_button", className: "light theme_button", value: 'light', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }),
                react_1["default"].createElement("button", { id: "pink_theme_button", className: "pink theme_button", value: 'pink', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }))),
        react_1["default"].createElement("div", null, "You must be Logged In to save character or custom sheets"),
        react_1["default"].createElement("div", { className: "main_container" },
            react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
                react_1["default"].createElement(react_router_dom_1.Switch, null,
                    react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: ["/", "/creator"], render: function () {
                            return react_1["default"].createElement(sheet_creator_1.SheetCreator, { replaceStat: replaceStat, saveCharacter: saveCharacter, setPath: saveCurrentPath, savedTemplate: character.templateData, systemChange: handleSystemChange });
                        } }),
                    react_1["default"].createElement(react_router_dom_1.Route, { path: "/sheet", render: function () { return react_1["default"].createElement(sheetScreen_1.Sheet, { addCharacterName: addCharacterName, saveCharacter: saveCharacter, setPath: saveCurrentPath, sheet: character.templateData, characterData: character.characterInfo }); } }),
                    react_1["default"].createElement(react_router_dom_1.Route, { path: "/editor", render: function () {
                            return react_1["default"].createElement(sheet_editor_1.SheetEditor, { setPath: saveCurrentPath, systemName: character.templateData.system_name, saveCharacter: saveCharacter });
                        } }))),
            isSharing === true && react_1["default"].createElement(ShareModal, { isSharing: isSharing, setSharing: setIsSharing, addUsers: addShareUsers, savedCharacter: character }),
            character.templateData.system === "Custom" && currentPath !== 'sheet' &&
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", null, "System Name"),
                    react_1["default"].createElement("input", { id: "system_name", key: character.templateData.system_name, defaultValue: character.templateData.system_name, type: "text", onBlur: function (e) { return setCharacter(__assign(__assign({}, character), { templateData: __assign(__assign({}, character.templateData), { "system_name": e.target.value }) })); } })),
            character.templateData && character.templateData.system === "Custom" &&
                react_1["default"].createElement(CanvasEditor_1["default"], { savedimageUri: character.characterInfo.image, savedSections: character.characterInfo && character.characterInfo.sections, storeSections: saveTemplate, scale: scale, editorMode: currentPath, system_name: character.templateData.system_name })),
        react_1["default"].createElement("div", { id: "notes_container", style: { display: 'flex', flexDirection: 'column', bottom: 0 } },
            react_1["default"].createElement("label", { htmlFor: "character_notes" }, "Character Notes"),
            react_1["default"].createElement("textarea", { onChange: function (e) { return addCharacterNotes(e); }, defaultValue: character.characterInfo && character.characterInfo.character_notes, style: { maxHeight: '100vh', maxWidth: '95vw' } }))));
};
var ShareModal = function (_a) {
    var setSharing = _a.setSharing, addUsers = _a.addUsers, savedCharacter = _a.savedCharacter, isSharing = _a.isSharing;
    var containerRef = react_1.useRef(null);
    var emailtextRef = react_1.useRef(null);
    var _b = react_1.useState(), containerDiffs = _b[0], setcontainerDiffs = _b[1];
    var _c = react_1.useState(false), isDragging = _c[0], setIsDragging = _c[1];
    var dragMouseDown = function (e) {
        var _a, _b;
        var clientX = e.clientX, clientY = e.clientY;
        var _c = containerRef.current.getBoundingClientRect(), left = _c.left, top = _c.top;
        var dragStartLeft = clientX - left;
        var dragStartTop = clientY - top;
        setcontainerDiffs([dragStartLeft, dragStartTop]);
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.addEventListener('mousemove', startDragging, false);
        (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseup', handleEndDrag, false);
    };
    var startDragging = function () {
        var clientX = window.event.clientX;
        var clientY = window.event.clientY;
        if (containerDiffs) {
            containerRef.current.style.left = clientX - containerDiffs[0] + "px";
            containerRef.current.style.top = clientY - containerDiffs[1] + "px";
        }
    };
    var handleEndDrag = function () {
        var _a, _b, _c;
        setIsDragging(false);
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousedown', startDragging, false);
        (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('mousemove', startDragging, false);
        (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.removeEventListener('mouseup', handleEndDrag, false);
    };
    var handleSubmit = function () {
        var sharedEmails = emailtextRef.current.value.replace('\n', ' ').split(' ');
        addUsers(sharedEmails);
        handleEndDrag();
    };
    var modalIsDragging = {
        position: "absolute",
        zIndex: 1,
        width: "40%",
        height: "20%",
        overflow: "auto",
        backgroundColor: "#ade1ff",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    };
    var modalNotDragging = {
        position: "absolute",
        zIndex: 1,
        left: "50%",
        top: "10%",
        width: "40%",
        height: "20%",
        overflow: "auto",
        backgroundColor: "#ade1ff",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    };
    return (react_1["default"].createElement("div", { id: "sharing_modal", ref: containerRef, style: isDragging ? modalIsDragging : modalNotDragging, onMouseDown: function (e) { return dragMouseDown(e); }, onMouseUp: function () { return handleEndDrag(); } },
        react_1["default"].createElement("div", { id: "sharing_modal_content" },
            react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' } },
                react_1["default"].createElement("div", null, "Share your custom character sheet with other users"),
                react_1["default"].createElement("button", { onClick: function () { return setSharing(!isSharing); }, style: { border: 'none', height: 20, width: 20, background: "no-repeat center/100% url('" + circle_x_icon_png_1["default"] + "')" } })),
            react_1["default"].createElement("label", { htmlFor: "modal_text" }, "Share with:"),
            react_1["default"].createElement("textarea", { ref: emailtextRef, id: "modal_text", placeholder: "User Email Addresses", defaultValue: savedCharacter.sharedWith && savedCharacter.sharedWith.join(' '), style: { width: "90%", maxWidth: "100%", maxHeight: "100%", height: "90%" } })),
        react_1["default"].createElement("div", { id: "modal_button_container" },
            react_1["default"].createElement("button", { onClick: function () { return handleSubmit(); } }, "Submit"))));
};
