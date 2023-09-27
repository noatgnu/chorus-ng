import { Injectable } from '@angular/core';
import {ProteinQuery} from "./protein-query";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }

  getProtein(protein: string) {
    return this.http.get<ProteinQuery>(`http://127.0.0.1:8000/api/protein/?name=${protein}`)
  }

  getProteinUniprot(proteinID: number) {
    return this.http.get<any>(`http://127.0.0.1:8000/api/protein/${proteinID}/get_uniprot/`)
  }
}
