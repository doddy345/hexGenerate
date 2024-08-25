import * as fs from 'fs';
import Jimp from 'jimp';
import path from 'path';

const inDir = path.join(__dirname, '..', 'src', 'inputs')

const getInputJimps = async () => {
    const jimpPromises = fs.readdirSync(inDir).map(file => {
        const fullPath = path.join(inDir, file)
        return Jimp.read(fullPath)
    }); 

    return Promise.all(jimpPromises)
}

const index = async () => {
    const [initial, ...inJimps] = await getInputJimps()
    const outDir = path.join(__dirname, '..', 'src', 'outputs')

    initial.write(path.join(outDir, 'output_00.png'))

    for (let i = 1; i < 64; i++) {
        const base = initial.clone()
        inJimps.forEach((jimp, jimpIndex) => {
            const pow = Math.pow(2, jimpIndex)
            if ((i & pow) === pow) {
                base.composite(jimp, 0, 0)
            }
        })
        const outFileIndex = i.toString(10).padStart(2, '0')
        const outPath = path.join(outDir, `output_${outFileIndex}.png`)
        base.write(outPath)
    }
}

index()