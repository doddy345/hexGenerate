import path from "path"
import { generateRotatedHexagons } from "./generators/generateRotatedHexagons"
import { generateCombos, generateSpritesheet } from "./generators/generateSpritesheet"
import Jimp from "jimp"
import commandLineArgs from "command-line-args"

const outDir = path.join(__dirname, '..', 'src', 'dirtOutputs')

const getArgs = () => {
    const optionDefinitions = [
        { name: 'base', type: String },
        { name: 'side', type: String },
        { name: 'n3dSideEdge', type: String, defaultValue: null },
        { name: 'nw3dSideEdge', type: String, defaultValue: null },
        { name: 'sw3dSideEdge', type: String, defaultValue: null },
        { name: 'n3dSideBase', type: String, defaultValue: null },
        { name: 'nw3dSideBase', type: String, defaultValue: null },
        { name: 'sw3dSideBase', type: String, defaultValue: null },
    ]
    const { base, side, n3dSideEdge, nw3dSideEdge, sw3dSideEdge, n3dSideBase, nw3dSideBase, sw3dSideBase } = commandLineArgs(optionDefinitions)

    if (typeof base !== 'string') {
        throw new Error('base is required')
    }

    if (typeof side !== 'string') {
        throw new Error('side is required')
    }

    return { base, side, n3dSideEdge, nw3dSideEdge, sw3dSideEdge, n3dSideBase, nw3dSideBase, sw3dSideBase }
}

const generateSheet = async (basePath: string, sidePath: string, threeDimensionSidesPathsEdge: Array<string | null>,  threeDimensionSidesPathsBase: Array<string | null>) => {
    const base = await Jimp.read(basePath)
    const oneSideOnly = await Jimp.read(sidePath)

    const threeDimensionSidesEdge = await Promise.all(threeDimensionSidesPathsEdge.map(async (path) => 
        path != null ? Jimp.read(path) : null
    ))

    const threeDimensionSidesBase = await Promise.all(threeDimensionSidesPathsBase.map(async (path) => 
        path != null ? Jimp.read(path) : null
    ))
    
    const rotated = generateRotatedHexagons(oneSideOnly)
    rotated.forEach((rotated, i) => {
        rotated.write(path.join(outDir, 'rotateOutputs', `root_${i}.png`))
    })
           
    const combos = generateCombos([base, ...rotated], threeDimensionSidesBase, threeDimensionSidesEdge)
    combos.forEach((combo, i) => {
        combo.write(path.join(outDir, 'comboOutputs', `combo_${i}.png`))
    })
    
    const sheet = generateSpritesheet(combos)
    sheet.write(path.join(outDir, 'sheetOutputs', 'dirt_sheet.png'))
}

const{ base, side , n3dSideEdge, nw3dSideEdge, sw3dSideEdge, n3dSideBase, nw3dSideBase, sw3dSideBase} = getArgs()

const edge3dSides = [n3dSideEdge, null, null, null, sw3dSideEdge, nw3dSideEdge]
const base3dSides = [n3dSideBase, null, null, null, sw3dSideBase, nw3dSideBase]

generateSheet(base, side, base3dSides, edge3dSides)