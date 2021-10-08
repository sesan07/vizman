import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitterControllerComponent } from './emitter-controller.component';

describe('EmitterControllerComponent', () => {
    let component: EmitterControllerComponent;
    let fixture: ComponentFixture<EmitterControllerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EmitterControllerComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmitterControllerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
