import { Injectable } from '@angular/core';
import {ProteinQuery} from "./protein-query";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  baseUrl = "https://chorus.cap.erymonite.com"
  constructor(private http: HttpClient) { }

  getProtein(protein: string) {
    return this.http.get<ProteinQuery>(`${this.baseUrl}/api/protein/?name=${protein}`)
  }

  getProteinUniprot(proteinID: number) {
    return this.http.get<any>(`${this.baseUrl}/api/protein/${proteinID}/get_uniprot/`)
  }
}
