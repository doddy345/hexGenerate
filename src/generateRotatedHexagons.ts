import Jimp from "jimp";
import path from "path";
import * as fs from 'fs';

const inDir = path.join(__dirname, '..', 'src', 'rotateInputs')

export const generateRotatedHexagons = (jimp: Jimp): Jimp[] => {
    const angles = [0, 300, 240, 180, 120, 60]
    return angles.map(angle => {
        const rotated = jimp.clone()
        rotated.rotate(angle, false)
        return rotated
    })
}

const processFile = async (file: string) => {
    const fileNameWithoutExtension = file.split('.')[0]
    const fullPath = path.join(inDir, file)
    const jimp = await Jimp.read(fullPath)

    generateRotatedHexagons(jimp).forEach((rotated, i) => {
        const outLocation = `src/rotateOutputs/${fileNameWithoutExtension}/hexagon_${i}.png`
        rotated.write(outLocation)
    })
}

const processInput = async () => {
    fs.readdirSync(inDir).map(processFile); 
}

processInput()
