import {Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-legend-rename',
  templateUrl: './legend-rename.component.html',
  styleUrls: ['./legend-rename.component.scss']
})
export class LegendRenameComponent {
  _legend: any = {}
  legendKeys: string[] = []
  @Input() set legend(value: any) {
    this._legend = value
    this.legendKeys = Object.keys(this._legend)
    const formObject: any = {}

    for (const k of this.legendKeys) {
      formObject[k] = [this._legend[k]]
    }
    this.form = this.fb.group(formObject)
  }

  form = this.fb.group({})

  constructor(private fb: FormBuilder) { }


}
