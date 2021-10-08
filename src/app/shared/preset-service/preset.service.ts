import { Injectable } from '@angular/core';
import { Preset } from './preset.service.types';
import { Entity } from '../../entity/entity.types';
import { EntityService } from '../../entity/entity.service';
import { EmitterService } from '../../emitter/emitter.service';
import { Emitter } from '../../emitter/emitter.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PresetService {
    activePreset: Preset;

    get presets(): Preset[] {
        return this._presets.slice();
    }

    private readonly _PRESETS_KEY: string = 'presets';
    private readonly _FIRST_LAUNCH_KEY: string = 'isFirstLaunch';
    private _presets: Preset[] = [];

    constructor(private _entityService: EntityService,
                private _emitterService: EmitterService,
                private _httpClient: HttpClient) {

        const isFirstLaunch: string = localStorage.getItem(this._FIRST_LAUNCH_KEY);
        if (isFirstLaunch !== 'false') {
            this._populateDefaultPresets();
            localStorage.setItem(this._FIRST_LAUNCH_KEY, 'false');
        }

        this._loadPresets();
    }

    saveCurrentAsPreset(name: string): void {
        const entities: Entity[] =
            this._entityService.controllableEntities
                .map(entity => this._entityService.getAddPreset(entity));
        const emitters: Emitter[] =
            this._emitterService.emitters
                .map(emitter => this._emitterService.getCleanPreset(emitter));

        const preset: Preset = {
            name,
            entities: entities,
            emitters: emitters
        };
        this._presets.push(preset);
        this.activePreset = preset;
        localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
    }

    setActivePreset(preset: Preset): void {
        const entities: Entity[] = preset.entities.map(entity => this._entityService.getLoadPreset(entity));
        const emitters: Emitter[] = preset.emitters.map(emitter => this._emitterService.updatePreset(emitter));

        this._entityService.setEntities(entities);
        this._emitterService.setEmitters(emitters);
        this.activePreset = preset;
    }

    private _loadPresets(): void {
        this._presets = JSON.parse(localStorage.getItem(this._PRESETS_KEY)) ?? [];
    }

    private _populateDefaultPresets(): void {
        this._httpClient.get<Preset[]>('assets/presets.json').subscribe(presets => {
            this._presets = presets;
            localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
        });
    }
}
