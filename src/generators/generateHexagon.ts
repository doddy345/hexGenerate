import Jimp from "jimp"

const getHexagonCorners = (radius: number): [number, number][] => {
    const corners: [number, number][] = []
    for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i
        const angleRad = Math.PI / 180 * angleDeg
        const x = radius * Math.cos(angleRad)
        const y = radius * Math.sin(angleRad)
        corners.push([Math.round(x),Math.round(y)])
    }
    return corners
}

const bresenhamLine = (x0: number, y0: number, x1: number, y1: number): [number, number][] => {
    const points: [number, number][] = []
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx - dy

    let x = x0
    let y = y0

    while (true) {
        points.push([x, y])

        if (x === x1 && y === y1) {
            break
        }

        const e2 = 2 * err
        if (e2 > -dy) {
            err -= dy
            x += sx
        }
        if (e2 < dx) {
            err += dx
            y += sy
        }
    }

    return points
}

const fillHex = (jimp: Jimp, hexColor: number) => {
    const width = jimp.getWidth()
    const height = jimp.getHeight()

    const filled = jimp.clone()
    const filledInversed = jimp.clone()

    let withinHex = false
    let onBorder = false

    filled.scan(0, 0, width, height, (x, y, idx) => {
        if (x === 0) {
            withinHex = false
            onBorder = false
        }

        if (jimp.getPixelColor(x, y) === hexColor && jimp.getPixelColor(x + 1, y) === hexColor) {
            onBorder = true
        }

        if (jimp.getPixelColor(x, y) === hexColor) {
            withinHex = !withinHex
        }

        if (withinHex && !onBorder) {
            filled.setPixelColor(hexColor, x, y)
        }
        else {
            filledInversed.setPixelColor(hexColor, x, y)
        }
    })

    return { filled, filledInversed }
}

export const generateHexagon = (props: {
    diameter: number
    canvasSize: number
    color?: number
}) => {
    const { diameter, canvasSize, color = 0xFF0000FF } = props
    
    const radius = diameter / 2
    const centerX = canvasSize / 2
    const centerY = canvasSize / 2

    const hexJimp = new Jimp(canvasSize, canvasSize, 0x00000000)

    const cornerDeltas = getHexagonCorners(radius)
    const corners = cornerDeltas.map(([x, y]) => [centerX + x, centerY + y])
    const lines = corners.flatMap((corner, i) => {
        const nextCorner = corners[(i + 1) % corners.length]
        const thisLine = bresenhamLine(corner[0], corner[1], nextCorner[0], nextCorner[1])
        return thisLine
    })

    lines.forEach(([x, y], i) => {
        hexJimp.setPixelColor(color, x, y)
    })

    const filledHex = fillHex(hexJimp, color)

    return filledHex
}
