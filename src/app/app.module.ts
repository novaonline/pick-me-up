import { RouterModule, Route } from '@angular/router';
import { ToastService } from './services/index';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';
import { AppComponent } from './app.component';
import { SimpleToastComponent } from './components/simple-toast/simple-toast.component';
import { TimerComponent } from './components/timer/timer.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponent } from './components/share/share.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleToastComponent,
    TimerComponent,
    HomeComponent,
    ShareComponent,
    ErrorComponent,
  ],
  imports: [
    MatButtonModule, MatInputModule, MatCardModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        // TODO: need to find a way to make sure :room is only alphanumeric
        <Route>{ path: "", component: HomeComponent },
        <Route>{ path: ":room", component: TimerComponent },
        <Route>{ path: "**", component: ErrorComponent }
      ]
    )
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
