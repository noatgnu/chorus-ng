import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathogenicityFilterComponent } from './pathogenicity-filter.component';

describe('PathogenicityFilterComponent', () => {
  let component: PathogenicityFilterComponent;
  let fixture: ComponentFixture<PathogenicityFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathogenicityFilterComponent]
    });
    fixture = TestBed.createComponent(PathogenicityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
