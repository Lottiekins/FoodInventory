import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from "rxjs/operators";
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { ScanBackendService } from "../service/scan-backend-service.service";


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

  hasCameras = false;
  hasPermission: boolean;
  availableDevices: MediaDeviceInfo[];
  selectedDevice$: Observable<MediaDeviceInfo>;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13 ];
  barcodeResultString: string = '';

  constructor(private scanBackendService: ScanBackendService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;
      console.log('Devices: ', devices);
      this.availableDevices = devices;
      this.onDeviceSelectChange(this.availableDevices[0].deviceId);
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  onCodeResult(barcodeData: string) {
    console.log('onCodeResult:', barcodeData);
    this.scanBackendService.addItem(barcodeData).pipe(
      take(1),
      map(data => {
        console.log('scanBackendService:', data);
        if (data?.item_added) {
          this.onAudioPlay();
          this.barcodeResultString = data.item_added[0].name + ' [ADDED]';
        } else if (data?.item_not_added) {
          this.barcodeResultString = data.item_not_added.code + ' [FAILED]';
        }
      })
    ).subscribe();
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log('Selection changed: ', selectedValue);
    this.selectedDevice$ = of(this.availableDevices.find(device => device.deviceId == selectedValue));
  }

  onAudioPlay() {
    this.audioPlayerRef.nativeElement.play();
  }

}
