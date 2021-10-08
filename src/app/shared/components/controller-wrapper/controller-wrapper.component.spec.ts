import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerWrapperComponent } from './controller-wrapper.component';

describe('ControllerWrapperComponent', () => {
    let component: ControllerWrapperComponent;
    let fixture: ComponentFixture<ControllerWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ControllerWrapperComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControllerWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
