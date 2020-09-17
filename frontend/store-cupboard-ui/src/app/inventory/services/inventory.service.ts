import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Inventory } from "../models/inventory.model";


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<Inventory[]> {
    let url = `https://192.168.1.13:8000/api/v1/inventories`;
    return this.http.get<Inventory[]>(url);
  }

}
