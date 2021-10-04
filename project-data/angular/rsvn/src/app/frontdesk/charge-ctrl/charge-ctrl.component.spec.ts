import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCtrlComponent } from './charge-ctrl.component';

describe('ChargeCtrlComponent', () => {
  let component: ChargeCtrlComponent;
  let fixture: ComponentFixture<ChargeCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
