import {Component, Input} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SettingsService} from "../settings.service";

@Component({
  selector: 'app-data-rename-dialog',
  templateUrl: './data-rename-dialog.component.html',
  styleUrls: ['./data-rename-dialog.component.scss']
})
export class DataRenameDialogComponent {
  @Input() originalName: string = ""

  form = this.fb.group({
    name: [this.originalName, Validators.required]
  })

  constructor(private fb: FormBuilder, private settings: SettingsService) {
    this.form.controls.name.valueChanges.subscribe((data) => {
      if (data) {
        if (settings.settings.importedFile[data]) {
          this.form.controls.name.setErrors({nameExists: true})
        } else {
          this.form.controls.name.setErrors(null)
        }
      }
    })
  }

}
