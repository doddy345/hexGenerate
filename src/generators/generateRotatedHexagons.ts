import Jimp from "jimp";

export const generateRotatedHexagons = (jimp: Jimp): Jimp[] => {
    const angles = [0, 300, 240, 180, 120, 60]
    return angles.map(angle => {
        const rotated = jimp.clone()
        rotated.rotate(angle, false)
        return rotated
    })
}

