import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Item, ItemAdded, ItemNotAdded } from "../../item/models/item.model";


@Injectable({
  providedIn: 'root'
})
export class ScanBackendService {

  constructor(private http: HttpClient) {
  }

  getItem(itemId: number): Observable<Item[]> {
    let url = `https://192.168.1.13:8000/api/v1/item/get/${itemId}`;
    return this.http.get<Item[]>(url);
  }

  addItem(barcodeData: string): Observable<any> {
    let url = `https://192.168.1.13:8000/api/v1/item/add/${barcodeData}`;
    return this.http.get<any>(url);
  }

}
