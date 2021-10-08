import { Entity } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContentAnimator } from '../base/base.content-animator';
import { RGB } from 'ngx-color';
import { BarcleContent } from './barcle.content.types';

export class BarcleContentAnimator extends BaseContentAnimator<BarcleContent> {

    protected _animateContent(entity: Entity<BarcleContent>): void {
        const content: BarcleContent = entity.entityContent;

        this._canvasContext.globalAlpha = entity.currentOpacity;
        const strokeColor: string = `rgb(${content.startColor.r}, ${content.startColor.g}, ${content.startColor.b})`;
        this._canvasContext.shadowBlur = content.shadowBlur;
        this._canvasContext.shadowColor = strokeColor;
        this._canvasContext.strokeStyle = strokeColor;

        const sampleAngle: number = (getRadians(360) / content.sampleCount) / 2;
        let currAngle: number = getRadians(90) + sampleAngle / 2;
        // Reverse to turn visualization upside down
        for (let i: number = 0; i < content.amplitudes.length; i++) {
            const amplitude: number = content.amplitudes[i];
            const radius: number = (content.baseRadius + content.ringSize + amplitude * content.multiplier) * this._scale;
            const startAngle: number = currAngle - sampleAngle / 2;
            const endAngle: number = currAngle + sampleAngle / 2;
            const startAngle2: number = Math.PI - currAngle - sampleAngle / 2;
            const endAngle2: number = Math.PI - currAngle + sampleAngle / 2;

            const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, (amplitude / 255));
            this._drawBar(startAngle, endAngle, radius, content.baseRadius * this._scale, gradientColor);
            this._drawBar(startAngle2, endAngle2, radius, content.baseRadius * this._scale, gradientColor);

            currAngle += sampleAngle;
        }
        if (content.fillCenter) {
            this._drawCap(content.startColor, content.baseRadius * this._scale);
        }
    }

    private _drawBar(startAngle: number, endAngle: number, height: number, baseRadius: number, fillColor: RGB): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, baseRadius, startAngle, endAngle);
        this._canvasContext.arc(this._centerX, this._centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }

    private _drawCap(fillColor: RGB, baseRadius: number): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, baseRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }

}
