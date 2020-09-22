import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, timer } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { faBarcode, faBan, faDrumstickBite } from '@fortawesome/free-solid-svg-icons';
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

  faBan = faBan;
  faBarcode = faBarcode;
  faSearchengin = faSearchengin;
  faDrumstickBite = faDrumstickBite;

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
    this.wikipediaApiService.openSearchQuery(this.addItemForm.get('name').value).pipe(take(1), map(opensearch => {
      // console.log('openSearchQuery:', opensearch['opensearch']);
      this.wikipediaApiService.extractsPropQuery(opensearch['opensearch'][0]).pipe(take(1), map(extracts => {
        // console.log('extracts:', extracts);
        let regex: RegExp = /(?<=((manufactured|distributed) by ))([[a-zA-Z0-9\\s]+)/gm;
        let extract: string = extracts['extract'];
        let match: string = extract.match(regex)[0];
        if (regex.test(extract)) {
          // console.log('match:', match);
          this.addItemForm.get('manufacturer').setValue(match);
        }
      })).subscribe();
    })).subscribe();
  }

  findBrandName() {
    this.wikipediaApiService.openSearchQuery(this.addItemForm.get('name').value).pipe(take(1), map(opensearch => {
      // console.log('openSearchQuery:', opensearch['opensearch']);
      this.wikipediaApiService.extractsPropQuery(opensearch['opensearch'][0]).pipe(take(1), map(extracts => {
        // console.log('extracts:', extracts);
        let regex: RegExp = /(?<=<b>).+(?=<\/b> is a brand)/gm;
        let extract: string = extracts['extract'];
        let match: string = extract.match(regex)[0];
        if (regex.test(extract)) {
          // console.log('match:', match);
          this.addItemForm.get('brands').setValue(match);
        }
      })).subscribe();
    })).subscribe();
  }

  togglePortionableFields() {
    this.showPortionableFields = !this.showPortionableFields;
  }

  addNewItem() {
    let item: Item = {
      id: null,
      barcode: this.addItemForm.get('barcode').value,
      brandId: this.addItemForm.get('brands').value,
      name: this.addItemForm.get('name').value,
      total_weight: this.addItemForm.get('total_weight').value,
      total_weight_format: this.addItemForm.get('total_weight_format').value,
      image: this.addItemForm.get('image').value,
      portionable: this.showPortionableFields,
      group_serving: this.addItemForm.get('group_serving').value,
      portion_weight: this.addItemForm.get('portion_weight').value,
      portion_weight_format: this.addItemForm.get('portion_weight_format').value,
      consume_within_x_days_of_opening: this.addItemForm.get('consume_within_x_days_of_opening').value,
    }
    this.itemService.addItem(item).subscribe();
    // this.closeScanningModal('New Item Added');
  }

}
