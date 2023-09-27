import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendRenameComponent } from './legend-rename.component';

describe('LegendRenameComponent', () => {
  let component: LegendRenameComponent;
  let fixture: ComponentFixture<LegendRenameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegendRenameComponent]
    });
    fixture = TestBed.createComponent(LegendRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
