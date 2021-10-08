import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcePickerComponent } from './source-picker.component';

describe('SourcePickerComponent', () => {
    let component: SourcePickerComponent;
    let fixture: ComponentFixture<SourcePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ SourcePickerComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SourcePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
