import {Component, Input} from '@angular/core';
import {Variant} from "../protein-query";
import {Settings} from "../settings";
import {SettingsService} from "../settings.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DataService} from "../data.service";

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent {
  private _data: Variant[] = []
  @Input() set data(value: Variant[]) {
    this._data = value
    for (const d of this._data) {
      const form = this.fb.group({
        annotate: [`${d.original}${d.position}${d.mutated}` in this.settings.settings.annotations]
      })
      this.formMap[`${d.original}${d.position}${d.mutated}`] = form
      form.controls.annotate.valueChanges.subscribe((value) => {
        if (value !== null) {
          this.dataService.annotationTrigger.next({variant: d, status: value})
          console.log(value)
        }
      })
    }
  }

  get data() {
    return this._data
  }
  formMap: {[key: string]: FormGroup} = {}

  constructor(public settings: SettingsService, private fb: FormBuilder, private dataService: DataService) { }
}
