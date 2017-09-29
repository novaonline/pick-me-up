import { TimeSpanHelper } from './../../helpers/time-span-helper';
import { SocketConnectionService } from './../socket-connection-service/socket-connection.service';
import { LocationService } from './../location-service/location.service';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EtaService {

  private directions$ = new Subject<google.maps.DirectionsLeg>();
  private intervalTime = 10000;
  private needsABreak = false;
  private guestLatLng: google.maps.LatLng;

  constructor(
    private _socketConnectionService: SocketConnectionService,
    private _locationService: LocationService,
  ) { }

  public observeDirections(): Observable<google.maps.DirectionsLeg> {
    this.etaReceivedLocations();
    return this.directions$.asObservable();
  }

  private etaReceivedLocations(): void {
    this._locationService.observeCurrentLocation().subscribe(receiverLatLng => {
      if (!receiverLatLng) {
        return;
      }
      this.guestLatLng = receiverLatLng;
    });
    this._socketConnectionService.observeLocation().subscribe(senderLatLng => {

      if (!this.needsABreak && this.guestLatLng) {
        const request = <google.maps.DirectionsRequest>{
          origin: this.guestLatLng,
          destination: senderLatLng,
          travelMode: google.maps.TravelMode.DRIVING
        };
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(request, result => {
          //result.routes[0].legs[0].duration.text = TimeSpanHelper.convertDurationToString(result.routes[0].legs[0].duration.value)
          this.directions$.next(result.routes[0].legs[0]);
        });
        this.needsABreak = true;
        setTimeout(() => { this.needsABreak = false; }, this.intervalTime);
      }
    })
  }

}
