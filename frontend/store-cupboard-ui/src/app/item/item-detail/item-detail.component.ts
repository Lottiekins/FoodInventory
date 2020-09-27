import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { faBarcode, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { ItemService } from "../services/item.service";

import { Item } from "../models/item.model";


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  public itemId: number;
  public item$: Observable<Item>;

  public faBarcode = faBarcode;
  public faCalendarDay = faCalendarDay;

  constructor(private activatedRoute: ActivatedRoute,
              private itemService: ItemService) {
    this.activatedRoute.params.subscribe(params => {
      this.itemId = params['id'];
    });
  }

  ngOnInit(): void {
    this.item$ = this.itemService.getItem(this.itemId);
  }

}
