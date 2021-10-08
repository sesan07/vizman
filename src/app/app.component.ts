import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { EntityType } from './entity/entity.types';
import { animations } from './shared/animations';
import { AudioSourceService } from './shared/source-services/audio.source.service';
import { EntityService } from './entity/entity.service';
import { EmitterType } from './emitter/emitter.types';
import { EmitterService } from './emitter/emitter.service';
import { BackgroundImageSourceService } from './shared/source-services/background-image.source.service';
import { PresetService } from './shared/preset-service/preset.service';
import { BarContentService } from './entity-content/bar/bar.content.service';
import { BarcleContentService } from './entity-content/barcle/barcle.content.service';
import { CircleContentService } from './entity-content/circle/circle.content.service';
import { ImageContentService } from './entity-content/image/image.content.service';
import { Source } from './shared/source-services/base.source.service.types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    animations: animations
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('entityView') entityViewElement: ElementRef<HTMLElement>;
    @ViewChild('toggleButton', { read: ElementRef }) toggleButton: ElementRef<HTMLButtonElement>;


    @HostListener('mousemove')
    onMouseMove(): void {
        const showResizeCursor: boolean = this.entityService.controllableEntities.some(entity => entity.showResizeCursor);
        const showMoveCursor: boolean = this.entityService.controllableEntities.some(entity => entity.showMoveCursor);
        this.entityViewCursor = showResizeCursor
            ? 'nwse-resize'
            : showMoveCursor
                ? 'move'
                : 'auto';

        this.toggleButtonOpacity = 1;
        this._mouseMove$.next();
    }

    @HostListener('window:keydown.space', ['$event'])
    onSpaceKeyDown(event: KeyboardEvent): void {
        if (this.isControlViewOpen) {
            return;
        }

        if (this.isPlaying) {
            this.audioService.pause();
        } else  {
            this.audioService.play();
        }

        event.preventDefault();
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewScale();
    }

    addEntityOptions: EntityType[] = Object.values(EntityType);
    addEmitterOptions: EmitterType[] = Object.values(EmitterType);

    currentAudioTime: number = 0;
    backgroundOpacity: number = 0.5;
    backgroundOomph: number = 0.2;
    backgroundScale: number = 1;
    modeOptions: any[] = [
        {
            name: 'Frequency',
            value: 'frequency'
        },
        {
            name: 'Time Domain',
            value: 'timeDomain'
        },
    ];
    decibelRange: [ number, number ] = [ -80, -20 ];

    toggleButtonOpacity: number = 1;
    isControlViewOpen: boolean = true;
    controlViewWidth: number;
    controlViewContentWidth: number;
    entityViewScale: number;
    entityViewCursor: string = 'auto';

    savePresetPopOverVisible: boolean;

    private readonly _controlViewWidth: number = 500;
    private _mouseMove$: Subject<void> = new Subject();

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioSourceService,
                public backgroundImageService: BackgroundImageSourceService,
                public entityService: EntityService,
                public emitterService: EmitterService,
                public presetService: PresetService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService,
                private _elementRef: ElementRef<HTMLElement>,
                private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.audioService.setActiveSource(this.audioService.sources[0]);
        this.backgroundImageService.setActiveSource(this.backgroundImageService.sources[0]);

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this.controlViewContentWidth = this._controlViewWidth;

        this._mouseMove$.pipe(debounceTime(1500))
            .subscribe(() => this.toggleButtonOpacity = this.isControlViewOpen ? 1 : 0);
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement);
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);

        this._barContentService.setEntityView(this.entityViewElement.nativeElement);
        this._barcleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._circleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._imageContentService.setEntityView(this.entityViewElement.nativeElement);

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        setTimeout(() => {
            this._updateEntityViewScale();
            this._updateBackgroundScale();

            if (this.presetService.presets.length > 0) {
                this.presetService.setActivePreset(this.presetService.presets[0]);
            }
        }, 1000);
    }

    formatTime(seconds: number): string {
        seconds = isNaN(seconds) ? 0 : seconds;
        const hasHours: boolean = Math.floor(seconds / 3600) > 0;
        return new Date(1000 * seconds).toISOString().substr(hasHours ? 11 : 14, hasHours ? 8 : 5);
    }

    onEntityViewClicked(): void {
        this.entityService.setActiveEntity(null);
        this.emitterService.setActiveEmitter(null);
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);
    }

    onSongSelected(source: Source): void {
        this.audioService.setActiveSource(source);
        setTimeout(() => this.audioService.play());
    }

    onToggleControlView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this._updateEntityViewScale();
        this.toggleButton.nativeElement.blur();
    }

    private _updateEntityViewScale(): void {
        const entityViewWidth: number = this.entityViewElement.nativeElement.clientWidth;
        this.entityViewScale = (entityViewWidth - this.controlViewWidth) / entityViewWidth;
        this._renderer.setStyle(this.entityViewElement.nativeElement, 'transform', `scale(${this.entityViewScale})`);
    }

    private _updateBackgroundScale(): void {
        this.backgroundScale = 1 + this.backgroundOomph * this.audioService.oomph.value;
        requestAnimationFrame(() => this._updateBackgroundScale());
    }
}
