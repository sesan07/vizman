import { Entity, EntityContent } from '../../entity/entity.types';
import { getRandomNumber } from '../../shared/utils';

export abstract class BaseContentService<T extends EntityContent> {
    private _entityView: HTMLElement;

    beforeEmit(content: T): void {
    }

    setAddPreset(entity: Entity<T>): void {
        entity.presetX = (entity.left + (entity.width / 2)) / this._entityView.clientWidth;
        entity.presetY = (entity.top + (entity.height / 2)) / this._entityView.clientHeight;
        delete entity.left;
        delete entity.top;
        entity.entityContent = this._getAddPreset(entity.entityContent);
    }

    setLoadPreset(entity: Entity<T>): void {
        entity.left = (entity.presetX * this._entityView.clientWidth) - entity.width / 2;
        entity.top = (entity.presetY * this._entityView.clientHeight) - entity.height / 2;
        entity.entityContent = this._getLoadPreset(entity.entityContent);
    }

    setEntityPosition(entity: Entity<T>, centerX?: number, centerY?: number): void {
        if (centerX !== undefined && centerY !== undefined) {
            entity.left = centerX - entity.width / 2;
            entity.top = centerY - entity.height / 2;
        } else {
            entity.left = getRandomNumber(0, this._entityView.clientWidth - entity.width);
            entity.top = getRandomNumber(0, this._entityView.clientHeight - entity.height);
        }
    }

    setEntityView(view: HTMLElement): void {
        this._entityView = view;
    }

    abstract setEntityDimensions(entity: Entity<T>): void;

    abstract getDefaultContent(isEmitted: boolean): T;

    protected abstract _getAddPreset(content: T): T;

    protected abstract _getLoadPreset(content: T): T;
}
