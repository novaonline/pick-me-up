import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public roomName: string;

  public roomNameFormControl: FormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  onSubmit() {
    // [DONE] check if a room name has been entered
    // [] check if room name is available
    // [] if occupied, check if room needs guest
    // [] if room needs guest, present the option to join room as guest
    // [] if room is full, show that room is full and to try another room name
    // TODO: add room name suggestions if desired room is full
    if (this.roomNameFormControl.valid) {
      this.router.navigate([this.roomName]);
    }

  }

}
