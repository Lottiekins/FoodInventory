import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { NgbModal, NgbModalRef  } from "@ng-bootstrap/ng-bootstrap";

import { faCalendarDay, faHashtag } from '@fortawesome/free-solid-svg-icons';

import { InventoryService } from "../services/inventory.service";

import { Inventory } from "../models/inventory.model";


@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  @ViewChild('photographInventory')
  public photographInventory: NgbModalRef;

  public activeModal: NgbModalRef;

  public inventoryId: number;
  public inventory$: Observable<Inventory>;

  public faHashtag = faHashtag;
  public faCalendarDay = faCalendarDay;

  constructor(private ngbModalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private inventoryService: InventoryService) {
    this.activatedRoute.params.subscribe(params => {
      this.inventoryId = params['id'];
    });
  }

  ngOnInit(): void {
    this.inventory$ = this.inventoryService.getInventory(this.inventoryId);
  }

  openCaptureInventoryImageModal() {
    this.activeModal = this.ngbModalService.open(this.photographInventory, {backdrop: 'static'});
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

}
