interface SourcePickerData {
    name: string;
}

export interface SourcePickerFileData extends SourcePickerData {
    file: File;
}

export interface SourcePickerUrlData extends SourcePickerData {
    url: string;
}