import { Injectable } from '@angular/core';
import {ProteinQuery} from "./protein-query";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

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

  saveSession(data: any) {
    let payload = new FormData()
    payload.append("file", data.file)
    payload.append("description", data.description)
    return this.http.post<any>(`${this.baseUrl}/api/chorus_session/`, payload, {responseType: 'json', observe: 'body'})
  }

  async downloadSession(sessionID: string) {
    // download session json data and check if there is an url property, if there is then download that file and return its content instead
    const firstResult = await this.http.get<{url: string}>(`${this.baseUrl}/api/chorus_session/${sessionID}/download/`, {responseType: 'json', observe: 'body'}).toPromise()
    if (firstResult) {
      return await this.http.get(firstResult.url, {responseType: 'json', observe: "events", reportProgress: true}).toPromise()
    } else {
      return null
    }
  }
}
