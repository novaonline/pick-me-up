import { Subject, Observable } from 'rxjs';
import { SocketConnectionService } from './../socket-connection-service/socket-connection.service';
import { ToastService } from './../toast-service/toast.service';
import { Injectable } from '@angular/core';
import { } from '@types/googlemaps';

@Injectable()
export class LocationService {

  private currentLocation$ = new Subject<google.maps.LatLng>();
  private intervalTime = 10000;
  private takeBreak = false;
  constructor(
    private _toastService: ToastService,
  ) {
  }

  public observeCurrentLocation(): Observable<google.maps.LatLng> {
    this.getCurrentLocation(<PositionOptions>{ timeout: 10000, maximumAge: 10000 });
    return this.currentLocation$.asObservable();
  }
  public quicklyGetCurrentLocation(): Observable<google.maps.LatLng> {
    this.getCurrentLocation(<PositionOptions>{ timeout: 1000, maximumAge: 10000 }, true);
    return this.currentLocation$.asObservable();
  }

  private isAvailable(): boolean {
    if ("geolocation" in navigator) {
      return true;
    } else {
      /* geolocation IS NOT available */
      this._toastService.warn('Geo Location is not available');
      return false;
    }
  }

  private getCurrentLocation(options: PositionOptions, isQuick: boolean = false): void {
    if (this.isAvailable()) {
      if (isQuick) {
        window.navigator.geolocation.getCurrentPosition(this.triggerNewPosition, this.fail, options);
      } else {
        window.navigator.geolocation.watchPosition((p) => this.watchForNewPosition(p, this), this.fail, options);
      }
    }
  }

  triggerNewPosition(position: Position): void {
    let c = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    this.currentLocation$.next(c);
  }
  watchForNewPosition(position: Position, self: any): void {
    if (!self.takeBreak) {
      self.triggerNewPosition(position);
      self.takeBreak = true;
      setTimeout(() => self.takeBreak = false, self.intervalTime);
    }
  }

  fail(error: PositionError): void {
    this._toastService.error(`Unable to fetch location: ERROR(${error.code}): ${error.message}`);
    // add a try again butto
  }
}
