import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Item } from "../models/item.model";


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<Item[]> {
    let url = `https://192.168.1.13:8000/api/v1/items`;
    return this.http.get<Item[]>(url);
  }

}
