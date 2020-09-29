import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { BehaviorSubject } from "rxjs";

import { WebcamComponent, WebcamImage, WebcamInitError } from "ngx-webcam";

import { faCamera, faExchangeAlt, faSync, faSyncAlt, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as fasLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-take-photograph',
  templateUrl: './take-photograph.component.html',
  styleUrls: ['./take-photograph.component.scss']
})
export class TakePhotographComponent implements OnInit, OnDestroy {

  @ViewChild('ngxWebcam') ngxWebcam: WebcamComponent;

  @Output() newDataURLEvent: EventEmitter<string> = new EventEmitter<string>();

  public takePhoto$: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  public happyWithThePic: boolean = false;
  public detectedConstraints: boolean = false;
  public torchEnabled: boolean = false;
  public isTorchCapable: boolean = false;

  public imageCapture: WebcamImage;

  public inMemoryVideo: HTMLVideoElement;
  public inMemoryVideoTrack: MediaStreamTrack;
  public mediaTrackCapabilities: MediaTrackCapabilities;
  public mediaTrackConstraints: MediaTrackConstraints = {
    facingMode: 'environment',
    width: { exact: 720 },
    height: { exact: 405 },
    aspectRatio: 1.777777778,
    // @ts-ignore
    torch: this.torchEnabled
  };

  public canvasElement: HTMLCanvasElement;
  public canvasContext2D: CanvasRenderingContext2D;

  public faSync = faSync;
  public faCamera = faCamera;
  public faSyncAlt = faSyncAlt;
  public faThumbsUp = faThumbsUp;
  public fasLightbulb = fasLightbulb;
  public farLightbulb = farLightbulb;
  public faThumbsDown = faThumbsDown;
  public faExchangeAlt = faExchangeAlt;

  constructor() {
  }

  ngOnInit(): void {
    this.checkIsTorchCapable();
    this.canvasElement = <HTMLCanvasElement> document.getElementById('canvasElement');
    this.canvasContext2D = this.canvasElement.getContext('2d');
  }

  ngOnDestroy(): void {
  }

  checkIsTorchCapable() {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      }
    })
    .then((stream) => {
      this.inMemoryVideo = document.createElement('video');
      this.inMemoryVideo.srcObject = stream;
      this.inMemoryVideoTrack = stream.getTracks()[0];
      this.inMemoryVideo.addEventListener('loadedmetadata', () => {
        setTimeout(() => {
          this.onCapabilitiesReady(this.inMemoryVideoTrack, this.inMemoryVideoTrack.getCapabilities());
        }, 500);
      });
    })
    .catch(err => console.error('getUserMedia() failed: ', err));
  }

  onCapabilitiesReady(track: MediaStreamTrack, capabilities: MediaTrackCapabilities) {
    this.mediaTrackCapabilities = capabilities;
    // @ts-ignore
    if (capabilities.torch) {
      this.isTorchCapable = true;
    }
    setTimeout(() => {
      this.inMemoryVideoTrack.stop();
      this.detectedConstraints = true;
    }, 500);
  }

  toggleTorch() {
    if (this.isTorchCapable) {
      this.torchEnabled = !this.torchEnabled;
    }
    // @ts-ignore
    if (this.mediaTrackCapabilities.torch) {
      this.inMemoryVideoTrack.applyConstraints({
        // @ts-ignore
        advanced: [{torch: this.torchEnabled}]
      })
      .catch(e => console.log(e));
    }
  }

  onCaptureImageClick() {
    this.takePhoto$.next(null);
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  cameraWasSwitched(cameraSwitched: string) {
    // console.log('cameraWasSwitched:', cameraSwitched);
  }

  onImageCapture(imageCapture: WebcamImage) {
    // console.log('imageCapture:', imageCapture);
    this.imageCapture = imageCapture;
    if (this.imageCapture.imageData != null) {
      // console.log('height:', imageCapture.imageData.height, 'width:', imageCapture.imageData.width);
      if (this.imageCapture.imageData.height > this.imageCapture.imageData.width) {
        // Rotate image 90 degrees to match phone
        this.drawRotatedImageData(this.canvasContext2D, this.imageCapture.imageData, 0, 0,
          this.imageCapture.imageData.width, this.imageCapture.imageData.height, 90);
      } else {
        this.drawImageData(this.canvasContext2D, this.imageCapture.imageData, 0, 0);
      }
    }
  }

  drawImageData(ctx: CanvasRenderingContext2D, imageData: ImageData, dx: number, dy: number) {
    ctx.putImageData(imageData, dx, dy);
    this.toggleHappyWithThePic();
  }

  drawRotatedImageData(ctx: CanvasRenderingContext2D, imageData: ImageData, dx: number, dy: number,
                       width: number, height: number, rotation: number) {
    let inMemoryCanvas = document.createElement('canvas');
    inMemoryCanvas.width = width;
    inMemoryCanvas.height = height;
    inMemoryCanvas.getContext('2d').putImageData(imageData, 0, 0);
    ctx.save();
    ctx.translate(width/2 + 160, height/2 - 150);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(inMemoryCanvas, -width/2, -height/2);
    ctx.restore();
    this.toggleHappyWithThePic();
  }

  toggleHappyWithThePic() {
    this.happyWithThePic = !this.happyWithThePic;
  }

  mirrorImage() {
    this.canvasContext2D.save();
    this.canvasContext2D.setTransform(1, 0, 0, -1, 0, this.canvasElement.height);
    this.canvasContext2D.drawImage(this.canvasElement, 0, 0);
    this.canvasContext2D.restore();
  }

  rotateImage() {
    this.canvasContext2D.save();
    this.canvasContext2D.translate(this.canvasElement.width/2,this.canvasElement.height/2);
    this.canvasContext2D.rotate(Math.PI);
    this.canvasContext2D.drawImage(this.canvasElement, -this.canvasElement.width/2,-this.canvasElement.height/2);
    this.canvasContext2D.restore();
  }

  emitImageDataUrl() {
    this.newDataURLEvent.emit(this.canvasElement.toDataURL());
  }

}
