import {Component, Input} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {SettingsService} from "../../settings.service";

@Component({
  selector: 'app-highlight-datasets',
  templateUrl: './highlight-datasets.component.html',
  styleUrls: ['./highlight-datasets.component.scss']
})
export class HighlightDatasetsComponent {
  private _datasets: string[] = []
  @Input() set datasets (value: string[]) {
    this._datasets = value
    const selected: string[] = []
    for (const d of this._datasets) {
      if (this.settings.settings.specialHighlight[d]) {
        selected.push(d)
      }
    }
    this.form.controls['datasets'].setValue(selected)
  }

  get datasets(): string[] {
    return this._datasets
  }

  form = this.fb.group({
    datasets: new FormControl<string[]>([])
  })

  constructor(private fb: FormBuilder, public settings: SettingsService) {

  }
}
