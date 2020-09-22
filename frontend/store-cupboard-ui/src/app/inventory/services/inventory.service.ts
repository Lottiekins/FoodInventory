import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Inventory, InventoryAdded } from "../models/inventory.model";
import { Item } from "../../item/models/item.model";


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {
  }

  getInventories(): Observable<Inventory[]> {
    let url = `https://192.168.1.13:8000/api/v1/inventories`;
    return this.http.get<Inventory[]>(url);
  }

  addInventory(inventory: Inventory, csrftoken: string): Observable<InventoryAdded> {
    let url = `https://192.168.1.13:8000/api/v1/inventory/add`;
    let headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken })
    return this.http.post<InventoryAdded>(url, inventory, {headers});
  }

}
