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
        { name: 'nEdge', type: String, defaultValue: null },
        { name: 'neEdge', type: String, defaultValue: null },
        { name: 'seEdge', type: String, defaultValue: null },
        { name: 'sEdge', type: String, defaultValue: null },
        { name: 'swEdge', type: String, defaultValue: null },
        { name: 'nwEdge', type: String, defaultValue: null },
        { name: 'nBase', type: String, defaultValue: null },
        { name: 'neBase', type: String, defaultValue: null },
        { name: 'seBase', type: String, defaultValue: null },
        { name: 'sBase', type: String, defaultValue: null },
        { name: 'swBase', type: String, defaultValue: null },
        { name: 'nwBase', type: String, defaultValue: null }
    ]

    const args = commandLineArgs(optionDefinitions)
    const { base, side  } = args

    if (typeof base !== 'string') {
        throw new Error('base is required')
    }

    if (typeof side !== 'string') {
        throw new Error('side is required')
    }

    return { ...args, base, side } as any
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

const{ base, side, nwEdge, nEdge, neEdge, nwBase, nBase, neBase} = getArgs()

const edge3dSides = [nEdge, neEdge, null, null, null, nwEdge]
const base3dSides = [nBase, neBase, null, null, null, nwBase]

generateSheet(base, side, base3dSides, edge3dSides)