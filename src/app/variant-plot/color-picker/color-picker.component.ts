import {Component, Input} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  colorArray: any[] = []
  @Input() set colors(value: any[]) {
    this.colorArray = value
    console.log(this.colorArray)
  }

  constructor(private fb: FormBuilder) { }
}
