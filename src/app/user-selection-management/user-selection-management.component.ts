import {Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-user-selection-management',
  templateUrl: './user-selection-management.component.html',
  styleUrls: ['./user-selection-management.component.scss']
})
export class UserSelectionManagementComponent {
  selection: string[] = []
  @Input() set selected(value: string[]) {
    this.selection = value
  }
  form = this.fb.group({
    selected:["",],
    remove: [false,]
  })

  constructor(private fb: FormBuilder) {
  }
}
