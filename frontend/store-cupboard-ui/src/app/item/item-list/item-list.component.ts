import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { faBarcode, faBan, faDrumstickBite, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';

import { ItemService } from "../services/item.service";
import { WikipediaApiService } from "../../scan/services/wikipedia-api.service";

import { ProductQuery } from "../../scan/models/openfoodfacts.modal";
import { Item, ItemAdded, WeightFormatChoicesEnum, WeightFormatEnum } from "../models/item.model";
import { Alert } from "../../shared/models/alert.model";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @ViewChild('barcodeScanner')
  public barcodeScanner: NgbModalRef;

  @ViewChild('addItemDialog')
  public addItemDialog: NgbModalRef;

  public items$: Observable<Item[]>;

  public addItemAlert: Alert = {
    type: 'info',
    message: '-',
    visible: false
  };

  public itemAdded: ItemAdded = {
    item: null,
    item_created: false,
  };

  public weightFormatChoicesEnum: any = Object.entries(WeightFormatChoicesEnum);

  public addItemForm = new FormGroup ({
    barcode: new FormControl(),
    brands: new FormArray([ new FormControl("")]),
    product_name: new FormControl(),
    selected_images: new FormControl(),
    _keywords: new FormControl()
  });
  public showPortionableFields: boolean = false;

  @ViewChild('deleteConfirmDialog')
  public deleteConfirmDialog: NgbModalRef;

  public itemMarkedForDeletion: Item;

  public faBan = faBan;
  public faBarcode = faBarcode;
  public faCalendarDay = faCalendarDay;
  public faSearchEngine = faSearchengin;
  public faDrumstickBite = faDrumstickBite;

  constructor(private itemService: ItemService,
              private wikipediaApiService: WikipediaApiService,
              private ngbModalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

  openScanningModal() {
    this.ngbModalService.open(this.barcodeScanner);
  }

  closeAllDialogModals(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

  openDeleteConfirmDialog(item: Item): void {
    this.itemMarkedForDeletion = item;
    this.ngbModalService.open(this.deleteConfirmDialog);
  }

  deleteItem(itemId: number) {
    const csrftoken = localStorage.getItem('csrf_token');
    this.itemService.deleteItem(itemId, csrftoken).pipe(map(data => {
      console.log('deleteInventory:', data);
      this.closeAllDialogModals('New Inventory Created');
      this.items$ = this.itemService.getItems();
    })).subscribe();
  }

  getWeightFormatEnum(key: string): string {
    let weightFormatEnum: [string, string] = Object.entries(WeightFormatEnum).find(x => x[0] === key);
    if (weightFormatEnum != undefined) {
      return weightFormatEnum[1];
    }
  }

  onEmitNewProductQueryEvent(productQuery: ProductQuery) {
    this.closeAllDialogModals('NewProductQuery Received');
    this.openAddItemDialogModal(productQuery);
  }

  createAddItemForm(productQuery: ProductQuery) {
    this.addItemForm = this.formBuilder.group({
      barcode: productQuery.product.code,
      manufacturer: '',
      brands: productQuery.product.brands,
      name: productQuery.product.product_name,
      image: productQuery.product.selected_images?.front ? productQuery.product.selected_images.front.display[productQuery.product.lc] :
             'https://via.placeholder.com/150?text=No+Product+Image',
      total_weight: 0,
      total_weight_format: null,
      portionable: false,
      group_serving: 0,
      portion_weight: 0,
      portion_weight_format: WeightFormatEnum.GRAM,
      consume_within_x_days_of_opening: 0
    })
  }

  openAddItemDialogModal(productQuery: ProductQuery) {
    this.createAddItemForm(productQuery);
    this.ngbModalService.open(this.addItemDialog, {backdrop: 'static'});
  }

  findManufacturerName() {
    let searchTerm: string = encodeURI(this.addItemForm.get('name').value);
    this.wikipediaApiService.openSearchQuery(searchTerm).pipe(take(1), map(opensearch => {
      this.wikipediaApiService.extractsPropQuery(opensearch['opensearch'][0]).pipe(take(1), map(extracts => {

        if (extracts['extract'] != undefined) {
          let extract: string = extracts['extract'];
          let regex: RegExp = /(?<=((manufactured|distributed) by ))([[a-zA-Z0-9\\s]+)/gm;
          let match: string = extract.match(regex)[0];
          if (regex.test(extract)) {
            this.addItemForm.get('manufacturer').setValue(match);
          }
        } else if (extracts['title'] != undefined) {
          let title: string = extracts['title'];
          this.addItemForm.get('manufacturer').setValue(title);
        } else {
          this.addItemForm.get('manufacturer').setValue('Unknown');
        }

      })).subscribe();
    })).subscribe();
  }

  findBrandName() {
    this.wikipediaApiService.openSearchQuery(this.addItemForm.get('name').value).pipe(take(1), map(opensearch => {
      this.wikipediaApiService.extractsPropQuery(opensearch['opensearch'][0]).pipe(take(1), map(extracts => {

        if (extracts['extract'] != undefined) {
          let extract: string = extracts['extract'];
          let regex: RegExp = /(?<=<b>).+(?=<\/b> is a brand)/gm;
          let match: string = extract.match(regex)[0];
          if (regex.test(extract)) {
            this.addItemForm.get('brands').setValue(match);
          }
        } else if (extracts['title'] != undefined) {
          let title: string = extracts['title'];
          this.addItemForm.get('brands').setValue(title);
        } else {
          this.addItemForm.get('brands').setValue('Unknown');
        }

      })).subscribe();
    })).subscribe();
  }

  togglePortionableFields() {
    this.showPortionableFields = !this.showPortionableFields;
  }

  addNewItem() {
    const csrftoken = localStorage.getItem('csrf_token');
    let item: Item = {
      barcode: this.addItemForm.get('barcode').value,
      brand: {
        manufacturer: {
          name: this.addItemForm.get('manufacturer').value
        },
        name: this.addItemForm.get('brands').value
      },
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
    this.itemService.addItem(item, csrftoken).pipe(map((data: ItemAdded) => {
      console.log(data);
      if (data.item.name?.length == 0 && !data.item_created) {
        // Failed: Blank item name
        this.addItemAlert.type = 'info';
        this.addItemAlert.message = `Inventory names cannot be blank/empty.`;
        this.addItemAlert.visible = true;
      } else if (data.item.name?.length >= 1 && !data.item_created) {
        // Failed: Existing inventory name
        this.addItemAlert.type = 'warning';
        this.addItemAlert.message = `An Inventory called '${data.item.name}' already exists, try another name.`;
        this.addItemAlert.visible = true;
      } else if (data.item_created) {
        // Success: Created inventory
        this.itemAdded = data;
        this.addItemAlert.message = `An Inventory called '${data.item.name}' has been created.`;
        this.closeAllDialogModals('New Item Added');
        this.items$ = this.itemService.getItems();
      }
    })).subscribe();
  }

}
