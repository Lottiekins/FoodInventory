import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

import { ItemService } from "../services/item.service";

import { Item } from "../models/item.model";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  items$: Observable<Item[]>;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

}
