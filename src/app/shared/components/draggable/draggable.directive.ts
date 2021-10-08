import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective implements AfterViewInit {
    @Input() viewScale: number;

    get left(): number {
        return this._left;
    }

    get top(): number {
        return this._top;
    }

    private _left: number;
    private _top: number;
    private _dragOffsetLeft: number;
    private _dragOffsetTop: number;
    private _stopMouseMoveListener: () => void;
    private _stopMouseUpListener: () => void;
    private _stopTouchMoveListener: () => void;
    private _stopTouchEndListener: () => void;

    @HostListener('mousedown', [ '$event' ])
    onMouseDown(event: MouseEvent): void {
        event.stopPropagation();
        this._dragOffsetLeft = this._left - event.clientX / this.viewScale;
        this._dragOffsetTop = this._top - event.clientY / this.viewScale;

        this._stopMouseMoveListener = this._renderer.listen('window', 'mousemove', event =>
            this._drag(event)
        );
        this._stopMouseUpListener = this._renderer.listen('window', 'mouseup', () => {
            this._stopMouseMoveListener();
            this._stopMouseUpListener();
        });
    }

    @HostListener('touchstart', [ '$event' ])
    onTouchStart(event: TouchEvent): void {
        event.stopPropagation();
        const firstTouch: Touch = event.touches.item(0);
        this._dragOffsetLeft = this._left - firstTouch.clientX / this.viewScale;
        this._dragOffsetTop = this._top - firstTouch.clientY / this.viewScale;

        this._stopTouchMoveListener = this._renderer.listen('window', 'touchmove', event =>
            this._drag(event.touches.item(0))
        );
        this._stopTouchEndListener = this._renderer.listen('window', 'touchend', () => {
            this._stopTouchMoveListener();
            this._stopTouchEndListener();
        });
    }

    constructor(private _renderer: Renderer2,
                private _elementRef: ElementRef<HTMLElement>) {
    }

    ngAfterViewInit(): void {
        this._left = this._elementRef.nativeElement.clientLeft;
        this._top = this._elementRef.nativeElement.clientTop;
    }

    private _setPosition(left: number, top: number): void {
        this._left = left;
        this._top = top;
        this._renderer.setStyle(this._elementRef.nativeElement, 'left', left + 'px');
        this._renderer.setStyle(this._elementRef.nativeElement, 'top', top + 'px');
    }

    private _drag(source: MouseEvent | Touch): void {
        const left: number = source.clientX / this.viewScale + this._dragOffsetLeft;
        const top: number = source.clientY / this.viewScale + this._dragOffsetTop;
        this._setPosition(left, top);
    }

}
