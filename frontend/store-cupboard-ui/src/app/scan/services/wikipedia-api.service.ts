import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class WikipediaApiService {

  constructor(private http: HttpClient) {
  }

  openSearchQuery(searchTerm: string): Observable<any> {
    let url = `https://192.168.1.13:8000/api/v1/wikipedia/opensearch/${searchTerm}`;
    return this.http.get<any>(url);
  }

  extractsPropQuery(searchTerm: string): Observable<any> {
    let url = `https://192.168.1.13:8000/api/v1/wikipedia/extracts/${searchTerm}`;
    return this.http.get<any>(url);
  }

}
