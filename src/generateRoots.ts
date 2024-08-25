import Jimp from "jimp"
import path from "path"
import { generateHexagon } from "./generateHexagon"

const rootColor = 0xFFFFFFFF

const getPixelsWithinRadius = (props: {
    x0: number,
    y0: number,
    radius: number
}) => {
    const { x0, y0, radius } = props
    const points = []
    for (let x = x0 - radius; x <= x0 + radius; x++) {
        for (let y = y0 - radius; y <= y0 + radius; y++) {
            const dx = x - x0
            const dy = y - y0
            if (dx * dx + dy * dy <= radius * radius) {
                points.push([x, y])
            }
        }
    }
    return points
}

const drawCircle = (props: {
    jimp: Jimp,
    x0: number,
    y0: number,
    radius: number
}) => {
    const { jimp, x0, y0, radius } = props
    const points = getPixelsWithinRadius({ x0, y0, radius })

    console.log(points)

    points.forEach(([x, y]) => {
        jimp.setPixelColor(rootColor, x, y)
    })
}

const generateRoot = (props: {
    jimp: Jimp,
    rootWidth: number
}) => {
    const { jimp, rootWidth } = props
    const width = jimp.getWidth()
    const height = jimp.getHeight()
    const centerX = width / 2
    const centerY = height / 2

    const root = jimp.clone()

    root.scan(0, 0, width, height, (x, y) => {
        if (x === centerX && y < centerY) {
            drawCircle({ jimp: root, x0: x, y0: y, radius: rootWidth / 2 })
        }

        if (x === centerX - 1 && y < centerY) {
            drawCircle({ jimp: root, x0: x, y0: y, radius: rootWidth / 2 })
        }
    })

    return root
}

const removeNonRootPixels = (props: {
    jimp: Jimp,
}) => {
    const { jimp } = props
    
    const root = jimp.clone()
    jimp.scan(0, 0, jimp.getWidth(), jimp.getHeight(), (x, y) => {
        const color = jimp.getPixelColor(x, y)
        if (color !== rootColor) {
            root.setPixelColor(0x00000000, x, y)
        }
    })

    return root
}

export const generateRootHex = (props: {
    diameter: number,
    rootWidth: number,
    canvasSize: number
}) => {
    const { diameter, rootWidth, canvasSize } = props
    
    const jimp = new Jimp(canvasSize, canvasSize, 0x00000000)
    const rootJimp = generateRoot({ jimp, rootWidth})
    const hexJimp = generateHexagon({ diameter, canvasSize }).filledInversed
    
    const composed = rootJimp.composite(hexJimp, 0, 0, {
        mode: Jimp.BLEND_DIFFERENCE,
        opacitySource: 0.5,
        opacityDest: 1,
    })

    const rootOnly = removeNonRootPixels({ jimp: composed })
    return rootOnly
}