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
exports.__esModule = true;
var react_1 = require("react");
var sharemodal_1 = require("../components/modals/sharemodal");
var navheader_1 = require("../components/navbar/navheader");
var CanvasEditor_1 = require("../CanvasEditor/CanvasEditor");
var AppContext_1 = require("../AppContext");
var use_debounce_1 = require("use-debounce");
var auth0_react_1 = require("@auth0/auth0-react");
var client_1 = require("@apollo/client");
var mutations_1 = require("../graphql/mutations");
var queryHooks_1 = require("../graphql/queryHooks");
var queries_1 = require("../graphql/queries");
var config_1 = require("../firebase/config");
var router_1 = require("next/dist/client/router");
var key_1 = require("../components/key");
var headerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
};
var mobileHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
};
var keyDescriptions = {
    '/sheet': "Make changes to your character sheet.",
    '/creator': "Make selections for creating your own RPG character sheet or use a pre-existing character sheet template.",
    '/editor': "Edit your custom character sheet from images you upload."
};
var pageDescriptions = {
    '/sheet': {
        header: "Character Sheet",
        desc: "This is the Sheet screen. It's used to make changes to your character as you play."
    },
    '/creator': {
        header: "Creator",
        desc: "This is the Creator screen. It's used to make selections for creating your own RPG character sheet or use a pre-existing character sheet template."
    },
    '/editor': {
        header: "Sheet Editor",
        desc: "This is the Editor screen. It's used to edit your custom character sheet from images you upload."
    }
};
var PageDesc = function (_a) {
    var header = _a.header, desc = _a.desc;
    var theme = react_1.useContext(AppContext_1.AppContext).theme;
    var textWithLineBreak = desc.replace(/screen\./g, 'screen.\n');
    console.log(header);
    return (react_1["default"].createElement("div", { className: 'page-desc-container', style: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        } },
        react_1["default"].createElement("div", { className: 'page-desc', style: {
                textAlign: 'center'
            } },
            react_1["default"].createElement("h2", { className: 'page_route_text', style: {
                    marginBottom: 0
                } }, header !== 'undefined' ? header : ''),
            react_1["default"].createElement("div", { style: {
                    lineHeight: 1.5
                } }, textWithLineBreak.split('\n').map(function (line, i) { return (react_1["default"].createElement("div", { key: "desc-line-" + i },
                line,
                " ",
                react_1["default"].createElement("br", null))); }))),
        react_1["default"].createElement("div", { className: 'key-container', style: {
                borderRadius: '5%',
                border: "2px solid " + theme.color,
                width: '40%',
                maxWidth: 400
            } },
            react_1["default"].createElement(key_1["default"], { pageKeyProps: keyDescriptions }))));
};
/*
App Login/Save flow:
1)OAth2/Google, get user email
2)user email as userID
3)getCustomSheets, getsharedCustomSheets, getCharacterList
*/
function RootLayout(_a) {
    var _this = this;
    var children = _a.children;
    var router = router_1.useRouter();
    var _b = react_1.useState(), scale = _b[0], setScale = _b[1];
    var _c = react_1.useState(false), showSharingModal = _c[0], setshowSharingModal = _c[1];
    var _d = react_1.useContext(AppContext_1.AppContext), theme = _d.theme, dispatchTheme = _d.dispatchTheme, isMobile = _d.isMobile, setIsMobile = _d.setIsMobile, character = _d.character, setCharacter = _d.setCharacter, userID = _d.userID, setUserID = _d.setUserID, setToken = _d.setToken, signedInWithGoogle = _d.signedInWithGoogle, setSignedInWithGoogle = _d.setSignedInWithGoogle;
    var _e = auth0_react_1.useAuth0(), user = _e.user, getAccessTokenSilently = _e.getAccessTokenSilently;
    var addUser = client_1.useMutation(mutations_1.insertUser)[0];
    var updateSharedUsers = client_1.useMutation(mutations_1.insertShares, {
        context: {
            headers: {
                "X-Hasura-User-Id": userID
            }
        }
    })[0];
    var nameref = react_1.useRef(null);
    react_1.useEffect(function () {
        if (character.characterInfo.character_name) {
            nameref.current.value = character.characterInfo.character_name;
        }
    }, [character.characterInfo.character_name]);
    /*
    used for Auth0
    remove this useEffect, make normal function so that it doesn't trigger when signed in with Google
    */
    react_1.useEffect(function () {
        if (user) {
            var validateUser = function () { return __awaiter(_this, void 0, void 0, function () {
                var token, existingUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getAccessTokenSilently()["catch"](function (err) { return console.log(err); })];
                        case 1:
                            token = _a.sent();
                            if (token) {
                                setToken(token);
                            }
                            return [4 /*yield*/, queryHooks_1.staticQuery(queries_1.getExistingUser, process.env.REACT_APP_HASURA_ENDPOINT, {
                                    Authorization: "Bearer " + token
                                }, {
                                    email: user.email
                                }, "GetExistingUser")];
                        case 2:
                            existingUser = _a.sent();
                            if (existingUser.data.users.length === 0) {
                                addUser({
                                    variables: {
                                        email: user.email,
                                        username: user.nickname
                                    }
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            validateUser();
            setUserID(user.email);
            if (signedInWithGoogle) {
                config_1.auth.signOut();
                setSignedInWithGoogle(false);
            }
        }
    }, [user]);
    var saveTemplate = react_1.useCallback(function (selections) {
        if (selections.system && selections.system !== character.templateData.system) {
            setCharacter(__assign(__assign({}, character), { templateData: selections }));
        }
        /*
        selections.sections will only be for custom sheets, as sections will contain coordinates and labels for them.
        */
        setCharacter(function (character) { return (__assign(__assign({}, character), { characterInfo: __assign(__assign({}, character.characterInfo), selections) })); });
    }, [character]);
    react_1.useEffect(function () {
        var newScale = router.pathname === 'creator' ? .5 : 1;
        setScale(newScale);
    }, [router.pathname]);
    var addCharacterName = function (characterName) {
        if (characterName.length >= 1) {
            if (character.templateData.system === "Custom") {
                setCharacter(__assign(__assign({}, character), { characterInfo: __assign(__assign({}, character.characterInfo), { character_name: characterName }) }));
            }
        }
    };
    var addShareUsers = function (sharedUsers) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (character.templateData.sheet_uuid) {
                sharedUsers.forEach(function (userEmail) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, updateSharedUsers({
                                    variables: {
                                        creator_id: userID,
                                        sheet_id: character.templateData.sheet_uuid,
                                        system_id: character.templateData.system_name,
                                        user_id: userEmail
                                    }
                                })];
                            case 1:
                                data = (_a.sent()).data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                setshowSharingModal(false);
                setCharacter(__assign(__assign({}, character), { sharedWith: sharedUsers }));
            }
            else {
                alert('Save your Custom sheet before sharing');
            }
            return [2 /*return*/];
        });
    }); };
    var addCharacterNotes = function (textEvent) {
        textEvent.preventDefault();
        setCharacter(__assign(__assign({}, character), { characterInfo: __assign(__assign({}, character.characterInfo), { character_notes: textEvent.target.value }) }));
    };
    var handleResize = use_debounce_1.useDebouncedCallback(function () { return setIsMobile(window.innerWidth <= 640); }, 200);
    react_1.useEffect(function () {
        setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, []);
    return (react_1["default"].createElement("div", { id: "page", style: {
            height: '100vh',
            width: '100wv',
            backgroundColor: theme.backgroundColor,
            color: theme.color,
            backgroundImage: "url(\"" + theme.backgroundImage + "\")"
        } },
        react_1["default"].createElement(navheader_1.Navbar, { showSharingModal: setshowSharingModal }),
        isMobile &&
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("a", { rel: "noreferrer", target: "_blank", href: "https://github.com/Bdazzle/RPG_sheet_generator", style: {
                        position: 'absolute',
                        right: 85
                    } },
                    react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
                        react_1["default"].createElement("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }))),
                react_1["default"].createElement("div", { id: "theme_button_container", style: {
                        position: 'fixed',
                        display: 'flex',
                        flexDirection: 'row',
                        height: 25,
                        width: 60,
                        border: "1px solid",
                        borderRadius: '2px',
                        boxShadow: "0px 0px 2px",
                        right: 10,
                        zIndex: 2
                    } },
                    react_1["default"].createElement("button", { "aria-label": "dark theme", id: "dark_theme_button", className: "dark theme_button", value: 'dark', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }),
                    react_1["default"].createElement("button", { "aria-label": "light theme", id: "light_theme_button", className: "light theme_button", value: 'light', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }),
                    react_1["default"].createElement("button", { "aria-label": "pink theme", id: "pink_theme_button", className: "pink theme_button", value: 'pink', onClick: function (e) { return dispatchTheme(e.currentTarget.value); } }))),
        react_1["default"].createElement("div", { className: "main_container" },
            react_1["default"].createElement("div", { className: "creator_link_container", style: isMobile ? mobileHeaderStyle : headerStyle },
                react_1["default"].createElement("h1", { style: {
                        width: '313px',
                        height: '35px',
                        alignSelf: 'center',
                        textAlign: 'center',
                        marginTop: isMobile ? 0 : 10,
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: isMobile ? '24px' : '36px'
                    } }, "RPG sheet creator")),
            react_1["default"].createElement(PageDesc, { header: router.pathname && pageDescriptions[router.pathname].header, desc: router.pathname && pageDescriptions[router.pathname].desc }),
            children,
            react_1["default"].createElement("div", null,
                character.templateData.system === "Custom" &&
                    react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("label", { htmlFor: 'character_name' }, "Character Name: "),
                        react_1["default"].createElement("input", { ref: nameref, id: 'character_name', style: { width: '25%' }, onChange: function (e) { return addCharacterName(e.target.value); } })),
                character.templateData.system === "Custom" && router.pathname !== 'sheet' &&
                    react_1["default"].createElement("div", { style: { paddingTop: 5, paddingBottom: 5 } },
                        react_1["default"].createElement("label", null, "System Name: "),
                        character.templateData.creatorID === userID ?
                            react_1["default"].createElement("input", { id: "system_name", key: character.templateData.system_name, defaultValue: character.templateData.system_name, type: "text", onBlur: function (e) { return setCharacter(__assign(__assign({}, character), { templateData: __assign(__assign({}, character.templateData), { "system_name": e.target.value }) })); } })
                            :
                                react_1["default"].createElement("div", null, character.templateData.system_name))),
            showSharingModal === true &&
                react_1["default"].createElement(sharemodal_1.ShareModal, { showSharingModal: showSharingModal, setSharing: setshowSharingModal, addUsers: addShareUsers, savedCharacter: character }),
            character.templateData && character.templateData.system === "Custom" &&
                react_1["default"].createElement(CanvasEditor_1["default"], { savedimageUri: character.characterInfo.image, savedSections: character.characterInfo && character.characterInfo.sections, storeSections: saveTemplate, scale: scale, editorMode: router.pathname, system_name: character.templateData.system_name })),
        character.templateData.system &&
            react_1["default"].createElement("div", { id: "notes_container", style: { display: 'flex', flexDirection: 'column', bottom: 0 } },
                react_1["default"].createElement("label", { htmlFor: "character_notes" }, "Character Notes"),
                react_1["default"].createElement("textarea", { onChange: function (e) { return addCharacterNotes(e); }, defaultValue: character.characterInfo && character.characterInfo.character_notes, style: { maxHeight: '100vh', maxWidth: '95vw' } }))));
}
exports["default"] = RootLayout;
