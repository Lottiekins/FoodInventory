import { Component, OnInit } from '@angular/core';

import { INoRowsOverlayAngularComp } from "ag-grid-angular";
import { GridApi } from "ag-grid-community";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { InventoryItemService } from "../services/inventory-item.service";

import { InventoryItem } from "../models/inventory-item.model";


@Component({
  selector: 'app-inventory-detail-open-cell-renderer',
  templateUrl: './inventory-detail-btn-cell-renderer.component.html',
  styleUrls: ['./inventory-detail-btn-cell-renderer.component.scss']
})
export class InventoryDetailBtnCellRendererComponent implements OnInit, INoRowsOverlayAngularComp {

  private params: any;
  private gridApi: GridApi;
  public paramsData: InventoryItem;

  public btnName: string;
  public btnSize: string;
  public btnType: string;
  public btnClasses: string = '';
  public loadingButton: boolean = false;
  public disableButton: boolean = false;

  public faSpinner = faSpinner;

  constructor(private inventoryItemService: InventoryItemService) {
  }

  ngOnInit() {
  }

  agInit(params): void {
    this.params = params;
    this.gridApi = params.api;
    this.paramsData = params.data;
    // console.log(params.rowIndex, params);
    this.setButtonState(params);
    this.setDisableButton(params.data);
  }

  setButtonState(params) {
    this.btnName = params.btnName;
    this.btnSize = params.btnSize;
    this.btnType = params.btnType;
    this.btnClasses = this.btnSize + ' ' + this.btnType
  }

  setDisableButton(paramsData: any) {
    // console.log('setShowButton:', paramsData);
    switch (this.btnName) {
      case 'Open':
        this.disableButton = paramsData?.opened;
        break;
      case 'Eat':
        this.disableButton = !paramsData?.opened || paramsData?.consumed;
        break;
    }
    this.btnClasses = this.disableButton ? this.btnSize + ' btn-secondary' : this.btnClasses;
  }

  onBtnClicked(paramsData: any) {
    // console.log('onBtnClicked:', paramsData);
    this.loadingButton = true;
    const csrftoken = localStorage.getItem('csrf_token');
    switch (this.btnName) {
      case 'Open':
        paramsData.opened = !paramsData.opened;
        setTimeout(() => {
          this.inventoryItemService.updateInventoryItemOpened(paramsData.inventory_id, paramsData.id, paramsData, csrftoken)
            .subscribe(next => {},error => {},() => {
              this.collapseAndExpandRows();
            });
        }, 500);
        break;
      case 'Eat':
        paramsData.consumed = true;
        setTimeout(() => {
          this.inventoryItemService.updateInventoryItemConsumed(paramsData.inventory_id, paramsData.id, paramsData, csrftoken)
            .subscribe(next => {},error => {},() => {
              this.collapseAndExpandRows();
            });
        }, 500);
        break;
    }
  }

  collapseAndExpandRows() {
    setTimeout(() => {
      this.gridApi.getRowNode(this.params.node.parent.rowIndex).expanded = false;
      this.gridApi.onGroupExpandedOrCollapsed();
    }, 500);
    setTimeout(() => {
      this.gridApi.getRowNode(this.params.node.parent.rowIndex).expanded = true;
      this.gridApi.onGroupExpandedOrCollapsed();
    }, 500);
    setTimeout(() => {
      this.loadingButton = false;
    }, 500);
  }

}
