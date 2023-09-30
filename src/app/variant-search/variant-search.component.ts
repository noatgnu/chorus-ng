import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {VariantSimple} from "../variant-simple";
import {Variant} from "../protein-query";
import {DataService} from "../data.service";

@Component({
  selector: 'app-variant-search',
  templateUrl: './variant-search.component.html',
  styleUrls: ['./variant-search.component.scss']
})
export class VariantSearchComponent {
  @Output() search: EventEmitter<VariantSimple[]> = new EventEmitter<VariantSimple[]>()
  form = this.fb.group({
    variants: ["", Validators.required]
  })
  variants: VariantSimple[] = []

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // subscribe to changes in variants text field with debounce of 500ms
    this.form.controls['variants'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((value) => {
      // if the value is not null, split the string by commas
      if (value) {
        let variants = value.toUpperCase().split(",")
        // if the last variant is empty, remove it
        if (variants[variants.length - 1] === "") {
          variants.pop()
        }
        // if the length of variants is greater than 0, emit the variants
        if (variants.length > 0) {
          // parse the variants into VariantSimple objects
          const variantsSimple: VariantSimple[] = []
          variants.forEach((variant: string) => {
            const match = /([A-Za-z]+)(\d+)([A-Za-z]+)/.exec(variant)
            if (match) {
              const m = {
                original: match[1],
                position: parseInt(match[2]),
                mutated: match[3]
              }
              if (m.original.length === 3) {
                if (this.dataService.aminoAcid3to1[m.original]) {
                  m.original = this.dataService.aminoAcid3to1[m.original].slice()
                }
              }
              if (m.mutated.length === 3) {
                if (this.dataService.aminoAcid3to1[m.mutated]) {
                  m.mutated = this.dataService.aminoAcid3to1[m.mutated].slice()
                }
              }
              if (m.original.length === 1 && m.mutated.length === 1) {
                variantsSimple.push(m)
              }
            }
          })
          this.variants = variantsSimple
        }
      }
    })
  }

  submit() {
    if (this.form.valid) {
      console.log(this.variants)
      this.search.emit(this.variants)
    }
  }

}
