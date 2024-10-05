import path from "path"
import { generateRotatedHexagons } from "./generators/generateRotatedHexagons"
import { generateCombos, generateSpritesheet } from "./generators/generateSpritesheet"
import Jimp from "jimp"
import commandLineArgs from "command-line-args"

const outDir = path.join(__dirname, '..', 'src', 'dirtOutputs')

const getArgs = () => {
    const optionDefinitions = [
        { name: 'base', type: String },
        { name: 'side', type: String }
    ]
    const { base, side } = commandLineArgs(optionDefinitions)

    if (typeof base !== 'string') {
        throw new Error('base is required')
    }

    if (typeof side !== 'string') {
        throw new Error('side is required')
    }

    return { base, side }
}

const generateSheet = async (basePath: string, sidePath: string) => {
    const base = await Jimp.read(basePath)
    const oneSideOnly = await Jimp.read(sidePath)
    
    const rotated = generateRotatedHexagons(oneSideOnly)
    rotated.forEach((rotated, i) => {
        rotated.write(path.join(outDir, 'rotateOutputs', `root_${i}.png`))
    })
           
    const combos = generateCombos([base, ...rotated])
    combos.forEach((combo, i) => {
        combo.write(path.join(outDir, 'comboOutputs', `combo_${i}.png`))
    })
    
    const sheet = generateSpritesheet(combos)
    sheet.write(path.join(outDir, 'sheetOutputs', 'sheet.png'))
}

const { base, side } = getArgs()
generateSheet(base, side)