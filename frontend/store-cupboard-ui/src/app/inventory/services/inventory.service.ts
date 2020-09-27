import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, Subject, timer } from "rxjs";
import {map, retry, share, switchMap, takeUntil} from "rxjs/operators";

import { Inventory, InventoryAdded } from "../models/inventory.model";


@Injectable({
  providedIn: 'root'
})
export class InventoryService implements OnDestroy {

  private stopPolling = new Subject();

  constructor(private http: HttpClient) {
  }

  ngOnDestroy() {
   this.stopPolling.next();
  }

  getInventory(inventoryId: number): Observable<Inventory> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}`;
    return timer(1, 5*1000).pipe(
      switchMap(() => this.http.get<Inventory>(url)),
      retry(),
      map(inventory => inventory[0]),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  getAllInventories(): Observable<Inventory[]> {
    const url = `https://192.168.1.13:8000/api/v1/inventories`;
    return timer(1, 5*1000).pipe(
      switchMap(() => this.http.get<Inventory[]>(url)),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );
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
