import { Component, Input } from '@angular/core';
import { EntityType, Entity, EntityContent } from '../entity.types';
import { EntityService } from '../entity.service';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: [ './entity-controller.component.css' ],
})
export class EntityControllerComponent {
    @Input() entity: Entity;

    EntityType: typeof EntityType = EntityType;
    entityTypeOptions: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean;

    constructor(private _entityService: EntityService) {
    }

    onEntityTypeChange(newType: EntityType): void {
        this.entity.type = newType;

        const entityContent: EntityContent = this._entityService.getDefaultEntityContent(newType, this.entity.isEmitted);
        Object.assign(this.entity.entityContent, entityContent);
        this._entityService.setEntityDimensions(this.entity);
    }

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.entity);
    }
}
