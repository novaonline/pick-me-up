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
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SimpleToastComponent,
    TimerComponent,
    HomeComponent,
  ],
  imports: [
    MatButtonModule, MatInputModule, MatCardModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        <Route>{ path: "", component: HomeComponent },
        <Route>{ path: ":room", component: TimerComponent }
      ]
    )
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
