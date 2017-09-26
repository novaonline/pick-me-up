import { Subject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SocketConnectionService, LocationService, EtaService, ToastService } from '../../services/index';
import { SocketClientType } from '../../models/socket-client/index';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  providers: [SocketConnectionService, LocationService, EtaService]

})
export class TimerComponent implements OnInit {
  time: string;
  room: Observable<string>;
  subscriptions: Array<Subscription>;
  constructor(
    private _toastService: ToastService,
    private _socketConnectionService: SocketConnectionService,
    private _locationService: LocationService,
    private _etaService: EtaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.subscriptions = [];
  }

  ngOnInit() {
    this.room = this.route.paramMap
      .switchMap((params: ParamMap) => {
        return params.get("room");
      });
    let self = this;
    this._socketConnectionService.connect(this.route.snapshot.paramMap.get('room'));
    this._socketConnectionService.listen();
    this._socketConnectionService.observeHostDisconnection().subscribe(isTrue => {
      this.subscriptions.forEach(element => {
        element.unsubscribe();
      });
      this.subscriptions = []; // reset
      this._toastService.warn("The host has left.");
    });
    this._socketConnectionService.observeNewUser().subscribe(isTrue => {
      this._toastService.info("A new user has entered");
    });
    this._socketConnectionService.observeClientType().subscribe(clientType => {
      if (clientType === SocketClientType.HOST) {
        this._socketConnectionService.listenAsHost();
        this.subscriptions.push(
          this._locationService.observeCurrentLocation().subscribe(currentLocation => {
            console.log(currentLocation);
            this._socketConnectionService.sendLocation(currentLocation);
          })
        );
        this.subscriptions.push(
          this._socketConnectionService.observeDurationFromReceiver().subscribe(duration => {
            console.log(duration);
            self.time = duration.text;
          })
        );
      } else if (clientType === SocketClientType.GUEST) {
        this._socketConnectionService.listenAsGuest();
        this.subscriptions.push(
          this._etaService.observeDirections().subscribe(direction => {
            console.log(direction.duration);
            self.time = direction.duration.text;
            this._socketConnectionService.sendDuration(direction.duration);
          })
        );
      }
      else {
        // dont listen to anything.
      }
    });
  }

}
