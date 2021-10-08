import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityControllerComponent } from './entity-controller.component';

describe('BaseControllerComponent', () => {
    let component: EntityControllerComponent;
    let fixture: ComponentFixture<EntityControllerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EntityControllerComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityControllerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
