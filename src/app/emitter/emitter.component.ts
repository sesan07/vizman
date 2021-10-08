import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { EmitterType, Emitter } from './emitter.types';
import { EntityType, Entity } from '../entity/entity.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { EntityService } from '../entity/entity.service';
import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { getRandomNumber } from '../shared/utils';
import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { ImageContent } from '../entity-content/image/image.content.types';
import { DraggableDirective } from '../shared/components/draggable/draggable.directive';

@Component({
    selector: 'app-emitter',
    templateUrl: './emitter.component.html',
    styleUrls: [ './emitter.component.css' ]
})
export class EmitterComponent implements AfterViewInit, OnDestroy {
    @Input() emitter: Emitter;
    @Input() viewScale: number;

    @ViewChild('handle', { read: ElementRef }) handleElement: ElementRef<HTMLElement>;
    @ViewChild('handle', { read: DraggableDirective }) handleDirective: DraggableDirective;

    entities: Entity[] = [];

    private _timeoutRef: ReturnType<typeof setTimeout>;

    constructor(ngZone: NgZone,
                elementRef: ElementRef,
                audioService: AudioSourceService,
                private _entityService: EntityService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
    }

    ngAfterViewInit(): void {
        this._emitEntities();
    }

    private _emitEntities(): void {
        for (let i: number = 0; i < this.emitter.amount; i++) {
            this._emitEntity();
        }
        this._timeoutRef = setTimeout(() => this._emitEntities(), this.emitter.interval * 1000);
    }

    private _emitEntity(): void {
        const entity: Entity = Object.assign({}, this.emitter.entity);
        entity.entityContent = Object.assign({}, this.emitter.entity.entityContent);

        // Set position
        if (this.emitter.type === EmitterType.POINT) {
            const centerX: number = this.handleDirective.left + this.handleElement.nativeElement.clientWidth / 2;
            const centerY: number = this.handleDirective.top + this.handleElement.nativeElement.clientHeight / 2;
            this._entityService.setEntityPosition(entity, centerX, centerY);
        } else {
            this._entityService.setEntityPosition(entity);
        }

        // Randomize movement animation
        if (entity.animateMovement && entity.randomizeMovement) {
            entity.movementAngle = getRandomNumber(0, 360);
            entity.movementSpeed = getRandomNumber(0.5, 2);
        }

        entity.deathTime = Date.now() + this.emitter.lifespan * 1000;

        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.beforeEmit(entity.entityContent as BarContent);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.beforeEmit(entity.entityContent as BarcleContent);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.beforeEmit(entity.entityContent as CircleContent);
                break;
            case EntityType.IMAGE:
                this._imageContentService.beforeEmit(entity.entityContent as ImageContent);
                break;
        }

        this.entities.push(entity);
    }

    ngOnDestroy(): void {
        clearTimeout(this._timeoutRef);
    }

}
