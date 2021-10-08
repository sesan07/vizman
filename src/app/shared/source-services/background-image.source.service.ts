import { Injectable } from '@angular/core';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';

@Injectable({
    providedIn: 'root'
})
export class BackgroundImageSourceService extends BaseSourceService {

    sources: Source[] = [
        { name: 'Default', src: 'assets/background-image/default.jpg' },
    ];

    setActiveSource(source: Source): void {
        if (this.activeSource?.objectUrl) {
            this._unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this._loadFileSource(this.activeSource);
        }
    }

    protected _onSourceAdded(source: Source): void {}
}
