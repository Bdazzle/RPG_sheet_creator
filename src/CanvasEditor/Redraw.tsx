import { Sections, StatValues } from '../types/RPGtypes'

type Redraw = (
    imageUri: string,
    sections: Sections,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale?: number,
    editorMode?: string,
) => void;

type DrawText = (
    ctx: CanvasRenderingContext2D,
    point1: [number, number],
    point2: [number, number],
    alignment: CanvasTextAlign,
    baseLine: CanvasTextBaseline,
    scale: number,
    text: string,
    mode: string,
    // color: string,
    fontSize: number,
) => void

type DrawPips = (
    ctx: CanvasRenderingContext2D,
    point1: [number, number],
    point2: [number, number],
    style: string,
    scale: number,
    values: StatValues,
    pipChunk: number[],
    showLabel?: boolean,
) => void

/*
top left canvas corner is (0,0)
drawing along diagonals:
if point2[y] < point1[y] (line going up), startY -= pipDiameter
if point2[y] > point1[y] (line going down), startY += pipDiameter
*/
export const drawPips: DrawPips = (ctx, point1, point2, style, scale = 1, values, pipChunk, showLabel) => {
    /*
    pointN[0] = x 
    pointN[1] = y
    */

    if (point2 !== undefined) {
        const diffX = (point2[0] - point1[0]) * scale;
        const diffY = (point2[1] - point1[1]) * scale;

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
            const filled = Number(values.current)
            const pipDiameter = Math.round(Math.abs(Math.hypot(diffY, diffX) / pipChunk.length)) * scale

            let startX = point1[0] * scale
            const endX = point2[0] * scale
            const endY = point2[1] * scale
            let startY = point1[1] * scale
            for (let pip of pipChunk) {
                if (style === "Pips") {
                    /*
                    context.arc(center x, center y, radius, start angle, end angle)
                    if diffX  > diffY and showLabel :
                    then arc Y starts @ startY + Math.round(pipDiameter/2) and startX is normal (pips start farther down)
                    else arc X starts @ startX - Math.round(pipDiameter/2) and startY is normal (pips start farther left)
                    add pipDiameter/N to starting points to start first pip farther along line
                    */
                    ctx.beginPath()
                    if (showLabel) {
                        diffX > diffY ?
                            ctx.arc(startX + (pipDiameter / 3), startY + Math.round(pipDiameter / 2), Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                            :
                            ctx.arc(startX - Math.round(pipDiameter / 2), startY + (pipDiameter / 3), Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                    } else {
                        diffX > diffY ?
                            ctx.arc(startX + (pipDiameter / 3), startY, Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                            :
                            ctx.arc(startX, startY + (pipDiameter / 3), Math.round(pipDiameter / 2.5), 0, Math.PI * 2)
                    }
                    if (pip <= filled) { ctx.fill() } //if pip <= filled (max stat) draw filled
                    if (pip > filled) { ctx.stroke() } //if pip > filled (current stat) draw empty
                }
                if (style === "Checkboxes") {
                    /*
                    starting points for boxes to be centered on lines
                    startY>endY: startYbox = startY - (pipDiameter / 2)
                    startY<endY startYbox = startY + (pipDiameter / 2)
                    startX > endX = line right to left
                    startY > endY = line bottom to top
                    fill and strokes will have same arguments
                    */
                    // let startYbox = startY > endY ? startY - (pipDiameter / 2) : startY + (pipDiameter / 2);
                    // let startXbox = startX > endX ? startX - (pipDiameter/2) : startX + (pipDiameter/2)
                    let startYbox = startY > endY ? startY - (pipDiameter / 2) : startY;
                    let startXbox = startX > endX ? startX - (pipDiameter / 2) : startX

                    if (showLabel) {
                        if (diffX > diffY) {//greater selection width
                            if (pip <= filled) ctx.fillRect(startXbox, startYbox + (pipDiameter / 2), pipDiameter / 2, pipDiameter / 2)
                            if (pip > filled) ctx.strokeRect(startXbox, startYbox + (pipDiameter / 2), pipDiameter / 2, pipDiameter / 2)
                        }
                        if (diffX < diffY) {//greater selection height
                            if (pip <= filled) ctx.fillRect(startXbox - (pipDiameter / 2), startYbox, pipDiameter / 2, pipDiameter / 2)
                            if (pip > filled) ctx.strokeRect(startXbox - (pipDiameter / 2), startYbox, pipDiameter / 2, pipDiameter / 2)
                        }
                    } else {
                        if (pip <= filled) ctx.fillRect(startXbox, startYbox + (pipDiameter / 2), pipDiameter / 2, pipDiameter / 2)
                        if (pip > filled) ctx.strokeRect(startXbox, startYbox + (pipDiameter / 2), pipDiameter / 2, pipDiameter / 2)
                    }
                }
                startX += Math.round(diffX / pipChunk.length)
                startY += Math.round(diffY / pipChunk.length)
            }

        }

        ctx.rotate(Math.atan2(diffY, diffX));
        ctx.restore();
    }
}

export const drawText: DrawText = (ctx, point1, point2, alignment, baseLine, scale = 1, text, mode, fontSize) => {
    /*
    1) ctx.translate the context to the anchor point of the text, then
    2) ctx.rotate the context by the amount (in radians) you desire, and then
    3) fillText as normal.
    pointN[0] = x 
    pointN[1] = y
    need to use absolute value between point differences for font, translation, rotation, and line tangents. Negative values for these throw geometry off
    */
    if (point2 !== undefined) {
        const startX = point1[0] * scale
        const startY = point1[1] * scale
        const endX = point2[0] * scale
        const endY = point2[1] * scale
        const diffX = Math.abs((point2[0] - point1[0]) * scale);
        const diffY = Math.abs((point2[1] - point1[1]) * scale);
        ctx.save();
        /*
        if mode = line, the canvas will have to rotate to compensate for line angle,
        */
        ctx.textAlign = alignment;
        ctx.textBaseline = baseLine
        if (mode === 'line') {
            ctx.font = fontSize ? `${fontSize}px serif` : diffX >= diffY ? `${diffX / text.split('').length * 2}px serif` : `${diffY / text.split('').length * 2}px serif`
            /*
            translates to first point + difference between 2nd point and 1st point,
            then divides that in half to write text in center of line.
            */
            ctx.translate(point1[0] * scale + diffX / 2, point1[1] * scale + diffY / 2);
            //Math.atan2 returns angle in radians between (y,x)
            if ((endX < startX) && (endY < startY)) {//right to left, diagonally up
                ctx.rotate(Math.atan2(diffY, diffX));
                ctx.fillText(text, -diffX, 0)
            } else if ((endX < startX) && (endY > startY)) {//right to left, diagonally down
                ctx.rotate(-Math.atan2(diffY, diffX));
                ctx.fillText(text, -diffX, -diffY)
            }
            else if ((endX > startX) && (endY < startY)) {//left to right, diagonally up
                ctx.rotate(-Math.atan2(diffY, diffX));
                ctx.fillText(text, diffX/2, -diffY)
            }
            else {//left to right diagonally down
                ctx.rotate(Math.atan2(diffY, diffX));
                ctx.fillText(text, 0, 0);
            }
        } else {
            ctx.font = `${Math.abs(diffX) / text.split('').length * 2}px serif`
            /*
            shape started bottom to top (startY > endY), label will drawn on 2nd Y (point2[1] or coordinates[1][1])
            shape started top to bottom (startY < endY), label will drawn on 1st Y (point1[1] or coordinates[0][1])
            shape started left to right (startX < endX), label will drawn on 1st X (point1[0] or coordinates[0][0])
            shape started right to left (startX > endX), label will drawn on 2nd X (point2[0] or coordinates[1][0])
            */
            let textStartY = startY > endY ? endY : startY
            let textStartX = startX > endX ? endX : startX
            ctx.fillText(text, textStartX, textStartY);
        }
        ctx.restore();
    }
}
/*
example rectangle
(x1,y1)-----(x2,y1)
  |           |
(x1,y2)-----(x2,y2)
or reversed, (x1,y1) === first click coordinates on canvas
*/
//will only have 2 sets of coords, starting corner and opposite corner
export const redrawCanvas: Redraw = (imageUri, sections, ctx, width, height, scale = 1, editorMode) => {
    ctx.save()

    ctx.clearRect(0, 0, width, height);

    const canvasImage : HTMLImageElement = new Image()
    canvasImage.crossOrigin = "*"
    canvasImage.src = imageUri
    ctx.drawImage(canvasImage, 0, 0, width, height)

    
    for (let sectionKey in sections) {
        ctx.fillStyle = sections[sectionKey].fillcolor
        ctx.strokeStyle = sections[sectionKey].fillcolor
        console.log(sections[sectionKey])
        const startX = sections[sectionKey].coordinates[0][0] * scale
        const startY = sections[sectionKey].coordinates[0][1] * scale
        const endX = sections[sectionKey].coordinates[1][0] * scale
        const endY = sections[sectionKey].coordinates[1][1] * scale
        const height = endY - startY
        const width = endX - startX
        /*
        Line mode drawing Start 
        there will always be 1 less line than there are coordinates
        fillText if style ==="Text", else redraw with pips or checkboxes
        All chunking has a probelm is values.max is 1 > number of lines (sections[label].coordinates.length - 1)
        */
        if (sections[sectionKey].mode === "line") {
            const line = new Path2D()
            for (const point of sections[sectionKey].coordinates) {
                line.lineTo(point[0] * scale, point[1] * scale)
            }
            if (editorMode !== 'sheet') {
                ctx.stroke(line)
            }
            if (sections[sectionKey].style === "Text") {
                ctx.textAlign = "center"
                ctx.textBaseline = 'middle';
                if (sections[sectionKey].value.current.length > 0) {
                    const list = sections[sectionKey].value.current.indexOf(' ') ? sections[sectionKey].value.current.split(' ') : sections[sectionKey].value.current.split('')
                    const chunkSize = Math.ceil(list.length / (sections[sectionKey].coordinates.length - 1))
                    const chunks =  [...Array(Math.ceil(list.length / chunkSize))].map((_, index) => list.slice(chunkSize * index, chunkSize + chunkSize * index))
                    chunks.forEach((el, j) => {
                        drawText(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], 'center', 'ideographic', scale, el.join(''), 'line', sections[sectionKey].fontSize as number)
                    })
                }
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {
                if (sections[sectionKey].coordinates) {
                    const totalPipsArray: Array<number> = [...Array(Number(sections[sectionKey].value.max))].map((_, i) => i + 1)
                    const chunkSize = Math.ceil(Number(sections[sectionKey].value.max) / (sections[sectionKey].coordinates.length - 1))
                    const pipChunks = [...Array(Math.ceil(totalPipsArray.length / chunkSize))].map((_, i) => totalPipsArray.slice(chunkSize * i, chunkSize + chunkSize * i))
                    const labelChunks = sectionKey.indexOf(' ') ? sectionKey.split(' ') : [...Array(Math.ceil(sectionKey.length / chunkSize))].map((_, i) => sectionKey.slice(chunkSize * i, chunkSize + chunkSize * i))

                    pipChunks.forEach((el, j) => {
                        if (sections[sectionKey].showLabel) {
                            drawText(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], 'center', 'ideographic', scale, labelChunks[j], 'line', sections[sectionKey].fontSize as number)
                            drawPips(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], sections[sectionKey].style, scale, sections[sectionKey].value, el, true)
                        } else {
                            drawPips(ctx, sections[sectionKey].coordinates[j], sections[sectionKey].coordinates[j + 1], sections[sectionKey].style, scale, sections[sectionKey].value, el)
                        }
                    })
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
            if (editorMode !== 'sheet') ctx.strokeRect(startX, startY, width, height)

            if (sections[sectionKey].style === "Text") {
                ctx.font = `${Math.abs(width) / sectionKey.split('').length}px serif`
                ctx.textAlign = "center"
                ctx.textBaseline = 'middle';
                ctx?.fillText(sections[sectionKey].value.current, (startX + endX) / 2, (endY + startY) / 2)
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {

                const max = Number(sections[sectionKey].value.max)
                const filled = Number(sections[sectionKey].value.current)
                const pipDiameter = width / max
                let startX = sections[sectionKey].coordinates[0][0] * scale
                for (let pipCount = 0; pipCount < max; pipCount++) {
                    if (sections[sectionKey].style === "Pips") {
                        ctx.beginPath()
                        ctx.arc((startX + (pipDiameter / 2)), (endY + startY) / 2, Math.abs(pipDiameter) / 2.5, 0, Math.PI * 2)
                        if (pipCount < filled) ctx.fill()
                        if (pipCount >= filled) ctx.stroke()
                    }

                    if (sections[sectionKey].style === "Checkboxes") {
                        /*
                        fill formula for checkboxes:
                        startX + some fraction of pipDiameter, 
                        height of Y difference - pipDiameter/2
                        w/h = pipDiameter/2
                        all divide by 2 is for spacing, centering and visibility
                        */
                        if (pipCount < filled) ctx.fillRect(startX + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2)
                        if (pipCount >= filled) ctx.strokeRect(startX + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2)
                    }
                    startX += pipDiameter
                }
                if (sections[sectionKey].showLabel) {
                    drawText(ctx, sections[sectionKey].coordinates[0], sections[sectionKey].coordinates[1], 'start', 'ideographic', scale, sectionKey, 'rectangle', sections[sectionKey].fontSize as number)
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
            if (editorMode !== 'sheet') {
                if (Math.abs(height) === Math.abs(width)) {
                    ctx.beginPath()
                    ctx.arc((endX + startX) / 2, (endY + startY) / 2, Math.abs(height / 2), 0, 2 * Math.PI)
                    ctx.stroke()
                } else {
                    ctx.beginPath()
                    ctx.ellipse((endX + startX) / 2, (endY + startY) / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI)
                    ctx.stroke()
                }
            }
            if (sections[sectionKey].style === "Text") {
                ctx.font = `${Math.abs(height) / 3}px serif`
                ctx.textAlign = "center"
                ctx.textBaseline = 'middle';
                ctx?.fillText(sections[sectionKey].value.current, (startX + endX) / 2, (endY + startY) / 2)
            }
            if ((sections[sectionKey].style === "Pips" || "Checkboxes") && Number(sections[sectionKey].value.max)) {
                const max = Number(sections[sectionKey].value.max)
                const filled = Number(sections[sectionKey].value.current)
                const pipDiameter = width / max
                let startX = sections[sectionKey].coordinates[0][0] * scale
                for (let pipCount = 0; pipCount < max; pipCount++) {
                    if (sections[sectionKey].style === "Pips") {
                        ctx.beginPath()
                        ctx.arc(startX + (pipDiameter / 2), (endY + startY) / 2, Math.abs(pipDiameter / 2.5), 0, Math.PI * 2)
                        if (pipCount < filled) ctx.fill()
                        if (pipCount >= filled) ctx.stroke()
                    }
                    if (sections[sectionKey].style === "Checkboxes") {
                        /*
                        fill formula for checkboxes:
                        startX + some fraction of pipDiameter, 
                        height of Y difference - pipDiameter/2
                        w/h = pipDiameter/2
                        all divide by 2 is for spacing, centering and visibility
                        */
                        if (pipCount < filled) ctx.fillRect(startX + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2)
                        if (pipCount >= filled) ctx.strokeRect(startX + (pipDiameter / 3), ((endY + startY) - pipDiameter / 2) / 2, pipDiameter / 2, pipDiameter / 2)
                    }
                    startX += pipDiameter
                }
                if (sections[sectionKey].showLabel) {
                    drawText(ctx, sections[sectionKey].coordinates[0], sections[sectionKey].coordinates[1], 'start', 'ideographic', scale, sectionKey, 'circle', sections[sectionKey].fontSize as number)
                }
            }
        }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.restore()

}
