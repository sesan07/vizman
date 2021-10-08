import { ImageContent } from '../entity-content/image/image.content.types';
import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../entity-content/circle/circle.content.types';

export enum EntityType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle',
    IMAGE = 'Image',
}

export type EntityContent = BarContent | BarcleContent | CircleContent | ImageContent;

export interface Entity<T extends EntityContent = EntityContent> {
    type: EntityType;
    name?: string;
    isEmitted: boolean;
    isSelected: boolean;
    animateMovement?: boolean;
    animateRotation?: boolean;
    movementAngle?: number;
    movementSpeed?: number;
    rotation: number;
    rotationDirection: 'Left' | 'Right';
    rotationSpeed?: number;
    scale: number;
    oomphAmount: number;
    randomizeMovement?: boolean;
    left: number;
    top: number;
    height: number,
    width: number,
    currentOpacity: number;
    targetOpacity: number;
    isDying?: boolean;
    deathTime?: number;
    entityContent: T;
    presetX?: number;
    presetY?: number;
    showResizeCursor?: boolean;
    showMoveCursor?: boolean;
}
