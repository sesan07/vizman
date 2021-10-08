import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import { Entity, EntityType } from '../entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { BarContentAnimator } from '../../entity-content/bar/bar.content-animator';
import { BarcleContentAnimator } from '../../entity-content/barcle/barcle.content-animator';
import { CircleContentAnimator } from '../../entity-content/circle/circle.content-animator';
import { ImageContentAnimator } from '../../entity-content/image/image.content-animator';
import { Oomph } from '../../shared/source-services/audio.source.service.types';
import { BarContent } from '../../entity-content/bar/bar.content.types';
import { BarcleContent } from '../../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../../entity-content/circle/circle.content.types';
import { ImageContent } from '../../entity-content/image/image.content.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityService } from '../entity.service';
import { Point, ResizeEdge } from './entity-canvas.types';
import { getRadians } from '../../shared/utils';

@Component({
    selector: 'app-entity-canvas',
    templateUrl: './entity-canvas.component.html',
    styleUrls: [ './entity-canvas.component.css' ]
})
export class EntityCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() allowInteraction: boolean;
    @Input() entities: Entity[];
    @Input() viewElement: HTMLElement;
    @Input() viewScale: number;

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    private _activeEntity: Entity;
    private _deadEntities: Entity[] = [];

    private _canvasContext: CanvasRenderingContext2D;
    private _height: number;
    private _width: number;
    private _oomph: Oomph = this._audioService.oomph;
    private _animationFrameId: number;

    private _barContent: BarContentAnimator;
    private _barcleContent: BarcleContentAnimator;
    private _circleContent: CircleContentAnimator;
    private _imageContent: ImageContentAnimator;

    private _isDragging: boolean;
    private _isResizing: boolean;

    private _stopViewMouseDownListener: () => void;
    private _stopViewMouseMoveListener: () => void;
    private _stopWindowMouseMoveListener: () => void;
    private _stopWindowMouseUpListener: () => void;

    private _stopViewTouchStartListener: () => void;
    private _stopViewTouchMoveListener: () => void;
    private _stopWindowTouchMoveListener: () => void;
    private _stopWindowTouchEndListener: () => void;

    private readonly _resizeEdgeSize: number = 40;
    private _currResizeEdge: ResizeEdge;
    private _prevPoint: { x: number, y: number}

    private _destroy: Subject<void> = new Subject();

    constructor(private _renderer: Renderer2,
                private _ngZone: NgZone,
                private _elementRef: ElementRef<HTMLElement>,
                private _audioService: AudioSourceService,
                private _entityService: EntityService) {
    }

    ngOnInit(): void {
        if (!this.allowInteraction) {
            return;
        }

        this._stopViewMouseDownListener = this._renderer.listen(this.viewElement, 'mousedown',
            event => this._onViewMouseDown(event)
        );
        this._stopViewTouchStartListener = this._renderer.listen(this.viewElement, 'touchstart',
            event => this._onViewTouchStart(event)
        );

        this._stopViewMouseMoveListener = this._renderer.listen(this.viewElement, 'mousemove',
            event => this._updateCursor(event)
        );
        this._stopViewTouchMoveListener = this._renderer.listen(this.viewElement, 'touchmove',
            event => this._updateCursor(event.touches.item(0))
        );

        this._entityService.activeEntity$
            .pipe(takeUntil(this._destroy))
            .subscribe(activeEntity => this._activeEntity = activeEntity);
    }

    ngAfterViewInit(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d');

        this._barContent = new BarContentAnimator(this._canvasContext, this._oomph);
        this._barcleContent = new BarcleContentAnimator(this._canvasContext, this._oomph);
        this._circleContent = new CircleContentAnimator(this._canvasContext, this._oomph);
        this._imageContent = new ImageContentAnimator(this._canvasContext, this._oomph);

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // ElementRef dimensions change after some time (even in an empty app) for some reason..........................
        setTimeout(() => {
            this.updateViewDimensions();
            this._animate();
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.allowInteraction) {
            this._stopViewMouseDownListener();
            this._stopViewTouchStartListener();
        }

        this._destroy.next();
        this._destroy.complete();
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._width, this._height);

            this.entities.forEach(entity => {
                switch (entity.type) {
                    case EntityType.BAR:
                        this._barContent.animate(entity as Entity<BarContent>);
                        break;
                    case EntityType.BARCLE:
                        this._barcleContent.animate(entity as Entity<BarcleContent>);
                        break;
                    case EntityType.CIRCLE:
                        this._circleContent.animate(entity as Entity<CircleContent>);
                        break;
                    case EntityType.IMAGE:
                        this._imageContent.animate(entity as Entity<ImageContent>);
                        break;
                }

                this._checkDeathStatus(entity);
            });

            this._removeDeadEntities();
            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }

    private _getScaledPoint(source: MouseEvent | Touch): Point {
        const x: number = source.clientX / this.viewScale;
        const windowCenter: number = window.innerHeight / 2;
        const centerOffset: number = windowCenter - source.clientY;
        const y: number = windowCenter - (centerOffset / this.viewScale);

        return { x, y };
    }

    private _getTargetEntity(point: Point): Entity {
        let targetEntity: Entity;
        // Reverse search array, bottom elements are drawn over others
        for (let i: number = this.entities.length - 1; i >= 0; i--) {
            const entity: Entity = this.entities[i];
            if (this._canMove(entity, point)) {
                targetEntity = entity;
                break;
            }
        }

        return targetEntity;
    }

    private _getResizeEdge(entity: Entity, point: Point): ResizeEdge {
        if (entity.rotation !== 0) {
            return null;
        }
        const rightEdgeLeft: number = entity.left + entity.width - this._resizeEdgeSize;
        const rightEdgeTop: number = entity.top;
        const isInTopRightX: boolean = point.x > rightEdgeLeft && point.x <= rightEdgeLeft + this._resizeEdgeSize;
        const isInTopRightY: boolean = point.y > rightEdgeTop && point.y <= rightEdgeTop + entity.height;
        if (isInTopRightX && isInTopRightY) {
            return ResizeEdge.RIGHT;
        }

        const bottomEdgeLeft: number = entity.left;
        const bottomEdgeTop: number = entity.top + entity.height - this._resizeEdgeSize;
        const isInTopLeftX: boolean = point.x > bottomEdgeLeft && point.x <= bottomEdgeLeft + entity.width;
        const isInTopLeftY: boolean = point.y > bottomEdgeTop && point.y <= bottomEdgeTop + this._resizeEdgeSize;
        if (isInTopLeftX && isInTopLeftY) {
            return ResizeEdge.BOTTOM;
        }
    }

    private _canMove(entity: Entity, point: Point): boolean {
        const topLeft: Point = {
            x: entity.left,
            y: entity.top
        };
        const topRight: Point = {
            x: entity.left + entity.width,
            y: entity.top
        };
        const bottomLeft: Point = {
            x: entity.left,
            y: entity.top + entity.height
        };
        const bottomRight: Point = {
            x: entity.left + entity.width,
            y: entity.top + entity.height
        };

        const origin: Point = {
            x: entity.left + entity.width / 2,
            y: entity.top + entity.height / 2
        };

        this._rotatePoint(topLeft, origin, entity.rotation);
        this._rotatePoint(topRight, origin, entity.rotation);
        this._rotatePoint(bottomLeft, origin, entity.rotation);
        this._rotatePoint(bottomRight, origin, entity.rotation);

        const triangleAreaSum: number =
            this._getTriangleArea(topLeft, bottomRight, point)
            + this._getTriangleArea(topRight, topLeft, point)
            + this._getTriangleArea(bottomLeft, topRight, point)
            + this._getTriangleArea(bottomRight, bottomLeft, point);

        const rectangleArea: number = entity.height * entity.width;
        return rectangleArea > triangleAreaSum;
    }

    // Based on https://stackoverflow.com/a/2259502/12437640
    private _rotatePoint(point: Point, origin: Point, angle: number): void {
        const angleRadians: number = getRadians(angle);
        // Translate point
        point.x -= origin.x;
        point.y -= origin.y;

        // Rotate point
        const newX: number = point.x * Math.cos(angleRadians) - point.y * Math.sin(angleRadians);
        const newY: number = point.x * Math.sin(angleRadians) + point.y * Math.cos(angleRadians);

        // Translate point back
        point.x = newX + origin.x;
        point.y = newY + origin.y;
    }

    // Based on https://stackoverflow.com/a/17146376/12437640
    private _getTriangleArea(p1: Point, p2: Point, p3: Point): number {
        return Math.abs(
            (p1.x * p3.y - p3.x * p1.y)
            + (p2.x * p1.y - p1.x * p2.y)
            + (p3.x * p2.y - p2.x * p3.y)
        ) / 2;
    }

    private _dragActiveEntity(point: Point): void {
        this._activeEntity.left += point.x - this._prevPoint.x;
        this._activeEntity.top += point.y - this._prevPoint.y;
    }

    private _resizeActiveEntity(point: Point): void {
        switch (this._currResizeEdge) {
            case ResizeEdge.BOTTOM:
                // Scale based on height
                const deltaY: number = point.y - this._prevPoint.y;
                const finalDeltaY: number = Math.max(this._activeEntity.height + deltaY, this._resizeEdgeSize);
                this._activeEntity.scale = (finalDeltaY * this._activeEntity.scale) / this._activeEntity.height;
                this._entityService.setEntityDimensions(this._activeEntity);
                break;
            case ResizeEdge.RIGHT:
                // Scale based on width
                const deltaX: number = point.x - this._prevPoint.x;
                const finalDeltaX: number = Math.max(this._activeEntity.width + deltaX, this._resizeEdgeSize);
                this._activeEntity.scale = (finalDeltaX * this._activeEntity.scale) / this._activeEntity.width;
                this._entityService.setEntityDimensions(this._activeEntity);
                break;
        }
    }

    private _onViewMouseDown(event: MouseEvent): void {
        const point: Point = this._getScaledPoint(event);
        this._entityService.setActiveEntity(this._getTargetEntity(point));
        if (!this._activeEntity) {
            return;
        }
        event.stopPropagation();

        this._onInteractionStart(point);
        this._stopWindowMouseMoveListener = this._renderer.listen('window', 'mousemove',
            event => this._onInteractionMove(this._getScaledPoint(event))
        );
        this._stopWindowMouseUpListener = this._renderer.listen('window', 'mouseup',
            () => {
                this._onInteractionEnd();
                this._stopWindowMouseMoveListener();
                this._stopWindowMouseUpListener();
            }
        );
    }

    private _onViewTouchStart(event: TouchEvent): void {
        const firstTouch: Touch = event.touches.item(0);
        const point: Point = this._getScaledPoint(firstTouch);
        this._entityService.setActiveEntity(this._getTargetEntity(point));
        if (!this._activeEntity) {
            return;
        }
        event.stopPropagation();

        this._onInteractionStart(point);
        this._stopWindowTouchMoveListener = this._renderer.listen('window', 'touchmove',
            event => this._onInteractionMove(this._getScaledPoint(event.touches.item(0)))
        );
        this._stopWindowTouchEndListener = this._renderer.listen('window', 'touchend',
            () => {
                this._onInteractionEnd();
                this._stopWindowTouchMoveListener();
                this._stopWindowTouchEndListener();
            }
        );
    }

    private _onInteractionStart(point: Point): void {
        const resizeEdge: ResizeEdge = this._getResizeEdge(this._activeEntity, point);
        if (resizeEdge) {
            this._currResizeEdge = resizeEdge;
            this._isResizing = true;
        } else {
            this._isDragging = true;
        }

        this._prevPoint = point;
    }

    private _onInteractionMove(point: Point): void {
        if (this._isResizing) {
            this._resizeActiveEntity(point);
        } else if (this._isDragging) {
            this._dragActiveEntity(point);
        }

        this._prevPoint = point;
    }

    private _onInteractionEnd(): void {
        this._isResizing = false;
        this._isDragging = false;
        this._currResizeEdge = null;
    }

    private _updateCursor(source: MouseEvent | Touch): void {
        const point: Point = this._getScaledPoint(source);

        let isEntityFound: boolean;
        // Reverse search array, bottom elements are drawn over others
        for (let i: number = this.entities.length - 1; i >= 0; i--) {
            const entity: Entity = this.entities[i];

            if (!isEntityFound) {
                const showResize: boolean = entity.showResizeCursor = !!this._getResizeEdge(entity, point) || this._isResizing;
                const showMove: boolean = entity.showMoveCursor = this._canMove(entity, point);
                isEntityFound = showResize || showMove;
            } else {
                entity.showMoveCursor = false;
                entity.showResizeCursor = false;
            }
        }
    }

    private _checkDeathStatus(entity: Entity): void {
        entity.isDying = Date.now() >= entity.deathTime;
        if (entity.isDying && entity.currentOpacity <= 0) {
            this._deadEntities.push(entity);
        }
    }

    private _removeDeadEntities(): void {
        this._deadEntities.forEach(entity => {
            const index: number = this.entities.indexOf(entity);
            this.entities.splice(index, 1);
        });
        this._deadEntities.length = 0;
    }
}
