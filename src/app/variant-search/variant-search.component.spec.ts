import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSearchComponent } from './variant-search.component';

describe('VariantSearchComponent', () => {
  let component: VariantSearchComponent;
  let fixture: ComponentFixture<VariantSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantSearchComponent]
    });
    fixture = TestBed.createComponent(VariantSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
