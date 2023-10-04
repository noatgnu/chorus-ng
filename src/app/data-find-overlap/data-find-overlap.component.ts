import {Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-data-find-overlap',
  templateUrl: './data-find-overlap.component.html',
  styleUrls: ['./data-find-overlap.component.scss']
})
export class DataFindOverlapComponent {
  private _dataLabels: string[] = []
  @Input() set dataLabels(value: string[]) {
    this._dataLabels = value
  }
  get dataLabels(): string[] {
    return this._dataLabels
  }

  form = this.fb.group({
    selectedData: [[],],
  })

  constructor(private fb: FormBuilder) {
  }
}
