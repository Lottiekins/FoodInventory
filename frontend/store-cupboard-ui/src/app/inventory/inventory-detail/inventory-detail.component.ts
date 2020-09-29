import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ColumnApi, GridApi } from "ag-grid-community";
import * as moment from "moment";

import { faCalendarDay, faHashtag, faCookie, faCookieBite, faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

import { InventoryService } from "../services/inventory.service";
import { InventoryItemService } from "../services/inventory-item.service";

import { Inventory } from "../models/inventory.model";
import { InventoryItem } from "../models/inventory-item.model";


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
  public inventory$: Observable<Inventory>;

  public inventoryItems$: Observable<InventoryItem[]>;

  public columnDefs;
  public columnTypes;
  public api: GridApi;
  public columnApi: ColumnApi;

  public faHashtag = faHashtag;
  public faCalendarDay = faCalendarDay;
  public faCookie = faCookie;
  public faCookieBite = faCookieBite;
  public faBox = faBox;
  public faBoxOpen = faBoxOpen;

  constructor(private ngbModalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private inventoryService: InventoryService,
              private inventoryItemService: InventoryItemService) {

    this.activatedRoute.params.subscribe(params => {
      this.inventoryId = params['id'];
    });

    this.columnDefs = [
      {
        field: 'item__name',
        headerName: 'Item',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        headerClass: ['bg-dark'],
        headerComponentParams: {
          template:
            '<div class="ag-cell-label-container" role="presentation">'+
            '    <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>'+
            '    <div ref="eLabel" class="ag-header-cell-label" role="presentation">'+
            '        <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>'+
            '        <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>'+
            '        <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>'+
            '        <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>'+
            '        <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>'+
            '        <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>'+
            '    </div>'+
            '</div>'
        },
        flex: 3,
      },
      {
        field: 'inventory__name',
        headerName: 'Inventory',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        initialHide: true,
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'purchase_date',
        headerName: 'Purchase Date',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.purchase_date !== null ?
            moment(params.node.data.purchase_date, 'YYYYMMDD').fromNow() :
            '-';
        },
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'expiration_date',
        headerName: 'Expiration Date',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.expiration_date !== null ?
            moment(params.node.data.expiration_date, 'YYYYMMDD').fromNow() :
            '-';
        },
        initialHide: true,
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'opened',
        headerName: 'Opened',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.opened === true ? '✔️' : '❌';
        },
        headerClass: 'bg-dark',
        flex: 1,
      },
      {
        field: 'opened_date',
        headerName: 'Opened Date',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.opened_date !== null ?
            moment(params.node.data.opened_date, 'YYYYMMDD').fromNow() :
            '-';
        },
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'opened_by_id__username',
        headerName: 'Opened By',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'consumed',
        headerName: 'Consumed',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.consumed === true ? '✔️' : '❌';
        },
        headerClass: 'bg-dark',
        flex: 1,
      },
      {
        field: 'consumption_date',
        headerName: 'Consumption Date',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        cellRenderer: (params) => {
          return params.node.data.consumption_date !== null ?
            moment(params.node.data.consumption_date, 'YYYYMMDD').fromNow() :
            '-';
        },
        headerClass: 'bg-dark',
        flex: 2,
      },
      {
        field: 'consumed_by_id__username',
        headerName: 'Consumed By',
        type: ['nonEditableColumn'],
        sortable: true,
        resizable: true,
        headerClass: 'bg-dark',
        flex: 2,
      },
    ];

    this.columnTypes = {
      nonEditableColumn: { editable: false },
    }

  }

  ngOnInit(): void {
    this.inventory$ = this.inventoryService.getInventory(this.inventoryId);
    this.inventoryItems$ = this.inventoryItemService.getAllInventoryItems(this.inventoryId)
      .pipe(tap(inventoryItems => {
        inventoryItems.forEach(inventoryItem => {
          this.columnApi.setColumnVisible('expiration_date', inventoryItem.expiration_date !== null);
          this.columnApi.setColumnVisible('opened_date', inventoryItem.opened);
          this.columnApi.setColumnVisible('opened_by_id__username', inventoryItem.opened);
          this.columnApi.setColumnVisible('consumption_date', inventoryItem.consumed);
          this.columnApi.setColumnVisible('consumed_by_id__username', inventoryItem.consumed);
        });
      }
    ));
  }

  onGridReady(type: string, api: GridApi, columnApi: ColumnApi) {
    // console.log('type', type, '; api', api, '; columnApi', columnApi);
    this.api = api;
    this.columnApi = columnApi;
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
    this.activeModal = this.ngbModalService.open(this.addItemToInventoryModal, {backdrop: 'static'});
  }

}
