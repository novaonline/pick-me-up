import { LocationService } from './../location-service/location.service';
import { ToastService } from './../toast-service/toast.service';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { } from '@types/googlemaps';
import { } from '@types/socket.io-client';
import { SocketClientType } from '../../models/socket-client/index';

@Injectable()
export class SocketConnectionService {

  // thing that should be refactored out
  private WEB_SOCKET_URL = "localhost:3000";

  private _roomName: string;
  private _socket: SocketIOClient.Socket;
  private clientType$: Subject<SocketClientType> = new Subject<SocketClientType>();
  private hostLocation$: Subject<google.maps.LatLng> = new Subject<google.maps.LatLng>();
  private duration$: Subject<google.maps.Duration> = new Subject<google.maps.Duration>();
  private disconnectedHost$: Subject<boolean> = new Subject<boolean>();
  private newUser$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private _toastService: ToastService,
  ) { }

  public connect(roomName: string): void {
    this._roomName = roomName;
    this._socket = io.connect(this.WEB_SOCKET_URL, { query: `room=${this._roomName}` });
  }
  public listen(): void {
    this.convertClientTypeSocketEventToObservable();
    this.convertConnectSocketEventToToastMessage();
    this.convertHostDisconnectToObservable();
    this.convertNewUserToastToObservable();
  }
  public listenAsHost(): void {
    this.convertDurationFromGuestToObservable();
  }
  public listenAsGuest(): void {
    this.convertGetHostLocationSocketEventToObservable();
  }
  public observeClientType(): Observable<SocketClientType> {
    return this.clientType$.asObservable();
  }
  public observeLocation(): Observable<google.maps.LatLng> {
    return this.hostLocation$.asObservable();
  }
  public observeDurationFromReceiver(): Observable<google.maps.Duration> {
    return this.duration$.asObservable();
  }
  public observeHostDisconnection(): Observable<boolean> {
    return this.disconnectedHost$.asObservable();
  }
  public observeNewUser(): Observable<boolean> {
    return this.newUser$.asObservable();
  }
  public sendLocation(latLng: google.maps.LatLng) {
    this._socket.emit('send-host-location', this._roomName, latLng);
  }
  public sendDuration(duration: google.maps.Duration) {
    this._socket.emit('send-duration-from-guest', this._roomName, duration);
  }
  private convertConnectSocketEventToToastMessage(): void {
    this._socket.on('connect', () => {
      this._socket.emit('send-new-user-toast', this._roomName);
    });
  }
  private convertNewUserToastToObservable(): void {
    this._socket.on('receive-new-user-toast', () => {
      this.newUser$.next(true);
    })
  }
  private convertClientTypeSocketEventToObservable(): void {
    this._socket.on('receive-client-type', (type) => {
      switch (type) {
        case 'HOST':
          this.clientType$.next(SocketClientType.HOST);
          this._toastService.info(`You are the host`);
          break;
        case 'GUEST':
          this.clientType$.next(SocketClientType.GUEST);
          this._toastService.info("You are the guest");
          break;
        case 'OVERFLOW':
          this.clientType$.next(SocketClientType.OVERFLOW);
          this._toastService.info(`This room is full`);
          break;
        default:
          this.clientType$.next(SocketClientType.OVERFLOW);
          this._toastService.info(`This room is full`);
          break;
      }
    });
  }
  private convertGetHostLocationSocketEventToObservable(): void {
    this._socket.on('receive-host-location', (latLng: google.maps.LatLng) => {
      this.hostLocation$.next(latLng);
    });
  }
  private convertDurationFromGuestToObservable(): void {
    this._socket.on('receive-duration-from-guest', (duration) => {
      this.duration$.next(duration);
    })
  }
  private convertHostDisconnectToObservable(): void {
    this._socket.on('host-disconnected', () => {
      this.disconnectedHost$.next();
    })
  }
}
