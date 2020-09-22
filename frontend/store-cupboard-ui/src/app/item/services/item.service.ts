import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Item } from "../models/item.model";


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<Item[]> {
    const url = `https://192.168.1.13:8000/api/v1/items`;
    return this.http.get<Item[]>(url);
  }

  addItem(item: Item): Observable<Item> {
    const url = `https://192.168.1.13:8000/api/v1/item/add/`;
    return this.http.post<Item>(url, item, { withCredentials: true });
  }

}
