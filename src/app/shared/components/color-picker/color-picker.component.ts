import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorEvent, RGBA, } from 'ngx-color';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss' ]
})
export class ColorPickerComponent implements OnInit {
    @Input() color: RGBA;
    @Output() colorChange: EventEmitter<RGBA> = new EventEmitter();

    isOpen: boolean = false;
    tempColor: RGBA;

    ngOnInit(): void {
        this.tempColor = this.color;
    }

    onClose(isOk: boolean): void {
        if (isOk) {
            this.color = this.tempColor;
            this.colorChange.emit(this.color);
        } else {
            this.tempColor = this.color;
        }
        this.isOpen = false;
    }

    onColorChange(event: ColorEvent): void {
        this.tempColor = event.color.rgb;
    }
}
