import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SourcePickerFileData, SourcePickerUrlData } from './source-picker.component.types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Source, SourceType } from '../../source-services/base.source.service.types';

@Component({
    selector: 'app-source-picker',
    templateUrl: './source-picker.component.html',
    styleUrls: [ './source-picker.component.css' ]
})
export class SourcePickerComponent implements OnInit {
    @Input() activeSource: Source;
    @Input() allowFileAdd: boolean;
    @Input() allowUrlAdd: boolean;
    @Input() fileAcceptTypes: string;
    @Input() popoverTitle: string;
    @Input() sources: Source[];
    @Output() activeSourceChanged: EventEmitter<Source> = new EventEmitter();
    @Output() addFile: EventEmitter<SourcePickerFileData> = new EventEmitter();
    @Output() addUrl: EventEmitter<SourcePickerUrlData> = new EventEmitter();

    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    form: FormGroup;
    sourceType: SourceType = this.addFile ? 'File' : 'Url';
    isPopoverVisible: boolean;

    private _fileValidator: Function = (control: FormControl): { [s: string]: boolean } => {
        if (this.sourceType === 'File' && !control.value) {
            return { required: true };
        }
        return {};
    };

    private _urlValidator: Function = (control: FormControl): { [s: string]: boolean } => {
        if (this.sourceType === 'Url' && !control.value) {
            return { required: true };
        }
        return {};
    };

    constructor(private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            name: [ '', [ Validators.required ] ],
            file: [ '', [ this._fileValidator ] ],
            url: [ '', [ this._urlValidator ] ]
        });
    }

    get fileName(): string {
        return this.fileInputElement?.nativeElement.files.item(0)?.name.split('/').shift();
    }

    onPopoverSubmit(): void {
        switch (this.sourceType) {
            case 'File':
                const fileData: SourcePickerFileData = {
                    name: this.form.value.name,
                    file: this.fileInputElement.nativeElement.files.item(0)
                };
                this.addFile.emit(fileData);
                break;
            case 'Url':
                const urlData: SourcePickerUrlData = {
                    name: this.form.value.name,
                    url: this.form.value.url
                };
                this.addUrl.emit(urlData);
                break;

        }
        this.isPopoverVisible = false;
        this.form.reset();
    }

    onSourceTypeChange(): void {
        this.form.controls.file.setValue('');
        this.form.controls.url.setValue('');
    }

    onPopoverClose(): void {
        this.isPopoverVisible = false;
        this.form.reset();
    }

    onPopOverVisibleChange(): void {
        if (!this.isPopoverVisible) {
            this.form.reset();
        }
    }
}
