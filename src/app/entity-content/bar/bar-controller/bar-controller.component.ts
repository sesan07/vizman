import { Component, Input } from '@angular/core';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { Entity } from '../../../entity/entity.types';
import { BarContent } from '../bar.content.types';
import { BarContentService } from '../bar.content.service';

@Component({
    selector: 'app-bar-controller',
    templateUrl: './bar-controller.component.html'
})
export class BarControllerComponent {
    @Input() entity: Entity<BarContent>;

    get content(): BarContent {
        return this.entity.entityContent;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _barContentService: BarContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.content.amplitudes = this._audioService.getAmplitudes(this.content.sampleCount);
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._barContentService.setEntityDimensions(this.entity);
    }
}
