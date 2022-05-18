"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.redrawCanvas = exports.DrawText = exports.drawPips = void 0;
/*
top left canvas corner is (0,0)
drawing along diagonals:
if point2[y] < point1[y] (line going up), startY -= pipDiameter
if point2[y] > point1[y] (line going down), startY += pipDiameter
*/
exports.drawPips = function (ctx, point1, point2, style, scale, values, pipChunk, showLabel) {
    if (scale === void 0) { scale = 1; }
    /*
    pointN[0] = x
    pointN[1] = y
    */
    if (point2 !== undefined) {
        var diffX = (point2[0] - point1[0]) * scale;
        var diffY = (point2[1] - point1[1]) * scale;
        ctx.save();
        /*
        translates to first point + difference between 2nd point and 1st point,
        then divides that in half to write text in center of line.
        */
        // ctx.translate(point1[0] * scale + diffX / 2, point1[1] * scale + diffY / 2);
        /*
        Math.atan2 returns angle in radians between (y,x)
        if we rotate canvas, may only need to adjust startX to draw pips
        */
        // ctx.rotate(Math.atan2(diffY, diffX));
        if (values && pipChunk) {
            var filled = Number(values.current);
            var pipDiameter = Math.round(Math.abs(Math.hypot(diffY, diffX) / pipChunk.length)) * scale;
            var startX = point1[0] * scale;
            var endX = point2[0] * scale;
            var endY = point2[1] * scale;
            var startY = point1[1] * scale;
            for (var _i = 0, pipChunk_1 = pipChunk; _i < pipChunk_1.length; _i++) {
                var pip = pipChunk_1[_i];
                if (style === "Pips") {
                    /*
                    context.arc(center x, center y, radius, start angle, end angle)
                    if diffX  > diffY and showLabel :
                    then arc Y starts @ startY + Math.round(pipDiameter/2) and startX is normal (pips start farther down)
                    else arc X starts @ startX - Math.round(pipDiameter/2) and startY is normal (pips start farther left)
                    add pipDiameter/N to starting points to start first pip farther along line
                    */
                    ctx.beginPath();
                    if (showLabel) {
                        diffX > diffY ?
                            ctx.arc(startX + (pipDiameter / 3), startY + Math.round(pipDiameter / 2), Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                            :
                                ctx.arc(startX - Math.round(pipDiameter / 2), startY + (pipDiameter / 3), Math.round(pipDiameter / 2.5), 0, Math.PI * 2);
                    }
                    else {
                        diffX > diffY ?
                            ctx.arc(startX + (pipDiameter / 3), startY, Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                            :
                                ctx.arc(startX, startY + (pipDiameter / 3), Math.round(pipDiameter / 2.5), 0, Math.PI * 2);
                    }
                    if (pip <= filled) {
                        ctx.fill();
                    } //if pip <= filled (max stat) draw filled
                    if (pip > filled) {
                        ctx.stroke();
                    } //if pip > filled (current stat) draw empty
                }
                if (style === "Checkboxes") {
                    /*
                    starting points for boxes to be centered on lines
                    startY>endY: startYbox = startY - (pipDiameter / 2)
                    startY<endY startYbox = startY + (pipDiameter / 2)
                    */
                    var startYbox = startY > endY ? startY - (pipDiameter / 2) : startY + (pipDiameter / 2);
                    if (pip <= filled)
                        ctx.fillRect(startX + (pipDiameter / 3), startYbox, pipDiameter / 2, pipDiameter / 2);
                    if (pip > filled)
                        ctx.strokeRect(startX + (pipDiameter / 3), startYbox, pipDiameter / 2, pipDiameter / 2);
                }
                startX += Math.round(diffX / pipChunk.length);
                startY += Math.round(diffY / pipChunk.length);
            }
        }
        ctx.rotate(Math.atan2(diffY, diffX));
        ctx.restore();
    }
};
exports.DrawText = function (ctx, point1, point2, alignment, baseLine, scale, text, mode) {
    if (scale === void 0) { scale = 1; }
    /*
    1) ctx.translate the context to the anchor point of the text, then
    2) ctx.rotate the context by the amount (in radians) you desire, and then
    3) fillText as normal.
    pointN[0] = x
    pointN[1] = y
    */
    if (point2 !== undefined) {
        var startX = point1[0] * scale;
        var startY = point1[1] * scale;
        var endX = point2[0] * scale;
        var endY = point2[1] * scale;
        var diffX = (point2[0] - point1[0]) * scale;
        var diffY = (point2[1] - point1[1]) * scale;
        ctx.save();
        /*
        if mode = line, the canvas will have to rotate to compensate for line angle,
        */
        ctx.textAlign = alignment;
        ctx.textBaseline = baseLine;
        if (mode === 'line') {
            ctx.font = diffX >= diffY ? diffX / text.split('').length * 2 + "px serif" : diffY / text.split('').length * 2 + "px serif";
            /*
            translates to first point + difference between 2nd point and 1st point,
            then divides that in half to write text in center of line.
            */
            ctx.translate(point1[0] * scale + diffX / 2, point1[1] * scale + diffY / 2);
            //Math.atan2 returns angle in radians between (y,x)
            ctx.rotate(Math.atan2(diffY, diffX));
            ctx.fillText(text, 0, 0);
        }
        else {
            ctx.font = Math.abs(diffX) / text.split('').length * 2 + "px serif";
            /*
            shape started bottom to top (startY > endY), label will drawn on 2nd Y (point2[1] or coordinates[1][1])
            shape started top to bottom (startY < endY), label will drawn on 1st Y (point1[1] or coordinates[0][1])
            shape started left to right (startX < endX), label will drawn on 1st X (point1[0] or coordinates[0][0])
            shape started right to left (startX > endX), label will drawn on 2nd X (point2[0] or coordinates[1][0])
            */
            var textStartY = startY > endY ? endY : startY;
            var textStartX = startX > endX ? endX : startX;
            ctx.fillText(text, textStartX, textStartY);
        }
        ctx.restore();
    }
};
/*
example rectangle
(x1,y1)-----(x2,y1)
  |           |
(x1,y2)-----(x2,y2)
or reversed, (x1,y1) === first click coordinates on canvas
*/
//will only have 2 sets of coords, starting corner and opposite corner
exports.redrawCanvas = function (imageUri, sections, ctx, width, height, scale, editorMode) {
    if (scale === void 0) { scale = 1; }
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    var canvasImage = new Image();
    canvasImage.src = imageUri;
    ctx.drawImage(canvasImage, 0, 0, width, height);
    var _loop_1 = function (sectionKey) {
        /*
        Line mode drawing Start
        there will always be 1 less line than there are coordinates
        fillText if style ==="Text", else redraw with pips or checkboxes
        All chunking has a probelm is values.max is 1 > number of lines (sections[label].coordinates.length - 1)
        */
        if (sections[sectionKey].mode === "line") {
            var line = new Path2D();
            for (var _i = 0, _a = sections[sectionKey].coordinates; _i < _a.length; _i++) {
                var point = _a[_i];
                line.lineTo(point[0] * scale, point[1] * scale);
            }
            if (editorMode !== 'sheet') {
                ctx.stroke(line);
            }
            if (sections[sectionKey].style === "Text") {
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                if (sections[sectionKey].value.current.length > 0) {
                    var list_1 = sections[sectionKey].value.current.split('');
                    var chunkSize_1 = Math.ceil(list_1.length / (sections[sectionKey].coordinates.length - 1));
                    var chunks = __spreadArrays(Array(Math.ceil(list_1.length / chunkSize_1))).map(function (_, index) { return list_1.slice(chunkSize_1 * index, chunkSize_1 + chunkSize_1 * index); });
                    chunks.forEach(function (el, j) {
                        exports.DrawText(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], 'center', 'ideographic', scale, el.join(''), 'line');
                    });
                }
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {
                if (sections[sectionKey].coordinates) {
                    var totalPipsArray_1 = __spreadArrays(Array(Number(sections[sectionKey].value.max))).map(function (_, i) { return i + 1; });
                    var chunkSize_2 = Math.ceil(Number(sections[sectionKey].value.max) / (sections[sectionKey].coordinates.length - 1));
                    var pipChunks = __spreadArrays(Array(Math.ceil(totalPipsArray_1.length / chunkSize_2))).map(function (_, i) { return totalPipsArray_1.slice(chunkSize_2 * i, chunkSize_2 + chunkSize_2 * i); });
                    var labelChunks_1 = sectionKey.indexOf(' ') ? sectionKey.split(' ') : __spreadArrays(Array(Math.ceil(sectionKey.length / chunkSize_2))).map(function (_, i) { return sectionKey.slice(chunkSize_2 * i, chunkSize_2 + chunkSize_2 * i); });
                    pipChunks.forEach(function (el, j) {
                        if (sections[sectionKey].showLabel) {
                            exports.DrawText(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], 'center', 'ideographic', scale, labelChunks_1[j], 'line');
                            exports.drawPips(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], sections[sectionKey].style, scale, sections[sectionKey].value, el, true);
                        }
                        else {
                            exports.drawPips(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], sections[sectionKey].style, scale, sections[sectionKey].value, el);
                        }
                    });
                }
            }
        }
        /*
        Rectangle Mode drawing start

        write text along bottom line, X = coordinates[0][0], Y = coordinates[1][1]
        font px = width / label length
        fillText if style ==="Text", else redraw with pips or checkboxes
        only difference between variables used to draw pips and checkboxes is context drawing
        */
        if (sections[sectionKey].mode === "rectangle") {
            var startX = sections[sectionKey].coordinates[0][0] * scale;
            var startY = sections[sectionKey].coordinates[0][1] * scale;
            var endX = sections[sectionKey].coordinates[1][0] * scale;
            var endY = sections[sectionKey].coordinates[1][1] * scale;
            var height_1 = endY - startY;
            var width_1 = endX - startX;
            if (editorMode !== 'sheet')
                ctx.strokeRect(startX, startY, width_1, height_1);
            if (sections[sectionKey].style === "Text") {
                ctx.font = width_1 / sectionKey.split('').length + "px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx === null || ctx === void 0 ? void 0 : ctx.fillText(sections[sectionKey].value.current, (startX + endX) / 2, (endY + startY) / 2);
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {
                var max = Number(sections[sectionKey].value.max);
                var filled = Number(sections[sectionKey].value.current);
                var pipDiameter = width_1 / max;
                var startX_1 = sections[sectionKey].coordinates[0][0] * scale;
                for (var pipCount = 0; pipCount < max; pipCount++) {
                    if (sections[sectionKey].style === "Pips") {
                        ctx.beginPath();
                        ctx.arc((startX_1 + (pipDiameter / 2)), (endY + startY) / 2, Math.abs(pipDiameter) / 2.5, 0, Math.PI * 2);
                        if (pipCount < filled)
                            ctx.fill();
                        if (pipCount >= filled)
                            ctx.stroke();
                    }
                    if (sections[sectionKey].style === "Checkboxes") {
                        /*
                        fill formula for checkboxes:
                        startX + some fraction of pipDiameter,
                        height of Y difference - pipDiameter/2
                        w/h = pipDiameter/2
                        all divide by 2 is for spacing, centering and visibility
                        */
                        if (pipCount < filled)
                            ctx.fillRect(startX_1 + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2);
                        if (pipCount >= filled)
                            ctx.strokeRect(startX_1 + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2);
                    }
                    startX_1 += pipDiameter;
                }
                if (sections[sectionKey].showLabel) {
                    exports.DrawText(ctx, sections[sectionKey].coordinates[0], sections[sectionKey].coordinates[1], 'start', 'ideographic', scale, sectionKey, 'rectangle');
                }
            }
        }
        /*
        Cirlce mode drawing start

        write text through middle, X = (endX + startX) / 2, Y = (endY + startY) / 2
        font px = height of circle / 3 = greater Y - lesser Y /3, depending on start coordinates
        fillText if style ==="Text", else redraw with pips or checkboxes
        */
        if (sections[sectionKey].mode === "circle") {
            var startX = sections[sectionKey].coordinates[0][0] * scale;
            var startY = sections[sectionKey].coordinates[0][1] * scale;
            var endX = sections[sectionKey].coordinates[1][0] * scale;
            var endY = sections[sectionKey].coordinates[1][1] * scale;
            var height_2 = endY - startY;
            var width_2 = endX - startX;
            if (editorMode !== 'sheet') {
                if (Math.abs(height_2) === Math.abs(width_2)) {
                    ctx.beginPath();
                    ctx.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height_2 / 2), 0, 2 * Math.PI);
                    ctx.stroke();
                }
                else {
                    ctx.beginPath();
                    ctx.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width_2 / 2), Math.abs(height_2 / 2), 0, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
            if (sections[sectionKey].style === "Text") {
                ctx.font = height_2 / 3 + "px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx === null || ctx === void 0 ? void 0 : ctx.fillText(sections[sectionKey].value.current, (startX + endX) / 2, (endY + startY) / 2);
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {
                var max = Number(sections[sectionKey].value.max);
                var filled = Number(sections[sectionKey].value.current);
                var pipDiameter = width_2 / max;
                var startX_2 = sections[sectionKey].coordinates[0][0] * scale;
                for (var pipCount = 0; pipCount < max; pipCount++) {
                    if (sections[sectionKey].style === "Pips") {
                        ctx.beginPath();
                        ctx.arc(startX_2 + (pipDiameter / 2), (endY + startY) / 2, Math.abs(pipDiameter / 2.5), 0, Math.PI * 2);
                        if (pipCount < filled)
                            ctx.fill();
                        if (pipCount >= filled)
                            ctx.stroke();
                    }
                    if (sections[sectionKey].style === "Checkboxes") {
                        /*
                        fill formula for checkboxes:
                        startX + some fraction of pipDiameter,
                        height of Y difference - pipDiameter/2
                        w/h = pipDiameter/2
                        all divide by 2 is for spacing, centering and visibility
                        */
                        if (pipCount < filled)
                            ctx.fillRect(startX_2 + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2);
                        if (pipCount >= filled)
                            ctx.strokeRect(startX_2 + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2);
                    }
                    startX_2 += pipDiameter;
                }
                if (sections[sectionKey].showLabel) {
                    exports.DrawText(ctx, sections[sectionKey].coordinates[0], sections[sectionKey].coordinates[1], 'start', 'ideographic', scale, sectionKey, 'circle');
                }
            }
        }
    };
    for (var sectionKey in sections) {
        _loop_1(sectionKey);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
};
