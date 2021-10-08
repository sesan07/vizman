import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLineComponent } from './control-line.component';

describe('ControlComponent', () => {
    let component: ControlLineComponent;
    let fixture: ComponentFixture<ControlLineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ControlLineComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
