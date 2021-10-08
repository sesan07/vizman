import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { Entity } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { BarcleContent } from './barcle.content.types';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class BarcleContentService extends BaseContentService<BarcleContent> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(content: BarcleContent): void {
        if (content.randomizeColors) {
            content.startColor = getRandomColor();
            content.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): BarcleContent {
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
            ringSize: 20,
            fillCenter: false,
        };
    }

    setEntityDimensions(entity: Entity<BarcleContent>): void {
        const content: BarcleContent = entity.entityContent;

        const radius: number = content.multiplier * 255 + content.baseRadius + content.ringSize;
        const diameter: number = radius * 2 * entity.scale;
        entity.height = diameter;
        entity.width = diameter;
    }

    protected _getAddPreset(content: BarcleContent): BarcleContent {
        const contentClone: BarcleContent = Object.assign({}, content);
        delete contentClone.amplitudes;
        return contentClone;
    }

    protected _getLoadPreset(content: BarcleContent): BarcleContent {
        const contentClone: BarcleContent = Object.assign({}, content);
        contentClone.amplitudes = this._audioService.getAmplitudes(contentClone.sampleCount);
        return contentClone;
    }
}
