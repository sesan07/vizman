import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const animations: AnimationTriggerMetadata[] = [
    trigger('controllerEnterLeaveTrigger', [
        transition(':enter', [
            style({
                opacity: '0',
                transform: 'scaleY(0)'
            }),
            animate(100, style({
                opacity: '1',
                transform: 'scaleY(1)'
            }))
        ]),
        // Todo try to get leave transition working right..
        // transition(':leave', [
        //     style({
        //         opacity: '*',
        //         transform: '*'
        //     }),
        //     animate(100, style({
        //         opacity: '0',
        //         transform: 'scaleY(0)'
        //     }))
        // ])
    ]),
    trigger('entityEnterTrigger', [
        transition(':enter', [
            style({ opacity: '0' }),
            animate('{{speed}}s', style({ opacity: '1' }))
        ], { params: { speed: 1 } })
    ]),
    trigger('entityLeaveTrigger', [
        transition(':leave', [
            style({ opacity: '1' }),
            animate('{{speed}}s', style({ opacity: '0' }))
        ], { params: { speed: 1 } })
    ])
];
