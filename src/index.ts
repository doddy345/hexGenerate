import path from "path"
import { generateHexagon } from "./generateHexagon"
import { generateRootHex } from "./generateRoots"
import { generateRotatedHexagons } from "./generateRotatedHexagons"
import { generateCombos, generateSpritesheet } from "./generateSpritesheet"
import Jimp from "jimp"

const canvasSize = 128

const hexagon = generateHexagon({
    diameter: 120,
    canvasSize
})

hexagon.filled.write(path.join(__dirname, '..', 'src', 'hexOutputs', 'hexagon.png'))
hexagon.filledInversed.write(path.join(__dirname, '..', 'src', 'hexOutputs', 'hexagonInversed.png'))

const rootOnly = generateRootHex({
    diameter: 121,
    rootWidth: 20,
    canvasSize
}).write(path.join(__dirname, '..', 'src', 'rootOutputs', 'root.png'))

const rotated = generateRotatedHexagons(rootOnly)
rotated.forEach((rotated, i) => {
    rotated.write(path.join(__dirname, '..', 'src', 'rotateOutputs', `root_${i}.png`))
})

const base = new Jimp(canvasSize, canvasSize)

const combos = generateCombos([base, ...rotated])
combos.forEach((combo, i) => {
    combo.write(path.join(__dirname, '..', 'src', 'comboOutputs', `combo_${i}.png`))
})

const sheet = generateSpritesheet(combos)
sheet.write(path.join(__dirname, '..', 'src', 'sheetOutputs', 'sheet.png'))