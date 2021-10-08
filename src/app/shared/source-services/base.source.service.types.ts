import { SafeUrl } from '@angular/platform-browser';

export type SourceType = 'File' | 'Url';

export interface Source {
    name: string;
    src?: string | SafeUrl;
    url?: string;
    file?: File;
    objectUrl?: string;
    frames?: HTMLCanvasElement[];
}