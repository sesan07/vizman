import { Component, Input } from '@angular/core';
import { EmitterType, Emitter } from '../emitter.types';

@Component({
    selector: 'app-entity-emitter-controller',
    templateUrl: './emitter-controller.component.html',
    styleUrls: [ './emitter-controller.component.css' ]
})
export class EmitterControllerComponent {
    @Input() emitter: Emitter;

    emitterTypeOptions: EmitterType[] = Object.values(EmitterType);
    nameEditPopOverVisible: boolean;
}
