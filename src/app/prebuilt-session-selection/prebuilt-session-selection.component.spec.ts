import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebuiltSessionSelectionComponent } from './prebuilt-session-selection.component';

describe('PrebuiltSessionSelectionComponent', () => {
  let component: PrebuiltSessionSelectionComponent;
  let fixture: ComponentFixture<PrebuiltSessionSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrebuiltSessionSelectionComponent]
    });
    fixture = TestBed.createComponent(PrebuiltSessionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
