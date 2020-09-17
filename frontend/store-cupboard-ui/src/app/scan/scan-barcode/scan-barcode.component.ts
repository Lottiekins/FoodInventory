import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { debounce, map, take } from "rxjs/operators";
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { ScanBackendService } from "../services/scan-backend-service.service";


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

  scannerEnabled: boolean = true;
  torchEnabled: boolean = false;
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

  constructor(private scanBackendService: ScanBackendService) {
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

  onTorchCompatible(event) {
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
    console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    this.hasCameras = false;
    this.availableDevices = [];
  }

  scanSuccessHandler(barcodeData: string) {
    this.onAudioPlay();
    this.barcodeResultString = barcodeData + ' [FINDING]';
    this.scanBackendService.addItem(barcodeData).pipe(
      debounce(() => interval(1000)),
      take(1),
      map(data => {
        console.log('scanBackendService:', data);
        if (data?.item_added) {
          this.barcodeResultString = data.item_added[0].name + ' [ADDED]';
        } else if (data?.item_not_added) {
          this.barcodeResultString = data.item_not_added.code + ' [FAILED]';
        }
      })
    ).subscribe();
  }

  scanErrorHandler(event) {
  }

  scanFailureHandler(event) {
  }

  scanCompleteHandler(event) {
  }

  onAudioPlay() {
    this.audioPlayerRef.nativeElement.play();
  }

}
