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
    this.activate();
    return this.currentLocation$.asObservable();
  }

  private activate(): void {
    this.getCurrentLocation();
  }

  private getCurrentLocation(): void {
    let self = this;
    if ("geolocation" in navigator) {
      /* geolocation is available */
    } else {
      /* geolocation IS NOT available */
      this._toastService.warn('Geo Location is not available');
      return;
    }
    window.navigator.geolocation.watchPosition((position) => {
      var coords = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      if (!self.takeBreak) {
        self.currentLocation$.next(coords);
        self.takeBreak = true;
        setTimeout(() => {
          self.takeBreak = false;
        }, self.intervalTime);
      }
    }, (position) => {
      self._toastService.error('Unable to fetch location');
      // add a try again button
    }, { timeout: 10000, maximumAge: 10000})
  }
}
