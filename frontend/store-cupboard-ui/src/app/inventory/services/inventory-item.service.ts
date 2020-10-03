import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, Subject, timer } from "rxjs";
import { map, retry, share, switchMap, takeUntil } from "rxjs/operators";

import { InventoryItem, InventoryItemAdded } from "../models/inventory-item.model";


@Injectable({
  providedIn: 'root'
})
export class InventoryItemService implements OnDestroy {

  public openAddInventoryItemModal$ = new Subject();
  private stopPolling$ = new Subject();

  constructor(private http: HttpClient) {
  }

  ngOnDestroy() {
    this.stopPolling$.next();
  }

  getInventoryItem(inventoryId: number, inventoryItemId: number): Observable<InventoryItem> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}/item/${inventoryItemId}`;
    return timer(1, 15 * 1000).pipe(
      switchMap(() => this.http.get<InventoryItem>(url)),
      retry(),
      map(inventoryItem => inventoryItem[0]),
      share(),
      takeUntil(this.stopPolling$)
    );
  }

  getAllInventoryItems(inventoryId: number): Observable<InventoryItem[]> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}/items`;
    return timer(1, 60 * 1000).pipe(
      switchMap(() => this.http.get<InventoryItem[]>(url)),
      retry(),
      share(),
      takeUntil(this.stopPolling$)
    );
  }

  addInventoryItem(inventoryId: number, itemId: number, csrftoken: string): Observable<InventoryItemAdded> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}/item/add`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : ''});
    return this.http.post<InventoryItemAdded>(url, itemId, {headers});
  }

  updateInventoryItem(inventoryId: number, id: number, inventoryItem: InventoryItem, csrftoken: string): Observable<boolean> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}/item/update/${id}`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : ''});
    return this.http.post<boolean>(url, inventoryItem, {headers});
  }

  deleteInventoryItem(inventoryId: number, id: number, csrftoken: string): Observable<boolean> {
    const url = `https://192.168.1.13:8000/api/v1/inventory/${inventoryId}/item/delete/${id}`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : ''});
    return this.http.delete<boolean>(url, {headers});
  }

  triggerOpenAddInventoryItemModal() {
    this.openAddInventoryItemModal$.next();
  }

}
