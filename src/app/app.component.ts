import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Protein, ProteinQuery} from "./protein-query";
import {WebService} from "./web.service";





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit{
  title = 'chorus-ng';
  results: Protein[] = []
  constructor(private web: WebService) {

  }

  searchForVariantUsingProtein(protein: string) {
    const req = this.web.getProtein(protein)
    req.subscribe((data) => {
      this.results = data.results
    })
  }

  ngAfterViewInit() {
    this.searchForVariantUsingProtein("Q5S007")
  }
}
