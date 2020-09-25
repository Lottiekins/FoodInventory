import { Component, isDevMode, OnInit, ViewChild } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators } from "@angular/forms";
import {Observable, pipe, timer} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { faShoppingCart, faBan, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { InventoryService } from "../services/inventory.service";

import { Alert } from "../../shared/models/alert.model";
import { Inventory, InventoryAdded } from "../models/inventory.model";


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  animations: [
    trigger('cardBorderTrigger', [
      state('new', style({borderColor: '#343a40'})),
      state('existing', style({borderColor: '#343a40'})),
      transition('* => new', [
        animate('500ms cubic-bezier(.15,1.95,.65,-1.25)',
          style({borderColor: '#28a745'})
        ),
        animate('3000ms ease-in', style({borderColor: '#343a40'})
        )
      ]),
    ])
  ]
})
export class InventoryListComponent implements OnInit {

  public inventories$: Observable<Inventory[]>;
  public brandLogoSrc: string;

  @ViewChild('addInventoryDialog')
  public addInventoryDialog: NgbModalRef;

  @ViewChild('deleteConfirmDialog')
  public deleteConfirmDialog: NgbModalRef;
  public inventoryMarkedForDeletion: Inventory;

  public addInventoryAlert: Alert = {
    type: 'info',
    message: '-',
    visible: false
  };

  public inventoryAdded: InventoryAdded = {
    inventory_name: '',
    inventory_created: false,
  };

  public addInventoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  });

  faBan = faBan;
  faShoppingCart = faShoppingCart;
  faCalendarDay = faCalendarDay;

  constructor(private inventoryService: InventoryService,
              private ngbModalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.inventories$ = timer(0, 30 * 1000).pipe(switchMap(() => {
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
    // Trim whitespace and submit new Inventory
    this.addInventoryForm.get('name').setValue(this.addInventoryForm.get('name').value.trim());
    this.inventoryService.addInventory(this.addInventoryForm.get('name').value, csrftoken).pipe(map((data: InventoryAdded) => {
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
        this.closeAllDialogModals('New Inventory Created');
        this.inventories$ = this.inventoryService.getInventories();
      }
    })).subscribe();
  }

  deleteInventory(inventoryId: number) {
    const csrftoken = localStorage.getItem('csrf_token');
    this.inventoryService.deleteInventory(inventoryId, csrftoken).pipe(map(data => {
      console.log('deleteInventory:', data);
      this.closeAllDialogModals('New Inventory Created');
      this.inventories$ = this.inventoryService.getInventories();
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

  openDeleteConfirmDialog(inventory: Inventory): void {
    this.inventoryMarkedForDeletion = inventory;
    this.ngbModalService.open(this.deleteConfirmDialog);
  }

  addInventoryAlertDismissed(): void {
    this.addInventoryAlert.visible = false;
  }

  closeAllDialogModals(reason: string) {
    this.ngbModalService.dismissAll(reason);
  }

}
