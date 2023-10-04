import {Component, Input} from '@angular/core';
import {FilterColumn} from "../filter-column";
import {ImportedFile} from "../imported-file";
import {DataFrame} from "data-forge";

@Component({
  selector: 'app-data-filter-dialog',
  templateUrl: './data-filter-dialog.component.html',
  styleUrls: ['./data-filter-dialog.component.scss']
})
export class DataFilterDialogComponent {
  @Input() file: ImportedFile = {columns: [], data: new DataFrame(), dataType: "standard", form: {}, originalData: "", originalFileName: ""}
  filters: FilterColumn[] = []
  filterTypes: string[] = ["in", "equals", "greater than", "less than"]
  constructor() {}

  addFilter() {
    this.filters.push({column: "", filterType: "in", filterValue:""})
  }

  removeFilter(index: number) {
    this.filters.splice(index, 1)
  }
}
