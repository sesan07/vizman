import { Entity } from '../../entity/entity.types';
import { Emitter } from '../../emitter/emitter.types';

export interface Preset {
    name: string;
    entities: Entity[];
    emitters: Emitter[];
}