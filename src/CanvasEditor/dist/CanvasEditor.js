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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
require("./CanvasEditor.css");
var Redraw_1 = require("./Redraw");
var jspdf_1 = require("jspdf");
var AppContext_1 = require("../AppContext");
var SelectionInputs = function (_a) {
    var defaultValInput = _a.defaultValInput, defaultLabel = _a.defaultLabel, defaultStyle = _a.defaultStyle, index = _a.index, handleValue = _a.handleValue, handleLabel = _a.handleLabel, handleStatStyle = _a.handleStatStyle, handleShowText = _a.handleShowText, handleDelete = _a.handleDelete, editorMode = _a.editorMode;
    var _b = react_1.useState(defaultValInput), value = _b[0], setValue = _b[1];
    var _c = react_1["default"].useState(defaultStyle), statStyle = _c[0], setStatStyle = _c[1];
    var _d = react_1.useState(false), showText = _d[0], setShowText = _d[1];
    react_1.useEffect(function () {
        handleValue(value, defaultLabel);
    }, [value, defaultLabel, handleValue]);
    var deleteButtonClick = function (e) {
        e.preventDefault();
        handleDelete(defaultLabel, index);
    };
    var onStyleChange = function (option, label) {
        setStatStyle(option);
        handleStatStyle(label, option);
    };
    /*
    will only fire if stat style is NOT text
    */
    var handleTextVisibility = function () {
        setShowText(!showText);
        handleShowText(defaultLabel, !showText);
    };
    return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: editorMode === 'editor' ? 'column' : 'row' }, className: "assignment_input_container", id: defaultLabel + "container", key: defaultLabel + "container" + index },
        react_1["default"].createElement("div", { className: "stat_division" },
            react_1["default"].createElement("label", null, "Stat"),
            react_1["default"].createElement("input", { defaultValue: defaultLabel, key: defaultLabel + "label" + index, onBlur: function (e) { return handleLabel(e.target.value, index); }, type: "text", className: "label_inputs" })),
        editorMode === "editor" &&
            react_1["default"].createElement("div", { className: "stat_division" },
                react_1["default"].createElement("label", { htmlFor: "style" }, "Style"),
                react_1["default"].createElement("select", { defaultValue: defaultStyle, style: { width: '75%' }, onChange: function (e) { return onStyleChange(e.target.value, defaultLabel); } },
                    react_1["default"].createElement("option", null, "Choose Style"),
                    react_1["default"].createElement("option", { value: "Checkboxes" }, "Checkboxes"),
                    react_1["default"].createElement("option", { value: "Pips" }, "Pips"),
                    react_1["default"].createElement("option", { value: "Text" }, "Text"))),
        react_1["default"].createElement("div", { className: "values_container", style: { display: 'flex', flexDirection: 'row' } },
            react_1["default"].createElement("div", { className: "stat_division" },
                react_1["default"].createElement("label", null, "Current"),
                react_1["default"].createElement("input", { className: "label_inputs", defaultValue: defaultValInput.current, onBlur: function (e) { return statStyle === "Text" ? setValue({ current: e.target.value }) : setValue(__assign(__assign({}, value), { current: e.target.value })); } })),
            (statStyle === "Pips" || statStyle === "Checkboxes") &&
                react_1["default"].createElement("div", { className: "stat_division" },
                    react_1["default"].createElement("label", null, "Max"),
                    react_1["default"].createElement("input", { className: "label_inputs", defaultValue: defaultValInput.max, onBlur: function (e) { return setValue(__assign(__assign({}, value), { max: e.target.value })); } }))),
        react_1["default"].createElement("div", { className: 'editor_only_options', style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' } },
            editorMode === 'editor' &&
                react_1["default"].createElement("button", { className: "row_delete", style: { height: "50%", marginTop: 'auto', width: 30 }, onClick: function (e) { return deleteButtonClick(e); } },
                    react_1["default"].createElement("i", { className: "fas fa-trash" })),
            (editorMode === "editor" && statStyle !== "Text") &&
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "show_text" }, "Show Label"),
                    react_1["default"].createElement("input", { checked: showText, id: "show_text", type: "checkbox", onChange: function () { return handleTextVisibility(); } })))));
};
/*
add PDF Handling
*/
var CanvasEditor = function (_a) {
    var _b;
    var savedimageUri = _a.savedimageUri, savedSections = _a.savedSections, storeSections = _a.storeSections, _c = _a.editorMode, editorMode = _c === void 0 ? '' : _c, _d = _a.scale, scale = _d === void 0 ? 1 : _d, system_name = _a.system_name;
    var _e = react_1.useState(), sections = _e[0], setSections = _e[1];
    var _f = react_1.useState(), mode = _f[0], setMode = _f[1];
    var _g = react_1.useState([]), storedCoordinates = _g[0], setStoredCoordinates = _g[1];
    var _h = react_1.useState(), imageUrl = _h[0], setImageUrl = _h[1];
    var _j = react_1["default"].useState(false), modeClicked = _j[0], setModeClicked = _j[1];
    var _k = react_1.useState('rgba(0, 0, 0,0)'), fillColor = _k[0], setFillColor = _k[1];
    var canvasRef = react_1.useRef(null);
    var stageRef = react_1.useRef(null);
    var inputContainer = react_1.useRef(null);
    var theme = react_1.useContext(AppContext_1.ThemeContext).theme;
    var sheetHeight = 869;
    var sheetWidth = 672;
    /*
    check to see if loaded image source is a file (object), or url/blob (string)
    if string, set imageUrl to savedimageUri, do not set if object, as it will override file to blob conversion in below functions
    */
    react_1.useEffect(function () {
        setSections(savedSections);
        if (typeof savedimageUri === "string") {
            setImageUrl(savedimageUri);
        }
    }, [savedSections, savedimageUri]);
    var handleFileChange = function (event) {
        event.preventDefault();
        if (event.target.files) {
            var convertedFile = event.target.files[0];
            if (convertedFile) {
                var convertedImageUrl = URL.createObjectURL(convertedFile);
                setImageUrl(convertedImageUrl);
                if (storeSections) {
                    storeSections({ sections: sections, image: convertedFile });
                }
            }
        }
    };
    var handleDrop = function (event) {
        event.preventDefault();
        var convertedFile = event.dataTransfer.items[0].getAsFile();
        var convertedImageUrl = URL.createObjectURL(convertedFile);
        setImageUrl(convertedImageUrl);
        if (storeSections) {
            storeSections({ sections: sections, image: convertedFile });
        }
    };
    var handleDrag = function (event) {
        event.preventDefault();
    };
    /*
    adds labels when sections updates
    sends sections and image to parent in function(sections, imageUrl)
    storeSections in dependency array causes infinite loop
    */
    react_1.useEffect(function () {
        if (sections && imageUrl !== undefined) {
            if (storeSections) {
                storeSections({ sections: sections, image: imageUrl });
            }
        }
    }, [sections, imageUrl]);
    /*
    canvasImage in dependencies causes canvas image to render over any selections
    */
    react_1.useEffect(function () {
        if (imageUrl) {
            var canvas_1 = canvasRef.current;
            var context_1 = canvas_1.getContext('2d');
            var canvasImage_1 = new Image(); //(w,h) options
            canvasImage_1.src = imageUrl;
            canvasImage_1.onload = function () {
                stageRef.current.style.width = canvasImage_1.width > canvasImage_1.height ? sheetHeight * scale + "px" : sheetWidth * scale + "px";
                stageRef.current.style.height = canvasImage_1.height > canvasImage_1.width ? sheetHeight * scale + "px" : sheetWidth * scale + "px";
                canvas_1.height = stageRef.current.offsetHeight;
                canvas_1.width = stageRef.current.offsetWidth;
                Redraw_1.redrawCanvas(imageUrl, sections, context_1, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
            };
        }
    }, [imageUrl, editorMode, scale, sections]);
    react_1.useEffect(function () {
        var _a;
        var context = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        /*
        for polygon tool:
        1) if there are 2 or more [x,y] in storedCoordinates, draw from previous coordinates to current
        2) if current coordinates is close to first coordinates, set mode to (''), create label inputs, set sections, clear coordinates
        3) add CanvasRenderingContext2D.lineJoin somewhere to join first and last points?
        */
        if (storedCoordinates.length >= 2) {
            if (mode === "rectangle" || mode === "circle") {
                Redraw_1.redrawCanvas(imageUrl, sections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
                var startX = storedCoordinates[0][0];
                var startY = storedCoordinates[0][1];
                var endX = storedCoordinates[1][0];
                var endY = storedCoordinates[1][1];
                var height = endY - startY;
                var width = endX - startX;
                if (mode === "rectangle") {
                    context.strokeRect(storedCoordinates[0][0], storedCoordinates[0][1], width, height);
                }
                if (mode === "circle") {
                    if (Math.abs(height) === Math.abs(width)) {
                        context.beginPath();
                        context.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height / 2), 0, 2 * Math.PI);
                        context.stroke();
                    }
                    else {
                        context.beginPath();
                        context.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
                        context.stroke();
                    }
                }
            }
            if (mode === "line") {
                var prev = storedCoordinates[storedCoordinates.length - 2];
                var current = storedCoordinates[storedCoordinates.length - 1];
                context.moveTo(prev[0], prev[1]);
                context.lineTo(current[0], current[1]);
                if (editorMode !== 'sheet')
                    context.stroke();
            }
        }
        if (editorMode === 'sheet' && canvasRef.current !== null) {
            Redraw_1.redrawCanvas(imageUrl, sections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, 1, 'sheet');
        }
    }, [storedCoordinates, editorMode, imageUrl, mode, scale, sections]);
    var assignLabel = function (label, index) {
        var _a;
        if (sections) {
            var prevLabel_1 = Object.keys(sections)[index];
            var subSection_1 = (_a = {}, _a[label] = sections[prevLabel_1], _a);
            var newState = Object.keys(sections).reduce(function (acc, curr) {
                var _a;
                if (curr === prevLabel_1) {
                    Object.assign(acc, subSection_1);
                }
                else {
                    Object.assign(acc, (_a = {}, _a[curr] = sections[curr], _a));
                }
                return acc;
            }, {});
            setSections(newState);
        }
    };
    var assignColor = function (label, rgba_color) {
        var _a;
        if (sections && label) {
            var context = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
            var newSections = sections;
            newSections[label].fillcolor = rgba_color;
            setSections(newSections);
            Redraw_1.redrawCanvas(imageUrl, newSections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
        }
    };
    /*
    will only fire if stat style is text
    */
    var assignShowText = function (label, isShown) {
        var _a;
        if (sections && label) {
            var context = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
            var newSections = sections;
            newSections[label].showLabel = isShown;
            setSections(newSections);
            Redraw_1.redrawCanvas(imageUrl, newSections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
        }
    };
    var assignStatStyle = function (label, statStyle) {
        var _a;
        if (sections && label) {
            var context = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
            var newSections = sections;
            newSections[label].style = statStyle;
            setSections(newSections);
            Redraw_1.redrawCanvas(imageUrl, newSections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
        }
    };
    var assignValue = function (values, label) {
        var _a;
        if (sections && values && label) {
            var context = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
            var newSections = sections;
            newSections[label].value = values;
            setSections(newSections);
            stageRef.current && Redraw_1.redrawCanvas(imageUrl, newSections, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
        }
    };
    var cropHandler = function (e) {
        var canvas = canvasRef.current;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if (mode === "rectangle" || mode === "circle") {
            //check to see if there are less than the 2 coordinate sets needed to create a rectangle, and make sure the previous coordinates are not the same
            if (storedCoordinates.length <= 1 && storedCoordinates[storedCoordinates.length - 1] !== [x, y]) {
                setStoredCoordinates(__spreadArrays(storedCoordinates, [[x, y]]));
                setModeClicked(true);
            }
        }
        if (mode === "line") {
            setStoredCoordinates(__spreadArrays(storedCoordinates, [[x, y]]));
            setModeClicked(true);
        }
    };
    /*
    if start X > end X, width = start X - end X, else width = end X - start X.
    if start Y > end Y, height = start Y - end Y, else height = end Y - start Y.
    */
    /*
    tracking for rectangle and circle tools
    */
    var handleMouseMove = function (e) {
        if (modeClicked === true) {
            var canvas = canvasRef.current;
            var rect = canvas.getBoundingClientRect();
            var x = Math.round(e.clientX - rect.left);
            var y = Math.round(e.clientY - rect.top);
            if (mode === "rectangle" || mode === "circle") {
                if (storedCoordinates.length >= 1)
                    setStoredCoordinates([storedCoordinates[0], [x, y]]);
            }
        }
    };
    var handleMouseUp = function () {
        var _a, _b;
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        if (mode === "rectangle") {
            if (storedCoordinates.length === 2) {
                var startX = storedCoordinates[0][0];
                var startY = storedCoordinates[0][1];
                var endX = storedCoordinates[1][0];
                var endY = storedCoordinates[1][1];
                var width = endX - startX;
                var height = endY - startY;
                context.strokeRect(startX, startY, width, height);
                setSections(__assign(__assign({}, sections), (_a = {}, _a[sections ? Object.keys(sections).length : 0] = { coordinates: storedCoordinates,
                    mode: mode,
                    value: { current: '', max: '' },
                    style: '',
                    fillcolor: fillColor
                }, _a)));
                setMode('');
                setStoredCoordinates([]);
                setModeClicked(false);
            }
        }
        if (mode === "circle") {
            if (storedCoordinates.length === 2) {
                var startX = storedCoordinates[0][0];
                var startY = storedCoordinates[0][1];
                var endX = storedCoordinates[1][0];
                var endY = storedCoordinates[1][1];
                var height = endY - startY;
                var width = endX - startX;
                if (Math.abs(height) === Math.abs(width)) {
                    context.beginPath();
                    context.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height / 2), 0, 2 * Math.PI);
                    context.stroke();
                }
                else {
                    context.beginPath();
                    context.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
                    context.stroke();
                }
                setSections(__assign(__assign({}, sections), (_b = {}, _b[sections ? Object.keys(sections).length : 0] = { coordinates: storedCoordinates,
                    mode: mode,
                    value: { current: '', max: '' },
                    style: '',
                    fillcolor: fillColor
                }, _b)));
                setMode('');
                setStoredCoordinates([]);
                setModeClicked(false);
            }
        }
    };
    var lineHandler = function (e) {
        var _a;
        if (mode !== "line") {
            setMode(e.target.value);
        }
        else {
            setMode('');
            setSections(__assign(__assign({}, sections), (_a = {}, _a[sections ? Object.keys(sections).length : 0] = { coordinates: storedCoordinates,
                mode: mode,
                value: { current: '', max: '' },
                style: '',
                fillcolor: fillColor
            }, _a)));
            setStoredCoordinates([]);
        }
    };
    var deleteStat = function (e, index) {
        var canvas = canvasRef.current;
        var context = canvas.getContext('2d');
        var newState = sections;
        e ? delete newState[e] : delete newState[index];
        setSections(__assign({}, newState));
        Redraw_1.redrawCanvas(imageUrl, newState, context, stageRef.current.offsetWidth, stageRef.current.offsetHeight, scale, editorMode);
    };
    var donwloadCanvas = function () {
        var _a = canvasRef.current.getBoundingClientRect(), width = _a.width, height = _a.height;
        var doc = new jspdf_1.jsPDF(height >= width ? 'p' : 'l', 'pt'); //options = portrait or landscape, unit of measurement ('points')
        doc.addImage(canvasRef.current, 'JPEG', 0, 0, width, height);
        doc.save(system_name ? system_name + ".pdf" : 'downloaded_sheet.pdf');
    };
    return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: scale < 1 ? 'column' : 'row', minWidth: sheetWidth * 1.5 } },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("input", { type: "file", accept: "image/*", onChange: function (e) { return handleFileChange(e); } }),
            editorMode === "editor" &&
                react_1["default"].createElement("div", { key: "button_container", id: "button_container" },
                    react_1["default"].createElement("button", { className: "toolButton", style: { backgroundColor: mode === "rectangle" ? "red" : "#e7e7e7" }, value: "rectangle", onClick: function (e) { return mode !== "rectangle" ? setMode(e.target.value) : setMode(''); }, key: "Rectangle" }, "Rectangle"),
                    react_1["default"].createElement("button", { className: "toolButton", style: { backgroundColor: mode === "circle" ? "red" : "#e7e7e7" }, value: "circle", onClick: function (e) { return mode !== "circle" ? setMode(e.target.value) : setMode(''); }, key: "Circle" }, "Circle"),
                    react_1["default"].createElement("button", { className: "toolButton", style: { backgroundColor: mode === "line" ? "red" : "#e7e7e7" }, value: "line", onClick: function (e) { return lineHandler(e); } }, "Line")),
            editorMode !== 'creator' &&
                react_1["default"].createElement("div", { ref: inputContainer, id: "labels", style: { display: "flex", flexDirection: "column", width: 300 } }, sections && Object.keys(sections).map(function (el, i) { return react_1["default"].createElement(SelectionInputs, { editorMode: editorMode, defaultStyle: sections[el].style, defaultValInput: sections[el].value, defaultLabel: Number(el) === i ? i : el, handleDelete: deleteStat, handleValue: assignValue, handleLabel: assignLabel, handleStatStyle: assignStatStyle, handleShowText: assignShowText, handleColor: assignColor, index: i, key: el }); }))),
        imageUrl ?
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("span", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        width: 260,
                        justifyContent: 'space-between',
                        marginLeft: 5,
                        marginBottom: 2
                    } },
                    react_1["default"].createElement("a", { download: system_name ? system_name : 'downloaded_sheet', href: (_b = canvasRef.current) === null || _b === void 0 ? void 0 : _b.toDataURL('image/jpeg', 1.0), style: {
                            textDecoration: 'none',
                            width: 120,
                            display: 'flex',
                            flexDirection: 'row'
                        } },
                        react_1["default"].createElement("div", { style: {
                                backgroundColor: theme.backgroundColor,
                                color: theme.color,
                                fontFamily: 'Fantasy'
                            } },
                            react_1["default"].createElement("svg", { className: "download_icon", viewBox: "0 0 10 10", height: 20, width: 35 },
                                react_1["default"].createElement("path", { fill: theme.color, d: "M 8 0 L 8 5 L 10 5 L 7 8 L 4 5 L 6 5 L 6 0 M 12 6 L 12 6 L 12 9 C 12 10 11 10 11 10 L 3 10 C 3 10 2 10 2 9 L 2 6 L 3 6 L 3 9 L 11 9 L 11 6" })),
                            "Image")),
                    react_1["default"].createElement("div", { onClick: function () { return donwloadCanvas(); }, style: {
                            cursor: 'pointer',
                            width: 120,
                            backgroundColor: theme.backgroundColor,
                            color: theme.color,
                            fontFamily: 'Fantasy'
                        } },
                        react_1["default"].createElement("svg", { className: "download_icon", viewBox: "0 0 10 10", height: 20, width: 35 },
                            react_1["default"].createElement("path", { fill: theme.color, d: "M 8 0 L 8 5 L 10 5 L 7 8 L 4 5 L 6 5 L 6 0 M 12 6 L 12 6 L 12 9 C 12 10 11 10 11 10 L 3 10 C 3 10 2 10 2 9 L 2 6 L 3 6 L 3 9 L 11 9 L 11 6" })),
                        "PDF")),
                react_1["default"].createElement("div", { className: "canvas_stage", ref: stageRef },
                    react_1["default"].createElement("canvas", { ref: canvasRef, style: { margin: 0 }, onMouseUp: handleMouseUp, onMouseMove: function (e) { return handleMouseMove(e); }, onMouseDown: function (e) { return cropHandler(e); } })))
            : react_1["default"].createElement("div", { id: "dropzone", onDrop: function (e) { return handleDrop(e); }, onDragOver: function (e) { return handleDrag(e); } }, "Drop File Here")));
};
exports["default"] = CanvasEditor;
