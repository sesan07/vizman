import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entity, EntityType } from '../../../entity/entity.types';
import { EmitterType, Emitter } from '../../../emitter/emitter.types';
import { animations } from '../../animations';

@Component({
    selector: 'app-controller-wrapper',
    templateUrl: './controller-wrapper.component.html',
    styleUrls: [ './controller-wrapper.component.scss' ],
    animations: animations
})
export class ControllerWrapperComponent implements OnInit {
    @Input() type: 'entity' | 'emitter';
    @Input() addOptions: EntityType[] | EmitterType[];
    @Input() activeConfig: Entity | Emitter;
    @Input() configs: Entity[] | Emitter[];
    @Output() add: EventEmitter<EntityType | EmitterType> = new EventEmitter();
    @Output() remove: EventEmitter<Entity | Emitter> = new EventEmitter();
    @Output() configSelect: EventEmitter<Entity | Emitter> = new EventEmitter();
    @Output() closeActive: EventEmitter<void> = new EventEmitter();
    @Output() duplicateActive: EventEmitter<void> = new EventEmitter();

    selectedAddOption: EntityType | EmitterType;

    get name(): string {
        return this.type === 'entity' ? 'Entity' : 'Emitter';
    }

    ngOnInit(): void {
        this.selectedAddOption = this.addOptions[0];
    }

    onConfigSelected(event: MouseEvent, config: Entity | Emitter): void {
        this.configSelect.emit(config);
        event.stopPropagation();
    }

    onAddOptionClicked(option: EntityType | EmitterType): void {
        this.selectedAddOption = option;
        this.add.emit(option);
    }
}
