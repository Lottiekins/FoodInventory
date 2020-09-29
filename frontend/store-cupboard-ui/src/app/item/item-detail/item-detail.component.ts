import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { faBarcode, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { ItemService } from "../services/item.service";

import { Item } from "../models/item.model";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  @ViewChild('photographProduct')
  public photographProduct: NgbModalRef;

  public activeModal: NgbModalRef;

  public itemId: number;
  public item$: Observable<Item>;

  public faBarcode = faBarcode;
  public faCalendarDay = faCalendarDay;

  constructor(private ngbModalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private itemService: ItemService) {
    this.activatedRoute.params.subscribe(params => {
      this.itemId = params['id'];
    });
  }

  ngOnInit(): void {
    this.item$ = this.itemService.getItem(this.itemId);
  }

  openCaptureProductImageModal() {
    this.activeModal = this.ngbModalService.open(this.photographProduct, {backdrop: 'static'});
  }

  closeAllDialogModals(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

  onEmitNewDataURLEvent(dataURL: string) {
    console.log('onEmitNewDataURLEvent:', dataURL);
    this.activeModal.close();
    const csrftoken = localStorage.getItem('csrf_token');
    this.itemService.updateItemImage(this.itemId, dataURL, csrftoken).subscribe();
  }

}
