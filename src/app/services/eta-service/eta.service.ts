import { SocketConnectionService } from './../socket-connection-service/socket-connection.service';
import { LocationService } from './../location-service/location.service';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EtaService {

  private directions$ = new Subject<google.maps.DirectionsLeg>();
  private intervalTime = 10000;
  private takeBreak = false;

  constructor(
    private _socketConnectionService: SocketConnectionService,
    private _locationService: LocationService,
  ) { }

  public observeDirections(): Observable<google.maps.DirectionsLeg> {
    this.etaReceivedLocations();
    return this.directions$.asObservable();
  }

  private etaReceivedLocations(): void {
    let self = this;
    this._socketConnectionService.observeLocation().subscribe(senderLatLng => {
      self._locationService.observeCurrentLocation().subscribe(receiverLatLng => {
        if (!receiverLatLng) {
          return;
        }
        if (!self.takeBreak) {
          const request = <google.maps.DirectionsRequest>{
            origin: receiverLatLng,
            destination: senderLatLng,
            travelMode: google.maps.TravelMode.DRIVING
          };
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(request, result => {
            self.directions$.next(result.routes[0].legs[0]);
          });
          self.takeBreak = true;
          setTimeout(() => {
            self.takeBreak = false;
          }, self.intervalTime);
        }
      });
    })
  }

}
