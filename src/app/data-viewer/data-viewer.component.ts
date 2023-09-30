import {Component, Input} from '@angular/core';
import {Variant} from "../protein-query";
import {Settings} from "../settings";
import {SettingsService} from "../settings.service";

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent {
  private _data: Variant[] = []
  @Input() set data(value: Variant[]) {
    this._data = value
  }

  get data() {
    return this._data
  }
  constructor(public settings: SettingsService) { }
}
