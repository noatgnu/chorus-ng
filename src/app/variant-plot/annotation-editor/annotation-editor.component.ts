import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-annotation-editor',
  templateUrl: './annotation-editor.component.html',
  styleUrls: ['./annotation-editor.component.scss']
})
export class AnnotationEditorComponent {
  private _data: any[] = []
  @Input() set data (data: any[]) {
    this._data = data
    for (const d of this._data) {
      const form = this.fb.group({
        'ax': [d.ax],
        'ay': [d.ay],
        'text': [d.text],
        'color': [d.font.color],
        'showarrow': [d.showarrow],
        'arrowhead': [d.arrowhead],
        'arrowsize': [d.arrowsize],
        'arrowwidth': [d.arrowwidth],
        'variantdata': [d.variantdata],
        'fontsize': [d.font.size],
      })
      this.annotationForm.push(form)
    }
  }

  get data() {
    return this._data
  }

  annotationForm: FormGroup[] = []

  constructor(private fb: FormBuilder) {

  }

}
