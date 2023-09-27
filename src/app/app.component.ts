import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Protein, ProteinQuery} from "./protein-query";





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit{
  title = 'chorus-ng';
  results: Protein[] = []
  constructor(private http: HttpClient) {

  }

  searchForVariantUsingProtein(protein: string) {
    console.log(protein)
    const req = this.http.get<ProteinQuery>(`http://127.0.0.1:8000/api/protein/?name=${protein}`)
    req.subscribe((data) => {
      this.results = data.results
    })
  }

  ngAfterViewInit() {
    this.searchForVariantUsingProtein("Q5S007")
  }
}
