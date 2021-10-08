import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { BarContent } from './bar.content.types';
import { Entity } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class BarContentService extends BaseContentService<BarContent> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(config: BarContent): void {
        if (config.randomizeColors) {
            config.startColor = getRandomColor();
            config.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): BarContent {
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
            barCapSize: 10,
            barSize: 60,
            barSpacing: 20,
            isReversed: false
        };
    }

    setEntityDimensions(entity: Entity<BarContent>): void {
        const config: BarContent = entity.entityContent;

        const barHeight: number = config.multiplier * 255;
        const barCapHeight: number = config.barCapSize;
        entity.height = (barHeight + barCapHeight) * entity.scale;

        const barSpacing: number = config.barSpacing;
        const barSize: number = config.barSize;
        const totalBarSpacing: number = (config.sampleCount - 1) * barSpacing;
        entity.width = (config.sampleCount * barSize + totalBarSpacing) * entity.scale;
    }

    protected _getAddPreset(config: BarContent): BarContent {
        const configClone: BarContent = Object.assign({}, config);
        delete configClone.amplitudes;
        return configClone;
    }

    protected _getLoadPreset(config: BarContent): BarContent {
        const configClone: BarContent = Object.assign({}, config);
        configClone.amplitudes = this._audioService.getAmplitudes(configClone.sampleCount);
        return configClone;
    }
}
