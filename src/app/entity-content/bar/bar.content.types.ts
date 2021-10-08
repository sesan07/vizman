import { RGBA } from 'ngx-color';

export interface BarContent {
    isEmitted: boolean;
    amplitudes: Uint8Array;
    startColor: RGBA;
    endColor: RGBA;
    multiplier: number;
    sampleCount: number;
    shadowBlur: number;
    randomizeColors: boolean;
    barCapSize: number;
    barSize: number;
    barSpacing: number;
    isReversed: boolean;
}