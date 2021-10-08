import { Component, Input } from '@angular/core';
import { Entity } from '../../../entity/entity.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { CircleContent } from '../circle.content.types';
import { CircleContentService } from '../circle.content.service';

@Component({
    selector: 'app-circle-controller',
    templateUrl: './circle-controller.component.html'
})
export class CircleControllerComponent {
    @Input() entity: Entity<CircleContent>;

    get content(): CircleContent {
        return this.entity.entityContent;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _circleContentService: CircleContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onSampleCountChanged(): void {
        this.content.amplitudes = this._audioService.getAmplitudes(this.content.sampleCount);
        this.onDimensionsChange();
    }

    onDimensionsChange(): void {
        this._circleContentService.setEntityDimensions(this.entity);
    }

}
