import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, Subject, timer } from "rxjs";
import {map, retry, share, switchMap, takeUntil} from "rxjs/operators";

import { Item, ItemAdded } from "../models/item.model";
import { ProductQuery } from "../../shared/models/openfoodfacts.modal";


@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {

  public openAddItemModal$ = new Subject<ProductQuery>();
  private stopPolling = new Subject();

  constructor(private http: HttpClient) {
  }

  ngOnDestroy() {
   this.stopPolling.next();
  }

  getItem(itemId: number): Observable<Item> {
    const url = `https://192.168.1.13:8000/api/v1/item/${itemId}`;
    return timer(1, 15*1000).pipe(
      switchMap(() => this.http.get<Item>(url)),
      retry(),
      map(item => item[0]),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  getAllItems(): Observable<Item[]> {
    const url = `https://192.168.1.13:8000/api/v1/items`;
    return timer(1, 15*1000).pipe(
      switchMap(() => this.http.get<Item[]>(url)),
      retry(),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  addItem(item: Item, csrftoken: string): Observable<ItemAdded> {
    const url = `https://192.168.1.13:8000/api/v1/item/add/`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : '' });
    return this.http.post<ItemAdded>(url, item, {headers});
  }

  updateItemImage(id: number, toDataURL: string, csrftoken: string): Observable<boolean> {
    const url = `https://192.168.1.13:8000/api/v1/item/update/${id}/image`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : '' });
    return this.http.post<boolean>(url, toDataURL, {headers});
  }

  deleteItem(id: number, csrftoken: string): Observable<boolean> {
    const url = `https://192.168.1.13:8000/api/v1/item/del/${id}`;
    const headers: HttpHeaders = new HttpHeaders({'X-CSRFToken': csrftoken != null ? csrftoken : '' });
    return this.http.delete<boolean>(url, {headers});
  }

  triggerOpenAddItemModal() {
    this.openAddItemModal$.next();
  }

}
