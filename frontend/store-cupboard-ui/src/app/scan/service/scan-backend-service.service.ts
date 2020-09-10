import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Item, ItemAdded, ItemNotAdded } from "../models/item.model";


@Injectable({
  providedIn: 'root'
})
export class ScanBackendService {

  constructor(private http: HttpClient) {
  }

  getItem(itemId: number): Observable<Item[]> {
    let url = `http://localhost:8000/api/item/get/${itemId}`;
    return this.http.get<Item[]>(url);
  }

  addItem(barcodeData: string): Observable<any> {
    let url = `http://localhost:8000/api/item/add/${barcodeData}`;
    return this.http.get<any>(url);
  }

}
