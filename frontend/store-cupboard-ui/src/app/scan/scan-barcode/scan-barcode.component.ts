import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { interval, Observable, of, throwError } from 'rxjs';
import { catchError, debounce, map, take } from "rxjs/operators";

import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from "@zxing/ngx-scanner";

import { faLightbulb as fasLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';

import { ScanBackendService } from "../services/scan-backend-service.service";
import {ItemService} from "../../item/services/item.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-scan-barcode',
  templateUrl: './scan-barcode.component.html',
  styleUrls: ['./scan-barcode.component.scss']
})
export class ScanBarcodeComponent implements OnInit, AfterViewInit {

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  @ViewChild('audioCheckoutBleep')
  audioPlayerRef: ElementRef;
  audioPlay$: Promise<any>;

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

  constructor(private scanBackendService: ScanBackendService,
              private ngbModalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log('Selection changed: ', selectedValue);
    this.selectedDevice$ = of(this.availableDevices.find(device => device.deviceId == selectedValue));
  }

  onTorchCompatible(event: boolean) {
    this.isTorchCompatible = event;
  }

  toggleTorch() {
    this.torchEnabled = !this.torchEnabled;
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

  camerasNotFoundHandler(event) {
    console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.', event);
    this.hasCameras = false;
    this.availableDevices = [];
  }

  scanSuccessHandler(barcodeData: string) {
    this.onAudioPlay();
    this.barcodeResultString = barcodeData;
    this.badgeClass = 'badge-info'
    this.badgeString = 'FINDING'
    this.scanBackendService.addItem(barcodeData).pipe(
      debounce(() => interval(2000)),
      take(1),
      map(data => {
        console.log('scanBackendService:', data);
        if (data?.item_added) {
          this.barcodeResultString = data.item_added[0].name;
          this.badgeClass = 'badge-success'
          this.badgeString = 'ADDED'
          this.ngbModalService.dismissAll('Item Scanned Successfully');
        } else if (data?.item_not_added) {
          this.barcodeResultString = data.item_not_added.code;
          this.badgeClass = 'badge-danger'
          this.badgeString = 'FAILED'
        }
      }),
      catchError(err => {
        this.barcodeResultString = err;
        this.badgeClass = 'badge-danger'
        this.badgeString = 'ERROR'
        console.warn('[ERROR] ', err);
        return throwError(err);
      })
    ).subscribe();
  }

  scanErrorHandler(event) {
    console.error('[ERROR] scanErrorHandler:', event);
  }

  onAudioPlay() {
    this.audioPlay$ = this.audioPlayerRef.nativeElement.play();
    if (this.audioPlay$ != undefined) {
      this.audioPlay$.then(() => {
      }).catch(error => {
        console.error('[ERROR] onAudioPlay:', error);
      });
    }
  }

}
