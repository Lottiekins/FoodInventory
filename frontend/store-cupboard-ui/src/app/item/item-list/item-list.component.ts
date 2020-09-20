import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, timer } from "rxjs";
import {map, switchMap} from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';

import { ItemService } from "../services/item.service";
import { WikipediaApiService } from "../../scan/services/wikipedia-api.service";

import { ProductQuery } from "../../scan/models/openfoodfacts.modal";
import { Item, WeightFormatEnum } from "../models/item.model";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @ViewChild('barcodeScanner') barcodeScanner: NgbModalRef;
  @ViewChild('addItemDialog') addItemDialog: NgbModalRef;

  items$: Observable<Item[]>;

  addItemForm = new FormGroup ({
    barcode: new FormControl(),
    brands: new FormArray([ new FormControl("")]),
    product_name: new FormControl(),
    selected_images: new FormControl(),
    _keywords: new FormControl()
  });
  showPortionableFields: boolean = false;

  faBarcode = faBarcode;
  faSearchengin = faSearchengin;

  constructor(private itemService: ItemService,
              private wikipediaApiService: WikipediaApiService,
              private ngbModalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.items$ = timer(0, 60 * 1000).pipe(switchMap(() => {
      return this.itemService.getItems();
    }));
  }

  openScanningModal() {
    this.ngbModalService.open(this.barcodeScanner);
  }

  closeScanningModal(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

  onEmitNewProductQueryEvent(productQuery: ProductQuery) {
    this.closeScanningModal('NewProductQuery Received');
    this.openAddItemDialogModal(productQuery);
  }

  createAddItemForm(productQuery: ProductQuery) {
    this.addItemForm = this.formBuilder.group({
      barcode: productQuery.product.code,
      manufacturer: '',
      brands: productQuery.product.brands,
      name: productQuery.product.product_name,
      image: productQuery.product.selected_images.front.display[productQuery.product.lc],
      total_weight: 0,
      total_weight_format: WeightFormatEnum.GRAM,
      portionable: false,
      group_serving: 0,
      portion_weight: 0,
      portion_weight_format: WeightFormatEnum.GRAM,
      consume_within_x_days_of_opening: 0
    })
  }

  openAddItemDialogModal(productQuery: ProductQuery) {
    this.createAddItemForm(productQuery);
    this.ngbModalService.open(this.addItemDialog);
  }

  findManufacturerName() {
    this.wikipediaApiService.openSearchQuery(this.addItemForm.get('manufacturer').value).pipe(map(data => {
      console.log('openSearchQuery:', data);
    })).subscribe();
  }

  findBrandName() {
    this.wikipediaApiService.openSearchQuery(this.addItemForm.get('brands').value).pipe(map(data => {
      console.log('openSearchQuery:', data);
    })).subscribe();
  }

  togglePortionableFields() {
    this.showPortionableFields = !this.showPortionableFields;
  }

}
