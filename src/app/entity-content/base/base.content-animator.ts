import { Entity, EntityContent } from '../../entity/entity.types';
import { getRadians } from '../../shared/utils';
import { Oomph } from '../../shared/source-services/audio.source.service.types';

export abstract class BaseContentAnimator<T extends EntityContent> {
    protected _scale: number;
    protected _scaledWidth: number;
    protected _scaledHeight: number;
    protected _scaledLeft: number;
    protected _scaledTop: number;
    protected _centerX: number;
    protected _centerY: number;

    private readonly _opacityChangeSpeed: number = 0.03;
    private readonly _resizeEdgeSize: number = 40;

    constructor(protected _canvasContext: CanvasRenderingContext2D, protected _oomph: Oomph) {
    }

    animate(entity: Entity<T>): void {
        this._animateEntity(entity);
        this._animateContent(entity);
        this._updateOpacity(entity);

        if (entity.isSelected) {
            this._drawSelectionBorder(entity);
            // if (entity.rotation === 0) {
            //     this._drawResizeBorders(entity);
            // }
        }

        // Reset transformation matrix to the identity matrix
        this._canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    protected abstract _animateContent(entity: Entity<T>): void;

    private _animateEntity(entity: Entity): void {
        this._move(entity);
        this._setEntityProperties(entity);
        this._rotate(entity);
    }

    private _drawSelectionBorder(entity: Entity): void {
        this._canvasContext.globalAlpha = 1;
        this._canvasContext.shadowBlur = 0;
        this._canvasContext.strokeStyle = 'yellow';
        this._canvasContext.strokeRect(entity.left, entity.top, entity.width, entity.height);
    }

    private _drawResizeBorders(entity: Entity): void {
        const rightEdgeLeft: number = entity.left + entity.width - this._resizeEdgeSize;
        const rightEdgeTop: number = entity.top;

        const bottomEdgeLeft: number = entity.left;
        const bottomEdgeTop: number = entity.top + entity.height - this._resizeEdgeSize;

        this._canvasContext.strokeRect(rightEdgeLeft,rightEdgeTop, this._resizeEdgeSize, entity.height);
        this._canvasContext.strokeRect(bottomEdgeLeft, bottomEdgeTop, entity.width, this._resizeEdgeSize);
    }

    private _move(entity: Entity): void {
        if (entity.animateMovement) {
            const movementAngleRadians: number = getRadians(entity.movementAngle);
            entity.left = entity.left + entity.movementSpeed * Math.cos(movementAngleRadians);
            entity.top = entity.top + entity.movementSpeed * Math.sin(movementAngleRadians);
        }
    }

    private _rotate(entity: Entity): void {
        if (entity.animateRotation && entity.rotationDirection === 'Right') {
            entity.rotation = (entity.rotation + entity.rotationSpeed) % 360;
        } else if (entity.animateRotation && entity.rotationDirection === 'Left') {
            entity.rotation = (entity.rotation - entity.rotationSpeed) % 360;
        }

        this._canvasContext.translate(this._centerX, this._centerY);
        this._canvasContext.rotate(getRadians(entity.rotation));
        this._canvasContext.translate(-this._centerX, -this._centerY);
    }

    private _setEntityProperties(entity: Entity): void {
        const oomphScale: number = 1 + (this._oomph.value * entity.oomphAmount);
        this._scale = entity.scale * oomphScale;
        this._scaledWidth = entity.width * oomphScale;
        this._scaledHeight = entity.height * oomphScale;
        this._scaledLeft = entity.left - (this._scaledWidth - entity.width) / 2;
        this._scaledTop = entity.top - (this._scaledHeight - entity.height) / 2;
        this._centerX = (this._scaledLeft) + (this._scaledWidth / 2);
        this._centerY = (this._scaledTop) + (this._scaledHeight / 2);
    }

    private _updateOpacity(entity: Entity): void {
        if (entity.isDying) {
            entity.currentOpacity -= this._opacityChangeSpeed;
            return;
        }

        if (entity.currentOpacity < entity.targetOpacity) {
            entity.currentOpacity = Math.min(entity.currentOpacity + this._opacityChangeSpeed, entity.targetOpacity);
        } else if (entity.currentOpacity > entity.targetOpacity) {
            entity.currentOpacity = Math.max(entity.currentOpacity - this._opacityChangeSpeed, entity.targetOpacity);
        }
    }
}
