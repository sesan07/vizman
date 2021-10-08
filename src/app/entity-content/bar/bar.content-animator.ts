import { Entity } from '../../entity/entity.types';
import { BaseContentAnimator } from '../base/base.content-animator';
import { RGB } from 'ngx-color';
import { getGradientColor } from '../../shared/utils';
import { BarContent } from './bar.content.types';

export class BarContentAnimator extends BaseContentAnimator<BarContent> {

    protected _animateContent(entity: Entity<BarContent>): void {
        const content: BarContent = entity.entityContent;

        this._canvasContext.globalAlpha = entity.currentOpacity;
        const strokeColor: string = `rgb(${content.startColor.r}, ${content.startColor.g}, ${content.startColor.b})`;
        this._canvasContext.shadowBlur = content.shadowBlur;
        this._canvasContext.shadowColor = strokeColor;
        this._canvasContext.strokeStyle = strokeColor;

        const amplitudes: Uint8Array = content.isReversed ? content.amplitudes.slice().reverse() : content.amplitudes;
        let currPos: number = this._scaledLeft;
        amplitudes.forEach(amplitude => {
            const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, (amplitude / 255));
            amplitude *= content.multiplier * this._scale;

            // Bar
            this._drawBar(
                currPos,
                this._scaledTop + this._scaledHeight - amplitude,
                amplitude,
                Math.ceil(content.barSize * this._scale),
                gradientColor
            );

            // Bar Cap
            this._drawBar(
                currPos,
                this._scaledTop + this._scaledHeight - amplitude - content.barCapSize * this._scale,
                content.barCapSize * this._scale,
                Math.ceil(content.barSize * this._scale),
                content.startColor
            );

            currPos += (content.barSize * this._scale) + (content.barSpacing * this._scale);
        });
    }

    private _drawBar(startX: number, startY: number, height: number, width: number, fillColor: RGB): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.fillRect(startX, startY, width, height);
        this._canvasContext.strokeRect(startX, startY, width, height);
    }

}
