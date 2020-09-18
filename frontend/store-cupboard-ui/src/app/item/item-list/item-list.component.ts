import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, timer } from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

import { ItemService } from "../services/item.service";

import { Item } from "../models/item.model";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @ViewChild('barcodeScanner') barcodeScanner: NgbModalRef;

  items$: Observable<Item[]>;

  faBarcode = faBarcode;

  constructor(private itemService: ItemService,
              private ngbModalService: NgbModal) {
  }

  ngOnInit(): void {
    this.items$ = timer(0, 60 * 1000).pipe(switchMap(timer => {
      return this.itemService.getItems();
    }));
  }

  openScanningModal() {
    this.ngbModalService.open(this.barcodeScanner);
  }

  closeScanningModal(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

}
