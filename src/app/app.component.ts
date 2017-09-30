import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import * as $script from 'scriptjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    $script(`https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}`)
  }
}
