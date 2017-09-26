import { EtaService } from './../../services/eta-service/eta.service';
import { LocationService } from './../../services/location-service/location.service';
import { SocketConnectionService } from './../../services/socket-connection-service/socket-connection.service';
import { ToastService } from './../../services/toast-service/toast.service';
import { Component, OnInit } from '@angular/core';
import { SocketClientType } from '../../models/socket-client/index';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  providers: [SocketConnectionService, LocationService, EtaService]
})
export class DemoComponent implements OnInit {

  constructor(
    private _toastService: ToastService,
    private _socketConnectionService: SocketConnectionService,
    private _locationService: LocationService,
    private _etaService: EtaService
  ) { }

  ngOnInit() {
    this._socketConnectionService.connectAndListen("test");
    this._socketConnectionService.observeClientType().subscribe(clientType => {
      if (clientType === SocketClientType.SENDER) {
        this._socketConnectionService.fetchDurationFromReceiver();
        this._locationService.observeCurrentLocation().subscribe(currentLocation => {
          console.log(currentLocation);
          this._socketConnectionService.sendLocation(currentLocation);
        });
        this._socketConnectionService.observeDurationFromReceiver().subscribe(duration => {
          console.log(duration);
        });
      } else {
        this._etaService.observeDirections().subscribe(direction => {
          console.log(direction.duration);
          this._socketConnectionService.sendDuration(direction.duration);
        });
        // send back to host
      }
    });
  }

  info() {
    this._toastService.info(`This is an info test`);
  }
  warn() {
    this._toastService.warn(`This is a warning test`);
  }
  error() {
    this._toastService.error(`This is a error test`);
  }
}
