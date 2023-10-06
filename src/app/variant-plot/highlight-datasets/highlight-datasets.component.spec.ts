import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightDatasetsComponent } from './highlight-datasets.component';

describe('HighlightDatasetsComponent', () => {
  let component: HighlightDatasetsComponent;
  let fixture: ComponentFixture<HighlightDatasetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightDatasetsComponent]
    });
    fixture = TestBed.createComponent(HighlightDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
