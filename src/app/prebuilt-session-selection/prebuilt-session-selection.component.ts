import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-prebuilt-session-selection',
  templateUrl: './prebuilt-session-selection.component.html',
  styleUrls: ['./prebuilt-session-selection.component.scss']
})
export class PrebuiltSessionSelectionComponent {
  @Output() sessionData: EventEmitter<string> = new EventEmitter<string>()

  form = this.fb.group({
    sessionID: [""]
  })

  data: any[] = [
    {
      name: "LRRK2 with MDSGene and gnomAd",
      value: "MDSGene.gnomAd"
    },
    {
      name: "LRRK2 with MDSGene and PDBrowser",
      value: "MDSGene.pdbrowser"
    }
  ]
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  submit() {
    if (this.form.valid) {
      this.http.get("assets/" + this.form.value.sessionID + ".json").subscribe((data: any) => {
        this.sessionData.emit(data)
      })
    }
  }

}
