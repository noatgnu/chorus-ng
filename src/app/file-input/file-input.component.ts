import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {DataFrame, fromCSV, IDataFrame} from 'data-forge';
import {ImportedFile} from "../imported-file";

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent {
  @Output() saveFile: EventEmitter<ImportedFile> = new EventEmitter<ImportedFile>()
  form = this.fb.group({
    variant: [''],
    pathogenicity: [''],
    columnsToKeep: [[],],
    name: [''],
  })
  df: IDataFrame = new DataFrame()
  fileName = ''
  originalData = ''
  constructor(private fb: FormBuilder) {

  }

  onFileSelected(event: Event) {
    if (event.target) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const reader = new FileReader();
        this.fileName = target.files[0].name
        this.form.controls.name.setValue(this.fileName)
        reader.onload = (e) => {
          this.originalData = <string>reader.result
          this.df = fromCSV(this.originalData)
        }
        reader.readAsText(target.files[0]);
      }
    }
  }

  save() {
    if (this.form.valid) {
      console.log(this.form.value)
      const importedFile: ImportedFile = {
        columns: this.df.getColumnNames(), data: this.df, dataType: "standard", form: this.form.value, originalData: this.originalData.slice(), originalFileName: this.fileName.slice()
      }
      this.saveFile.emit(importedFile)
    }
  }
}
