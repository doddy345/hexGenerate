import path from "path"
import { generateHexagon } from "./generators/generateHexagon"
import { generateBaseCircle, generateRootHex } from "./generators/generateRoots"
import { generateRotatedHexagons } from "./generators/generateRotatedHexagons"
import { generateCombos, generateSpritesheet } from "./generators/generateSpritesheet"

const canvasSize = 128
const outDir = path.join(__dirname, '..', 'src', 'rootOutputs')

const hexagon = generateHexagon({
    diameter: 120,
    canvasSize
})

hexagon.filled.write(path.join(outDir, 'hexOutputs', 'hexagon.png'))
hexagon.filledInversed.write(path.join(outDir, 'hexOutputs', 'hexagonInversed.png'))

const rootOnly = generateRootHex({
    diameter: 121,
    rootWidth: 20,
    canvasSize
}).write(path.join(outDir, 'rootOutputs', 'root.png'))

const rotated = generateRotatedHexagons(rootOnly)
rotated.forEach((rotated, i) => {
    rotated.write(path.join(outDir, 'rotateOutputs', `root_${i}.png`))
})

const base = generateBaseCircle({
    diameter: 20,
    canvasSize
})

base.write(path.join(outDir, 'baseOutputs', 'base.png'))

const combos = generateCombos([base, ...rotated])
combos.forEach((combo, i) => {
    combo.write(path.join(outDir, 'comboOutputs', `combo_${i}.png`))
})

const sheet = generateSpritesheet(combos)
sheet.write(path.join(outDir, 'sheetOutputs', 'sheet.png'))