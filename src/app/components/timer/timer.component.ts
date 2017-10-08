import { TimeSpanHelper } from './../../helpers/time-span-helper';
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
  isHost: boolean = false;
  time: string;
  room: Observable<string>;
  subscriptions: Array<Subscription>;
  intervalObject: any;
  timeValue: any;
  waitText: string = "Waiting for required information..."; // would be nice to should what the app is waiting for

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
    this._socketConnectionService.connect(this.route.snapshot.paramMap.get('room'));
    this._socketConnectionService.listen();
    this._socketConnectionService.observeHostDisconnection().subscribe(isTrue => {
      this.reset();
      this._toastService.warn("The host has left.");
    });
    this._socketConnectionService.observeNewUser().subscribe(isTrue => {
      this._toastService.info("A new user has entered");
    });
    this._socketConnectionService.observeClientType().subscribe(clientType => {
      if (clientType === SocketClientType.HOST) {
        this.isHost = true;
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
            this.timeValue = duration.value;
            this.intervalObject = setInterval(() => {
              if (this.timeValue - 1 > 0) {
                this.timeValue -= 1;
                this.time = TimeSpanHelper.convertDurationToString(this.timeValue);
              } else {
                // done!
                clearTimeout(this.intervalObject);
              }
            }, 1000);
          })
        );
      } else if (clientType === SocketClientType.GUEST) {
        this.isHost = false;
        this._socketConnectionService.listenAsGuest();
        this.subscriptions.push(
          this._etaService.observeDirections().subscribe(direction => {
            console.log(direction.duration);
            this.timeValue = direction.duration.value;
            this.intervalObject = setInterval(() => {
              if (this.timeValue - 1 > 0) {
                this.timeValue -= 1;
                this.time = TimeSpanHelper.convertDurationToString(this.timeValue);
              } else {
                // done!
                clearTimeout(this.intervalObject);
              }
            }, 1000);
            this._socketConnectionService.sendDuration(direction.duration);
          })
        );
      }
      else {
        // dont listen to anything.
      }
    });
  }

  reset(): void {
    // Best way to do this is to listen to the desctruction lifecycle, unsubscribe
    // and disconnect
    this.isHost = false;
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
    this.subscriptions = []; // reset
    this._socketConnectionService.forceDisconnect();
  }
}
