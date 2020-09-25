import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Inventory, InventoryAdded } from "../models/inventory.model";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {
  }

  getInventories(): Observable<Inventory[]> {
    const url = `https://192.168.1.13:8000/api/v1/inventories`;
    return this.http.get<Inventory[]>(url);
  }

  addInventory(inventory: Inventory, csrftoken: string): Observable<InventoryAdded> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/add`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : '' });
    return this.http.post<InventoryAdded>(url, inventory, {headers});
  }

  deleteInventory(id: number, csrftoken: string): Observable<boolean> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/delete/${id}`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : '' });
    return this.http.delete<boolean>(url, {headers});
  }

}
