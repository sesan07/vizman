import { RGBA } from 'ngx-color';

export function getRandomNumber(min: number, max: number): number {
    const diff: number = max - min;
    return Math.random() * diff + min;
}

export function getRadians(degrees: number): number {
    return Math.PI / 180 * degrees;
}

export function getGradientColor(startColor: RGBA, endColor: RGBA, fadePercent: number): RGBA {
    let diffRed: number = endColor.r - startColor.r;
    let diffGreen: number = endColor.g - startColor.g;
    let diffBlue: number = endColor.b - startColor.b;

    diffRed = (diffRed * fadePercent) + startColor.r;
    diffGreen = (diffGreen * fadePercent) + startColor.g;
    diffBlue = (diffBlue * fadePercent) + startColor.b;

    return {
        r: Math.floor(diffRed),
        g: Math.floor(diffGreen),
        b: Math.floor(diffBlue),
        a: 1,
    };
}

export function getRandomColor(): RGBA {
    return {
        r: Math.round(getRandomNumber(0, 255)),
        g: Math.round(getRandomNumber(0, 255)),
        b: Math.round(getRandomNumber(0, 255)),
        a: 1
    };
}