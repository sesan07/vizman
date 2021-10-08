import { BaseContentAnimator } from '../base/base.content-animator';
import { Entity } from '../../entity/entity.types';
import { ImageContent } from './image.content.types';

export class ImageContentAnimator extends BaseContentAnimator<ImageContent> {

    protected _animateContent(entity: Entity<ImageContent>): void {
        const content: ImageContent = entity.entityContent;

        this._canvasContext.globalAlpha = entity.currentOpacity;
        this._canvasContext.shadowBlur = 0;
        this._canvasContext.drawImage(
            content.source.frames[Math.floor(content.currGifIndex)],
            this._scaledLeft,
            this._scaledTop,
            this._scaledWidth,
            this._scaledHeight
        );
        content.currGifIndex = (content.currGifIndex + content.speed) % content.source.frames.length;
    }

}