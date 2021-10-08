import { Injectable } from '@angular/core';
import { EntityType, Entity, EntityContent } from './entity.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { ImageContent } from '../entity-content/image/image.content.types';
import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    controllableEntities: Entity[] = [];

    private _activeEntity$: BehaviorSubject<Entity> = new BehaviorSubject(null);
    activeEntity$: Observable<Entity> = this._activeEntity$.asObservable();

    private _currNameIndex: number = 0;

    constructor(private _audioService: AudioSourceService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
    }

    addEntity(type: EntityType): void {
        const entityContent: EntityContent = this.getDefaultEntityContent(type, false);
        const entity: Entity = this.getDefaultEntity(type, entityContent, false);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);

        this.controllableEntities.push(entity);
        this.setActiveEntity(entity);
    }

    getDefaultEntity(type: EntityType, content: EntityContent, isEmitted: boolean): Entity {
        return {
            type: type,
            isEmitted: isEmitted,
            name: isEmitted ? undefined : this._getNextName(type),
            isSelected: false,
            animateMovement: isEmitted,
            randomizeMovement: isEmitted,
            movementAngle: 0,
            movementSpeed: 0.5,
            animateRotation: isEmitted,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            scale: 0.5,
            oomphAmount: 0,
            currentOpacity: 0,
            targetOpacity: 1,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            entityContent: content,
        };
    }

    getDefaultEntityContent(type: EntityType, isEmitted: boolean): EntityContent {
        switch (type) {
            case EntityType.BAR:
                return this._barContentService.getDefaultContent(isEmitted);
            case EntityType.BARCLE:
                return this._barcleContentService.getDefaultContent(isEmitted);
            case EntityType.CIRCLE:
                return this._circleContentService.getDefaultContent(isEmitted);
            case EntityType.IMAGE:
                return this._imageContentService.getDefaultContent(isEmitted);
            default:
                throw new Error('Unknown entity type');
        }
    }

    setEntityDimensions(entity: Entity): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityDimensions(entity as Entity<BarContent>);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityDimensions(entity as Entity<BarcleContent>);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityDimensions(entity as Entity<CircleContent>);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityDimensions(entity as Entity<ImageContent>);
                break;
            default:
                throw new Error('Unknown entity type');
        }
    }

    setEntityPosition(entity: Entity, centerX?: number, centerY?: number): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityPosition(entity as Entity<BarContent>, centerX, centerY);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityPosition(entity as Entity<BarcleContent>, centerX, centerY);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityPosition(entity as Entity<CircleContent>, centerX, centerY);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityPosition(entity as Entity<ImageContent>, centerX, centerY);
                break;
            default:
                throw new Error('Unknown entity type');
        }
    }

    removeEntity(entity: Entity): void {
        const index: number = this.controllableEntities.indexOf(entity);
        this.controllableEntities.splice(index, 1);

        if (entity === this._activeEntity$.value) {
            this.setActiveEntity(null);
        }
    }

    setActiveEntity(entity: Entity | null): void {
        if (entity) {
            entity.isSelected = true;
        }
        this._activeEntity$.next(entity);

        this.controllableEntities.forEach(e => {
            if (e !== entity) {
                e.isSelected = false;
            }
        });
    }

    setEntities(entities: Entity[]): void {
        this.controllableEntities.length = 0; // Empty the array
        this.controllableEntities.push(...entities);
        this._currNameIndex = entities.length;
        this.setActiveEntity(null);
    }

    getAddPreset(entity: Entity): Entity {
        const entityClone: Entity = Object.assign({}, entity);
        delete entityClone.showResizeCursor;

        switch (entityClone.type) {
            case EntityType.BAR:
                this._barContentService.setAddPreset(entityClone as Entity<BarContent>);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setAddPreset(entityClone as Entity<BarcleContent>);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setAddPreset(entityClone as Entity<CircleContent>);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setAddPreset(entityClone as Entity<ImageContent>);
                break;
            default:
                throw new Error('Unknown entity type');
        }

        return entityClone;
    }

    getLoadPreset(entity: Entity): Entity {
        const entityClone: Entity = Object.assign({}, entity);

        switch (entityClone.type) {
            case EntityType.BAR:
                this._barContentService.setLoadPreset(entityClone as Entity<BarContent>);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setLoadPreset(entityClone as Entity<BarcleContent>);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setLoadPreset(entityClone as Entity<CircleContent>);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setLoadPreset(entityClone as Entity<ImageContent>);
                break;
            default:
                throw new Error('Unknown entity type');
        }

        return entityClone;
    }

    duplicateActive(): void {
        const entityClone: Entity = Object.assign({}, this._activeEntity$.value);
        entityClone.name = this._getNextName(entityClone.type);
        entityClone.entityContent = Object.assign({}, entityClone.entityContent);
        this.setEntityPosition(entityClone);
        this.controllableEntities.push(entityClone);
        this.setActiveEntity(entityClone);
    }

    private _getNextName(type: EntityType): string {
        return `Entity ${this._currNameIndex++} (${type})`;
    }
}
