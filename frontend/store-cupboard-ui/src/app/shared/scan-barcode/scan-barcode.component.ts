import { Component, OnInit, AfterViewInit, OnDestroy,
         Output, ViewChild, ElementRef, EventEmitter, isDevMode } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, take, tap, throttleTime } from "rxjs/operators";

import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from "@zxing/ngx-scanner";

import { faLightbulb as fasLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';

import { ItemService } from "../../item/services/item.service";
import { OpenFoodFactsService } from "../services/openfoodfacts.service";

import { ProductQuery } from "../models/openfoodfacts.modal";
import { Item } from "../../item/models/item.model";


@Component({
  selector: 'app-scan-barcode',
  templateUrl: './scan-barcode.component.html',
  styleUrls: ['./scan-barcode.component.scss']
})
export class ScanBarcodeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() newProductQueryEvent: EventEmitter<ProductQuery> = new EventEmitter<ProductQuery>();
  @Output() existingItemEvent: EventEmitter<Item> = new EventEmitter<Item>();

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  scanSuccess$: Subject<string> = new Subject<string>();

  @ViewChild('audioCheckoutBleep')
  audioPlayerRef: ElementRef;
  audioPlay$: Promise<any>;
  audioCheckoutBleepSrc: string;

  scannerEnabled: boolean = true;
  isTorchCompatible: boolean = false;
  torchEnabled: boolean = false;
  fasLightbulb = fasLightbulb;
  farLightbulb = farLightbulb;
  hasCameras: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[];
  selectedDevice$: Observable<MediaDeviceInfo>;
  allowedFormats = [
    BarcodeFormat.AZTEC,
    BarcodeFormat.CODABAR,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.ITF,
    BarcodeFormat.MAXICODE,
    BarcodeFormat.PDF_417,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.RSS_14,
    BarcodeFormat.RSS_EXPANDED,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.UPC_EAN_EXTENSION
  ];
  barcodeResultString: string = '';
  badgeClass: string = '';
  badgeString: string = '';

  private items: Item[] = [];

  private blankProduct = {
    _keywords: [],
    additives_tags: [],
    brands: "",
    brands_tags: [],
    categories: "",
    code: "",
    countries_lc: "",
    created_t: 0,
    data_quality_tags: [],
    id: 0,
    image_front_url: "",
    image_ingredients_url: "",
    image_thumb_url: "",
    image_url: "",
    ingredients: [],
    ingredients_from_palm_oil_n: 0,
    ingredients_hierarchy: [],
    ingredients_original_tags: [],
    ingredients_tags: [],
    ingredients_text_en: "",
    ingredients_text_with_allergens: "",
    ingredients_text_with_allergens_en: "",
    ingredients_that_may_be_from_palm_oil_tags: [],
    lang: "",
    last_modified_t: 0,
    lc: "",
    nutriments: undefined,
    nutrition_data_per: "",
    nutrition_data_prepared_per: "",
    popularity_tags: [],
    product_name: "",
    product_name_en: "",
    product_name_fr: "",
    quantity: "",
    scans_n: 0,
    selected_images: undefined,
    states: "",
    states_tags: [],
    unique_scans_n: 0
  }

  constructor(private itemService: ItemService,
              private openFoodFactsService: OpenFoodFactsService) {
  }

  ngOnInit(): void {
    this.audioCheckoutBleepSrc = isDevMode() ? 'assets/audio/Checkout%20Scanner%20Beep-SoundBible.com-593325210.mp3'
                                             : '/static/ang-src/assets/audio/Checkout%20Scanner%20Beep-SoundBible.com-593325210.mp3';
    this.itemService.getAllItems().pipe(map(items => {
      this.items = items;
      return items;
    })).subscribe();

    this.scanSuccess$.pipe(
      throttleTime(5000),
      take(1),
      map(barcodeData => {
        this.barcodeResultString = barcodeData;
        this.audioCheckoutBleepPlay();
        // CHECK BARCODE ALREADY EXISTS IN DB
        let existingItem = this.items.find(x => x.barcode === parseInt(barcodeData));
        if (existingItem) {
          // BARCODE ALREADY EXISTS IN ITEMS/PRODUCTS LIST
          this.existingItemEvent.emit(existingItem);
        } else {
          // CHECK BARCODE ALREADY EXISTS IN OPENFOODFACTS
          this.badgeClass = 'badge-info';
          this.badgeString = 'FINDING';
          this.openFoodFactsService.getProduct(barcodeData).pipe(
            take(1),
            map((data: ProductQuery) => {
              if (data.product != undefined) {
                this.barcodeResultString = data.product.product_name;
                this.badgeClass = 'badge-success';
                this.badgeString = 'SUCCESS';
              } else {
                console.warn('[FAILED] ', data.status_verbose);
                this.barcodeResultString = data.status_verbose;
                this.badgeClass = 'badge-danger';
                this.badgeString = 'FAILED';
              }
              if (this.badgeString === 'SUCCESS') {
                // PRODUCT ALREADY EXISTS IN OPENFOODFACTS
                this.newProductQueryEvent.emit(data);
              } else {
                // NO PRODUCT FOUND IN OPENFOODFACTS
                this.emitEmptyProductQuery(barcodeData, data.status_verbose, data.status);
              }
            }),
            catchError(err => {
              // OPENFOODFACTS BROKE
              this.barcodeResultString = `[${err.status}] '${err.statusText}'`;
              this.badgeClass = 'badge-danger'
              this.badgeString = 'ERROR'
              this.emitEmptyProductQuery(barcodeData, err.statusText, err.status);
              console.error('[ERROR] ', err);
              return throwError(err);
            })
          ).subscribe();
        }
    })).subscribe();

  }

  ngAfterViewInit(): void {
    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  ngOnDestroy(): void {
    this.scanner = undefined;
  }

  camerasFoundHandler(devices: MediaDeviceInfo[]) {
    console.log('Devices: ', devices);
    this.hasCameras = true;
    this.availableDevices = devices;
    if (this.availableDevices.filter(device => device.label.includes('facing back')).length >= 1) {
      this.onDeviceSelectChange(this.availableDevices.find(device => device.label.includes('facing back')).deviceId);
    } else {
      this.onDeviceSelectChange(this.availableDevices[0].deviceId);
    }
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log('Selection changed: ', selectedValue);
    this.selectedDevice$ = of(this.availableDevices.find(device => device.deviceId == selectedValue));
  }

  camerasNotFoundHandler(event) {
    console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.', event);
    this.hasCameras = false;
    this.availableDevices = [];
  }

  onTorchCompatible(event: boolean) {
    this.isTorchCompatible = event;
  }

  toggleTorch() {
    this.torchEnabled = !this.torchEnabled;
  }

  scanSuccessHandler(scanSuccessEvent: string) {
    console.log('scanSuccessHandler: ', scanSuccessEvent);
    this.scanSuccess$.next(scanSuccessEvent);
  }

  emitEmptyProductQuery(barcodeData: string, status_verbose: string, status: number) {
    let data: ProductQuery = {
      product: this.blankProduct,
      status_verbose: status_verbose,
      status: status,
      code: barcodeData
    };
    data.product.code = barcodeData;
    this.newProductQueryEvent.emit(data);
  }

  scanErrorHandler(event) {
    console.error('[ERROR] scanErrorHandler:', event);
  }

  audioCheckoutBleepPlay() {
    this.audioPlay$ = this.audioPlayerRef.nativeElement.play();
    if (this.audioPlay$ != undefined) {
      this.audioPlay$.then(() => {
      }).catch(error => {
        console.error('[ERROR] onAudioPlay:', error);
      });
    }
  }

}
