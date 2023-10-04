import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFindOverlapComponent } from './data-find-overlap.component';

describe('DataFindOverlapComponent', () => {
  let component: DataFindOverlapComponent;
  let fixture: ComponentFixture<DataFindOverlapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataFindOverlapComponent]
    });
    fixture = TestBed.createComponent(DataFindOverlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
