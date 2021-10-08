import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCanvasComponent } from './entity-canvas.component';

describe('VisualizerCanvasComponent', () => {
    let component: EntityCanvasComponent;
    let fixture: ComponentFixture<EntityCanvasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EntityCanvasComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
