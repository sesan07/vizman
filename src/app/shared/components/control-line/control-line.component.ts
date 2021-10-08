import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-control-line',
    templateUrl: './control-line.component.html',
    styleUrls: [ './control-line.component.css' ]
})
export class ControlLineComponent {
    @Input() name: string;
    @Input() description: any;
}
