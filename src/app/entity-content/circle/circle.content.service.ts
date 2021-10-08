import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { Entity } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { CircleContent } from './circle.content.types';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class CircleContentService extends BaseContentService<CircleContent> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(content: CircleContent): void {
        if (content.randomizeColors) {
            content.startColor = getRandomColor();
            content.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): CircleContent {
        const sampleCount: number = this._audioService.sampleCounts[0];
        return {
            isEmitted: isEmitted,
            randomizeColors: isEmitted,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: isEmitted ? 0 : 5,
            sampleCount: sampleCount,
            baseRadius: 80,
            sampleRadius: 25,
        };
    }

    setEntityDimensions(entity: Entity<CircleContent>): void {
        const content: CircleContent = entity.entityContent;

        const radius: number = content.multiplier * 255 + content.baseRadius + content.sampleRadius;
        const diameter: number = radius * 2 * entity.scale;
        entity.height = diameter;
        entity.width = diameter;
    }

    protected _getAddPreset(content: CircleContent): CircleContent {
        const contentClone: CircleContent = Object.assign({}, content);
        delete contentClone.amplitudes;
        return contentClone;
    }

    protected _getLoadPreset(content: CircleContent): CircleContent {
        const contentClone: CircleContent = Object.assign({}, content);
        contentClone.amplitudes = this._audioService.getAmplitudes(contentClone.sampleCount);
        return contentClone;
    }
}
