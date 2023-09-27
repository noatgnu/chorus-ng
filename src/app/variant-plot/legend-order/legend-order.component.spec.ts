import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendOrderComponent } from './legend-order.component';

describe('LegendOrderComponent', () => {
  let component: LegendOrderComponent;
  let fixture: ComponentFixture<LegendOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegendOrderComponent]
    });
    fixture = TestBed.createComponent(LegendOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
