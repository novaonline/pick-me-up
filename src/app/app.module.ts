import { RouterModule, Route } from '@angular/router';
import { ToastService } from './services/index';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SimpleToastComponent } from './components/simple-toast/simple-toast.component';
import { TimerComponent } from './components/timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleToastComponent,
    TimerComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([<Route>{ path: ":room", component: TimerComponent }])
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
