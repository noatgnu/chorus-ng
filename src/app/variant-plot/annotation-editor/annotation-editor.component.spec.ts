import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationEditorComponent } from './annotation-editor.component';

describe('AnnotationEditorComponent', () => {
  let component: AnnotationEditorComponent;
  let fixture: ComponentFixture<AnnotationEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationEditorComponent]
    });
    fixture = TestBed.createComponent(AnnotationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
