import path from "path"
import { generateHexagon } from "./generators/generateHexagon"
import { generateSpritesheet } from "./generators/generateSpritesheet"

const outDir = path.join(__dirname, '..', 'src', 'colorsOutputs')

const colors = [0xFF0000FF, 0x00FF00FF, 0x0000FFFF, 0xFFFF00FF, 0xFF00FFFF, 0x00FFFFFF, 0xFFFFFFFF, 0x000000FF]
const coloredHexagons = colors.map(color => generateHexagon({  
    diameter: 481,
    canvasSize: 511,
    color
}).filled)

coloredHexagons.forEach((hexagon, i) => {
    hexagon.write(path.join(outDir, 'hexOutputs', `hexagon_${i}.png`))
})

const sheet = generateSpritesheet(coloredHexagons)
sheet.write(path.join(outDir, 'sheetOutputs', 'sheet.png'))