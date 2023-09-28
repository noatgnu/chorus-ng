import {Component, Input} from '@angular/core';
import {SettingsService} from "../../settings.service";

@Component({
  selector: 'app-pathogenicity-filter',
  templateUrl: './pathogenicity-filter.component.html',
  styleUrls: ['./pathogenicity-filter.component.scss']
})
export class PathogenicityFilterComponent {
  filterObjects: any[] = []
  keys: string[] = []
  @Input() set pathogenicityFilter(value: any) {
    for (const key in value) {
      this.keys.push(key)
      for (const key2 in value[key]) {
        this.filterObjects.push({"dataset": key, "pathogenicity": key2, status: value[key][key2]})
      }
    }
  }

  constructor() {


  }
}
