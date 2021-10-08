import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableDirective } from './draggable.directive';

describe('DraggableComponent', () => {
    let component: DraggableDirective;
    let fixture: ComponentFixture<DraggableDirective>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ DraggableDirective ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        // fixture = TestBed.createComponent(DraggableComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        // expect(component).toBeTruthy();
    });
});
