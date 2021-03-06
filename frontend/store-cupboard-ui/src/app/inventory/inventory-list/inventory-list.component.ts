import { Component, isDevMode, OnInit, ViewChild } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators } from "@angular/forms"

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { faBan, faTrash, faCamera, faShoppingCart, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

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
  public inventories: Inventory[];
  public brandLogoSrc: string;

  @ViewChild('addInventoryDialog')
  public addInventoryDialog: NgbModalRef;

  @ViewChild('deleteConfirmDialog')
  public deleteConfirmDialog: NgbModalRef;
  public inventoryMarkedForDeletion: Inventory;

  @ViewChild('photographProduct')
  public photographProduct: NgbModalRef;

  public activeModal: NgbModalRef;

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
    name: ['', Validators.required],
    image: ['https://via.placeholder.com/150?text=No+Product+Image', Validators.required]
  });

  public faBan = faBan;
  public faTrash = faTrash;
  public faCamera = faCamera;
  public faShoppingCart = faShoppingCart;
  public faCalendarDay = faCalendarDay;

  constructor(private inventoryService: InventoryService,
              private ngbModalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.inventories$ = this.inventoryService.getAllInventories();
    this.brandLogoSrc = isDevMode() ? 'assets/images/pantry-egg-brand.png' : './static/ang-src/assets/images/pantry-egg-brand.png';
  }

  addNewInventory() {
    const csrftoken = localStorage.getItem('csrf_token');
    // Trim whitespace and submit new Inventory
    let newInventory: Inventory = {
      name: this.addInventoryForm.get('name').value.trim(),
      image: this.addInventoryForm.get('image').value.trim()
    }
    this.inventoryService.addInventory(newInventory, csrftoken).pipe(map((data: InventoryAdded) => {
      console.log(data);
      if (data.inventory_name === null || data.inventory_name?.length == 0 && !data.inventory_created) {
        // Failed: Blank inventory name
        this.addInventoryAlert.type = 'info';
        this.addInventoryAlert.message = `Inventory names cannot be blank/empty.`;
        this.addInventoryAlert.visible = true;
      } else if (data.inventory_name?.length >= 1 && !data.inventory_created) {
        // Failed: Existing inventory name
        this.addInventoryAlert.type = 'warning';
        this.addInventoryAlert.message = `An Inventory called '${data.inventory_name}' already exists, try another name.`;
        this.addInventoryAlert.visible = true;
      } else if (data.inventory_created) {
        // Success: Created inventory
        this.inventoryAdded = data;
        this.addInventoryAlert.message = `An Inventory called '${data.inventory_name}' has been created.`;
        this.closeAllDialogModals('New Inventory Created');
      }
    })).subscribe();
  }

  deleteInventory(inventoryId: number) {
    const csrftoken = localStorage.getItem('csrf_token');
    this.inventoryService.deleteInventory(inventoryId, csrftoken).pipe(map(data => {
      console.log('deleteInventory:', data);
      this.closeAllDialogModals('New Inventory Created');
    })).subscribe();
  }

  createAddInventoryForm() {
    this.addInventoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['https://via.placeholder.com/300?text=No+Image', Validators.required]
    });
  }

  openCaptureProductImageModal() {
    this.activeModal = this.ngbModalService.open(this.photographProduct, {backdrop: 'static'});
  }

  onEmitNewDataURLEvent(dataURL: string) {
    console.log('onEmitNewDataURLEvent:', dataURL);
    this.activeModal.close();
    this.addInventoryForm.get('image')?.setValue(dataURL);
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
