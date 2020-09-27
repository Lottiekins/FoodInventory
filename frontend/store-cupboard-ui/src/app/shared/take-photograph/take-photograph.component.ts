import {Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';

import { faCamera, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-take-photograph',
  templateUrl: './take-photograph.component.html',
  styleUrls: ['./take-photograph.component.scss']
})
export class TakePhotographComponent implements OnInit, OnDestroy {

  @Output() newDataURLEvent: EventEmitter<string> = new EventEmitter<string>();

  private videoElementGlobal: HTMLVideoElement;
  private videoWidth = 0;
  private videoHeight = 0;

  private constraints: MediaStreamConstraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 720 },
      height: { ideal: 405 }
    }
  };
  public stream: MediaStream;

  public happyWithThePic: boolean = false;

  public faCamera = faCamera;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stream.getTracks().forEach(track => track.stop())
  }

  emitProductImage() {
    let canvasElement: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvasElement');
    this.newDataURLEvent.emit(canvasElement.toDataURL());
  }

  captureProductImage() {
    let canvasElement: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvasElement');
    this.renderer.setProperty(canvasElement, 'width', this.videoWidth);
    this.renderer.setProperty(canvasElement, 'height', this.videoHeight);
    canvasElement.getContext('2d').drawImage(this.videoElementGlobal, 0, 0);
    this.toggleHappyWithThePic();
  }

  toggleHappyWithThePic() {
    this.happyWithThePic = !this.happyWithThePic;
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints)
          .then(this.attachVideo.bind(this))
          .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    this.stream = stream;
    let videoElement: HTMLVideoElement = <HTMLVideoElement> document.getElementById('videoElement');
    this.renderer.setProperty(videoElement, 'srcObject', this.stream);
    this.renderer.listen(videoElement, 'play', () => {
      this.videoHeight = videoElement.videoHeight;
      this.videoWidth = videoElement.videoWidth;
      this.videoElementGlobal = videoElement;
    });
  }

  handleError(error) {
    console.log('Error: ', error);
  }

}
