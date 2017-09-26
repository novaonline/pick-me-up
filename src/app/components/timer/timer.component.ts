import { Subject, Observable } from 'rxjs';
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
  constructor(
    private _toastService: ToastService,
    private _socketConnectionService: SocketConnectionService,
    private _locationService: LocationService,
    private _etaService: EtaService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.room = this.route.paramMap
      .switchMap((params: ParamMap) => {
        return params.get("id");
      });
    let self = this;
    // this.room.subscribe(r => {
    this._socketConnectionService.connectAndListen(this.route.snapshot.paramMap.get('id'));
    this._socketConnectionService.observeClientType().subscribe(clientType => {
      if (clientType === SocketClientType.SENDER) {
        this._socketConnectionService.fetchDurationFromReceiver();
        this._locationService.observeCurrentLocation().subscribe(currentLocation => {
          console.log(currentLocation);
          this._socketConnectionService.sendLocation(currentLocation);
        });
        this._socketConnectionService.observeDurationFromReceiver().subscribe(duration => {
          console.log(duration);
          self.time = duration.text;
        });
      } else {
        this._etaService.observeDirections().subscribe(direction => {
          console.log(direction.duration);
          self.time = direction.duration.text;
          this._socketConnectionService.sendDuration(direction.duration);
        });
      }
    });
    //})

  }

}
