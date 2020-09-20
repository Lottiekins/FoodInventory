import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class WikipediaApiService {

  constructor(private http: HttpClient) {
  }

  openSearchQuery(searchTerm: string): Observable<any> {
    // TODO: ADD BACKEND ENDPOINT
    let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&format=json`;
    return this.http.get<any>(url);
  }

  extractsPropQuery(searchTerm: string): Observable<any> {
    // TODO: ADD BACKEND ENDPOINT
    let url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${searchTerm}&format=json`;
    return this.http.get<any>(url);
  }

}
