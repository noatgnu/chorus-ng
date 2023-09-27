import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-protein-selection',
  templateUrl: './protein-selection.component.html',
  styleUrls: ['./protein-selection.component.scss']
})
export class ProteinSelectionComponent implements OnInit{
  form = this.fb.group({
    term: ['Q5S007']
  })
  @Output() search: EventEmitter<string> = new EventEmitter<string>()
  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }

  submit() {
    if (this.form.valid) {
      if (typeof this.form.value.term === 'string') {
        console.log(this.form.value.term)
        this.form.value.term = this.form.value.term.trim()
        this.search.emit(this.form.value.term)
      }
      //this.ws.sessionID = this.form.value.sessionID
    }
  }
}
