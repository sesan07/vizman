import { Injectable } from '@angular/core';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GifReader } from 'omggif';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ImageSourceService extends BaseSourceService {

    sources: Source[] = [
        { name: 'Mako', url: 'assets/image/mako.png' },
        { name: 'Pizza Rat', url: 'assets/image/pizza-rat.gif' }
    ];

    constructor(sanitizer: DomSanitizer, messageService: NzMessageService, private _httpClient: HttpClient) {
        super(sanitizer, messageService);
        // Load default sources
        this.sources.forEach(source => this._onSourceAdded(source));
    }

    protected _onSourceAdded(source: Source): void {
        if (source.file) {
            const reader: FileReader = new FileReader();
            reader.onload = (evt: ProgressEvent<FileReader>) => {
                const intArray: Uint8Array = new Uint8Array(evt.target.result as ArrayBuffer);
                if (this._isGif(intArray)) {
                    this._loadGif(source, intArray);
                } else {
                    this._loadFileSource(source);
                }
            };

            reader.readAsArrayBuffer(source.file);
        } else if (source.url) {
            source.src = source.url;
            this._httpClient.get(source.url, {responseType: 'arraybuffer'}).subscribe(arrayBuffer => {
                const intArray: Uint8Array = new Uint8Array(arrayBuffer);
                if (this._isGif(intArray)) {
                    this._loadGif(source, intArray);
                } else {
                    this._loadStaticImage(source);
                }
            });
        }
    }

    private _loadGif(source: Source, intArray: Uint8Array): void {
        const gifReader: GifReader = new GifReader(intArray);
        const info: { width: number, height: number } = gifReader.frameInfo(0);
        source.frames = new Array(gifReader.numFrames());

        let previousData: Uint8ClampedArray;
        source.frames = new Array(gifReader.numFrames()).fill(0).map((_, index) => {
            const frameInfo: { disposal: number } = gifReader.frameInfo(index);

            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = info.width;
            canvas.height = info.height;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

            const imageData: ImageData = ctx.createImageData(info.width, info.width);
            if (index > 0 && frameInfo.disposal < 2) {
                imageData.data.set(new Uint8ClampedArray(previousData));
            }
            gifReader.decodeAndBlitFrameRGBA(index, imageData.data);
            previousData = imageData.data;

            ctx.putImageData(imageData, 0, 0);
            return canvas;
        });
    }

    private _loadStaticImage(source: Source): void {
        let src: string;
        if (source.file) {
            this._loadFileSource(source);
            src = source.src as string;
        } else if (source.url) {
            src = source.url;
        } else {
            throw new Error('Source has no file or url');
        }

        const image: HTMLImageElement = new Image();
        image.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0);
            source.frames = [ canvas ];

            if (source.file) {
                this._unloadFileSource(source);
            }
        };
        image.src = src;
    }

    // From omggif library
    private _isGif(buf: Uint8Array): boolean {
        let p: number = 0;

        // - Header (GIF87a or GIF89a).
        return !(
            buf[p++] !== 0x47
            || buf[p++] !== 0x49
            || buf[p++] !== 0x46
            || buf[p++] !== 0x38
            || (buf[p++] + 1 & 0xfd) !== 0x38
            || buf[p++] !== 0x61
        );
    }
}
