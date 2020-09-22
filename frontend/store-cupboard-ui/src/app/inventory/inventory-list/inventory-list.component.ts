import { Component, isDevMode, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Observable, timer} from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { faShoppingCart, faBan } from '@fortawesome/free-solid-svg-icons';

import { InventoryService } from "../services/inventory.service";

import {Inventory, InventoryAdded} from "../models/inventory.model";


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  public inventories$: Observable<Inventory[]>;
  public brandLogoSrc: string;

  @ViewChild('addInventoryDialog') addInventoryDialog: NgbModalRef;

  public addInventoryAlert: Alert = {
    type: 'info',
    message: '-',
    visible: false
  };

  public inventoryAdded: InventoryAdded = {
    inventory_name: '',
    inventory_created: false,
  };

  addInventoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  });

  faBan = faBan;
  faShoppingCart = faShoppingCart;

  constructor(private inventoryService: InventoryService,
              private ngbModalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.inventories$ = timer(0, 60 * 1000).pipe(switchMap(() => {
      this.inventoryAdded = {
        inventory_name: '',
        inventory_created: false,
      };
      return this.inventoryService.getInventories();
    }));
    this.brandLogoSrc = isDevMode() ? 'assets/images/pantry-egg-brand.png' : './static/ang-src/assets/images/pantry-egg-brand.png';
  }

  addNewInventory() {
    const csrftoken = localStorage.getItem('csrf_token');
    this.inventoryService.addInventory(this.addInventoryForm.get('name').value, csrftoken).pipe(map(data => {
      // console.log(data);
      if (data.inventory_name.length == 0 && !data.inventory_created) {
        // Failed: Blank inventory name
        this.addInventoryAlert.type = 'info';
        this.addInventoryAlert.message = `Inventory names cannot be blank/empty.`;
        this.addInventoryAlert.visible = true;
      } else if (data.inventory_name.length >= 1 && !data.inventory_created) {
        // Failed: Existing inventory name
        this.addInventoryAlert.type = 'warning';
        this.addInventoryAlert.message = `An Inventory called '${data.inventory_name}' already exists, try another name.`;
        this.addInventoryAlert.visible = true;
      } else if (data.inventory_created) {
        // Success: Created inventory
        this.inventoryAdded = data;
        this.addInventoryAlert.message = `An Inventory called '${data.inventory_name}' has been created.`;
        this.closeAddInventoryDialogModal('New Inventory Created');
        this.inventories$ = this.inventoryService.getInventories();
      }
    })).subscribe();
  }

  createAddInventoryForm() {
    this.addInventoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  openAddInventoryDialogModal(): void {
    this.addInventoryAlert.type = 'info';
    this.addInventoryAlert.message = '-';
    this.addInventoryAlert.visible = false;
    this.createAddInventoryForm();
    this.ngbModalService.open(this.addInventoryDialog);
  }

  addInventoryAlertDismissed(): void {
    this.addInventoryAlert.visible = false;
  }

  addInventoryToastDismissed(): void {
  }

  closeAddInventoryDialogModal(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

}

interface Alert {
  type: string;
  message: string;
  visible: boolean;
}
