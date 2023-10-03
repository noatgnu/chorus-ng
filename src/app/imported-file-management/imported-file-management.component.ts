import { Component } from '@angular/core';
import {SettingsService} from "../settings.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-imported-file-management',
  templateUrl: './imported-file-management.component.html',
  styleUrls: ['./imported-file-management.component.scss']
})
export class ImportedFileManagementComponent {
  fileLabels: string[] = []
  form = this.fb.group({
    file: [""],
    remove: [false],
    subsetDialog: [false],
  })
  constructor(public settings: SettingsService, private fb: FormBuilder) {
    for (const key in settings.settings.importedFile) {
      this.fileLabels.push(key)
    }
  }


}
