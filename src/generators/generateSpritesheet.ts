import Jimp from 'jimp';

export const generateCombos = (inputJimps: Jimp[]) => {
    const [initial, ...inJimps] = inputJimps
    const result: Jimp[] = [initial]

    for (let i = 1; i < 64; i++) {
        const base = initial.clone()
        inJimps.forEach((jimp, jimpIndex) => {
            const pow = Math.pow(2, jimpIndex)
            if ((i & pow) === pow) {
                base.composite(jimp, 0, 0)
            }
        })
        result.push(base)
    }

    return result
}

export const generateSpritesheet = (inputJimps: Jimp[]) => {
    const spritePerRow = 8
    const singleSpriteWidth = inputJimps[0].bitmap.width
    const outWidth = spritePerRow * singleSpriteWidth
    const result = new Jimp(outWidth, outWidth)

    inputJimps.forEach((jimp, i) => {
        const x0 = i % 8
        const y0 = Math.floor(i / 8)

        const x = x0 * singleSpriteWidth
        const y = y0 * singleSpriteWidth
        result.composite(jimp, x, y)
    })

    return result
}
