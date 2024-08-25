import path from "path"
import { generateHexagon } from "./generateHexagon"
import { generateRootHex } from "./generateRoots"

const hexagon = generateHexagon({
    diameter: 120,
    canvasSize: 128
})

hexagon.filled.write(path.join(__dirname, '..', 'src', 'hexOutputs', 'hexagon.png'))
hexagon.filledInversed.write(path.join(__dirname, '..', 'src', 'hexOutputs', 'hexagonInversed.png'))

generateRootHex({
    diameter: 120,
    rootWidth: 20,
    canvasSize: 128
}).write(path.join(__dirname, '..', 'src', 'rootOutputs', 'root.png'))