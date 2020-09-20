import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ProductQuery } from "../models/openfoodfacts.modal";


@Injectable({
  providedIn: 'root'
})
export class OpenFoodFactsService {

  public lastOpenFoodFactsProductQuery$: BehaviorSubject<ProductQuery> = new BehaviorSubject<ProductQuery>(null);

  constructor(private http: HttpClient) {
  }

  getProduct(barcodeData: string): Observable<ProductQuery> {
    let url = `https://192.168.1.13:8000/api/v1/openfoodfacts/barcode/${barcodeData}`;
    return this.http.get<ProductQuery>(url).pipe(map(data => {
      this.lastOpenFoodFactsProductQuery$.next(data);
      return data;
    }));
  }

}
