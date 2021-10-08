import { Entity } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContentAnimator } from '../base/base.content-animator';
import { RGB } from 'ngx-color';
import { CircleContent } from './circle.content.types';

export class CircleContentAnimator extends BaseContentAnimator<CircleContent> {

    protected _animateContent(entity: Entity<CircleContent>): void {
        const content: CircleContent = entity.entityContent;

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
            const radius: number = (content.baseRadius + amplitude * content.multiplier) * this._scale;
            const xLeft: number = this._centerX + radius * Math.cos(currAngle);
            const xRight: number = this._centerX - radius * Math.cos(currAngle);
            const y: number = this._centerY + radius * Math.sin(currAngle);
            currAngle += sampleAngle;

            const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, (amplitude / 255));
            this._drawCircle(xLeft, y, gradientColor, content.sampleRadius * this._scale);
            this._drawCircle(xRight, y, gradientColor, content.sampleRadius * this._scale);
        }
    }

    private _drawCircle(centerX: number, centerY: number, fillColor: RGB, sampleRadius: number): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, sampleRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }
}
