import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantPlotComponent } from './variant-plot.component';

describe('VariantPlotComponent', () => {
  let component: VariantPlotComponent;
  let fixture: ComponentFixture<VariantPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantPlotComponent]
    });
    fixture = TestBed.createComponent(VariantPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
