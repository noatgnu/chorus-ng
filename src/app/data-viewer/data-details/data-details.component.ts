import {Component, Input} from '@angular/core';
import {SettingsService} from "../../settings.service";
import {DataService} from "../../data.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-data-details',
  templateUrl: './data-details.component.html',
  styleUrls: ['./data-details.component.scss']
})
export class DataDetailsComponent {
  dataLabels: string[] = []
  private _data: any = {}
  @Input() set data (value: any) {
    for (const i in value) {
      this.dataLabels.push(i)
    }
    this._data = value
  }

  get data() {
    return this._data
  }



  constructor(public settings: SettingsService, private dataService: DataService, private fb: FormBuilder) {
    this.dataService.updateTrigger.subscribe((data) => {
     this.dataLabels = Object.keys(this.data)
    })

  }

}
