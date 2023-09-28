import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-domains',
  templateUrl: './custom-domains.component.html',
  styleUrls: ['./custom-domains.component.scss']
})
export class CustomDomainsComponent {
  @Input() domains: any[] = []

  addDomain() {
    this.domains.push({
      name: "",
      start: 0,
      end: 0
    })
  }

  removeDomain(index: number) {
    this.domains.splice(index, 1)
  }
}
