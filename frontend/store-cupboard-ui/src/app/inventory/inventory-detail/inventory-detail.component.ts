import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, of } from "rxjs";
import {filter, map, take, tap} from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ColumnApi, GridApi } from "ag-grid-community";

import { faCalendarDay, faHashtag, faCookie, faCookieBite, faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

import { ItemService } from "../../item/services/item.service";
import { InventoryService } from "../services/inventory.service";
import { InventoryItemService } from "../services/inventory-item.service";

import { Item } from "../../item/models/item.model";
import { Inventory } from "../models/inventory.model";
import { InventoryItem } from "../models/inventory-item.model";

import { ProductQuery } from "../../shared/models/openfoodfacts.modal";
import { InventoryDetailNoRowsOverlayComponent } from "../inventory-detail-no-rows-overlay/inventory-detail-no-rows-overlay.component";
import {InventoryDetailBtnCellRendererComponent} from "../inventory-detail-btn-cell-renderer/inventory-detail-btn-cell-renderer.component";


@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  @ViewChild('photographInventoryModal')
  public photographInventoryModal: NgbModalRef;

  @ViewChild('addItemToInventoryModal')
  public addItemToInventoryModal: NgbModalRef;

  public activeModal: NgbModalRef;

  public inventoryId: number;
  public inventory: Inventory;
  public inventory$: Observable<Inventory>;

  public inventoryItems$: Observable<InventoryItem[]>;

  public columnDefs;
  public columnTypes;
  public api: GridApi;
  public columnApi: ColumnApi;

  public frameworkComponents;
  public noRowsOverlayComponent;
  public noRowsOverlayComponentParams;

  public faHashtag = faHashtag;
  public faCalendarDay = faCalendarDay;
  public faCookie = faCookie;
  public faCookieBite = faCookieBite;
  public faBox = faBox;
  public faBoxOpen = faBoxOpen;

  public overlayNoRowsTemplate: string;

  constructor(private router: Router,
              private ngbModalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private itemService: ItemService,
              private inventoryService: InventoryService,
              private inventoryItemService: InventoryItemService) {

    this.activatedRoute.params.subscribe(params => {
      this.inventoryId = params['id'];
    });

    this.frameworkComponents = {
      customLoadingOverlay: InventoryDetailNoRowsOverlayComponent,
      customNoRowsOverlay: InventoryDetailNoRowsOverlayComponent,
      customBtnRenderer: InventoryDetailBtnCellRendererComponent,
    };
    this.noRowsOverlayComponent = 'customNoRowsOverlay';
    this.noRowsOverlayComponentParams = { inventoryId: this.inventoryId };

    this.columnDefs = [];

    this.columnTypes = {
      nonEditableColumn: { editable: false },
    }

    this.inventoryItemService.openAddInventoryItemModal$.subscribe(() => {
      this.activeModal = this.ngbModalService.open(this.addItemToInventoryModal, {backdrop: 'static'});
    });

  }

  ngOnInit(): void {
    this.inventory$ = this.inventoryService.getInventory(this.inventoryId).pipe(tap(inventory => {
      this.inventory = inventory;
    }));
    this.inventoryItems$ = this.inventoryItemService.getAllInventoryItems(this.inventoryId).pipe(
      map(x => x.filter(y => !y.consumed))
    );
  }

  onGridReady(type: string, api: GridApi, columnApi: ColumnApi) {
    // console.log('type', type, '; api', api, '; columnApi', columnApi);
    this.api = api;
    this.columnApi = columnApi;
    this.api.sizeColumnsToFit();
  }

  onColumnResized() {
    this.api.sizeColumnsToFit();
  }

  myDateComparator(filterLocalDateAtMidnight, cellValue) {
    let dateParts = cellValue.split('/');
    let day = Number(dateParts[0]);
    let month = Number(dateParts[1]) - 1;
    let year = Number(dateParts[2]);
    let cellDate = new Date(year, month, day);
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    } else {
      return 0;
    }
  }

  openCaptureInventoryImageModal() {
    this.activeModal = this.ngbModalService.open(this.photographInventoryModal, {backdrop: 'static'});
  }

  closeAllDialogModals(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

  onEmitNewDataURLEvent(dataURL: string) {
    console.log('onEmitNewDataURLEvent:', dataURL);
    this.activeModal.close();
    const csrftoken = localStorage.getItem('csrf_token');
    this.inventoryService.updateInventoryImage(this.inventoryId, dataURL, csrftoken).subscribe();
  }

  onAddItemToInventoryClicked() {
    this.inventoryItemService.triggerOpenAddInventoryItemModal();
  }

  onExistingItemEvent(item: Item) {
    this.closeAllDialogModals('Existing Item Event');
    const csrftoken = localStorage.getItem('csrf_token');
    this.inventoryItemService.addInventoryItem(this.inventoryId, item.id, csrftoken).subscribe();
    this.inventoryItemService.getAllInventoryItems(this.inventoryId).pipe(take(1), tap(data => {
      this.inventoryItems$ = of(data);
    })).subscribe();
  }

  onNewProductQueryEvent(productQuery: ProductQuery) {
    this.closeAllDialogModals('New Product Query Event');
    this.router.navigate(['/item']).then(() => {
      setTimeout(() => {
        this.itemService.openAddItemModal$.next(productQuery);
      },  500);
    });
  }

}
