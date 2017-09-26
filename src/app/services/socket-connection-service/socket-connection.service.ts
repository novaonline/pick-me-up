import { LocationService } from './../location-service/location.service';
import { ToastService } from './../toast-service/toast.service';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { } from '@types/googlemaps';
import { SocketClientType } from '../../models/socket-client/index';

@Injectable()
export class SocketConnectionService {

  // thing that should be refactored out
  private WEB_SOCKET_URL = "localhost:3000";

  private _roomName: string;
  private _socket: any;
  private clientType$ = new Subject<SocketClientType>();
  private location$ = new Subject<google.maps.LatLng>();
  private duration$ = new Subject<google.maps.Duration>();
  constructor(
    private _toastService: ToastService,
  ) { }

  public connectAndListen(roomName: string): void {
    this._roomName = roomName;
    this._socket = io.connect(this.WEB_SOCKET_URL, { query: `room=${this._roomName}` });
    this.listen();
  }
  public observeClientType(): Observable<SocketClientType> {
    return this.clientType$.asObservable();
  }
  public observeLocation(): Observable<google.maps.LatLng> {
    return this.location$.asObservable();
  }
  public observeDurationFromReceiver(): Observable<google.maps.Duration> {
    return this.duration$.asObservable();
  }
  public sendLocation(latLng: google.maps.LatLng) {
    this._socket.emit('sendLocation', this._roomName, latLng);
  }
  public sendDuration(duration: google.maps.Duration) {
    this._socket.emit('sendDuration', this._roomName, duration);
  }
  public fetchDurationFromReceiver(): void {
    this._socket.on('getDuration', (duration) => {
      this.duration$.next(duration);
    })
  }
  private listen(): void {
    this.convertClientTypeSocketEventToObservable();
    this.convertGetLocationSocketEventToObservable();
    this.convertConnectSocketEventToToastMessage();
  }
  private convertConnectSocketEventToToastMessage(): void {
    this._socket.on('connect', () => {
      this._toastService.info(`A new user has connected`);
    });
  }
  private convertClientTypeSocketEventToObservable(): void {
    this._socket.on('clientType', (type) => {
      switch (type) {
        case 'HOST':
          this.clientType$.next(SocketClientType.SENDER);
          this._toastService.info(`You are the sender.`);
          this._toastService.info(`If you haven't done so already, please allow location services.`);
          break;
        default:
          this.clientType$.next(SocketClientType.RECEIVER);
          this._toastService.info(`You are the receiver.`);
          break;
      }
    });
  }
  private convertGetLocationSocketEventToObservable(): void {
    this._socket.on('getLocation', (latLng: google.maps.LatLng) => {
      this.location$.next(latLng);
    });
  }
}
