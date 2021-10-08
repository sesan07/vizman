import { Entity } from '../entity/entity.types';

export enum EmitterType {
    PAGE = 'Page',
    POINT = 'Point'
}

export interface Emitter {
    type: EmitterType;
    entity: Entity;
    isSelected: boolean;
    name: string;
    interval: number;
    amount: number;
    lifespan: number;
    left?: number;
    top?: number;
}