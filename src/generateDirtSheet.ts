import path from "path"
import { generateHexagon } from "./generators/generateHexagon"
import { generateBaseCircle, generateRootHex } from "./generators/generateRoots"
import { generateRotatedHexagons } from "./generators/generateRotatedHexagons"
import { generateCombos, generateSpritesheet } from "./generators/generateSpritesheet"
import Jimp from "jimp"

const canvasSize = 128
const outDir = path.join(__dirname, '..', 'src', 'dirtOutputs')

const generateSheet = async (infile: string) => {
    const hexagon = generateHexagon({
        diameter: 121,
        canvasSize,
        color: 0x986B39FF
    })
    
    hexagon.filled.write(path.join(outDir, 'hexOutputs', 'hexagon.png'))
    
    const oneSideOnly = await Jimp.read(infile)
    
    const rotated = generateRotatedHexagons(oneSideOnly)
    rotated.forEach((rotated, i) => {
        rotated.write(path.join(outDir, 'rotateOutputs', `root_${i}.png`))
    })
           
    const combos = generateCombos([hexagon.filled, ...rotated])
    combos.forEach((combo, i) => {
        combo.write(path.join(outDir, 'comboOutputs', `combo_${i}.png`))
    })
    
    const sheet = generateSpritesheet(combos)
    sheet.write(path.join(outDir, 'sheetOutputs', 'sheet.png'))
}

generateSheet(path.join(__dirname, '..', 'singleDirtBase.png'))