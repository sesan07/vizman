import { Component, Input } from '@angular/core';
import { Entity } from '../../../entity/entity.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { BarcleContent } from '../barcle.content.types';
import { BarcleContentService } from '../barcle.content.service';

@Component({
    selector: 'app-barcle-controller',
    templateUrl: './barcle-controller.component.html'
})
export class BarcleControllerComponent {
    @Input() entity: Entity<BarcleContent>;

    get content(): BarcleContent {
        return this.entity.entityContent;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _barcleContentService: BarcleContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.content.amplitudes = this._audioService.getAmplitudes(this.content.sampleCount);
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._barcleContentService.setEntityDimensions(this.entity);
    }
}
