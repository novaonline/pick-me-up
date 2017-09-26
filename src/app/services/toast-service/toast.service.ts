import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastMessage, ToastType } from '../../models/toast-message';

@Injectable()
export class ToastService {

  private toast$ = new Subject<ToastMessage>();

  constructor() { }

  /**
   * Get the Observable to subscribe to its events
   *
   * @returns {Observable<ToastMessage>}
   * @memberof ToastServiceService
   */
  getObservable() : Observable<ToastMessage> {
    return this.toast$.asObservable();
  }

  /**
   * Displays an informational message
   *
   * @param {string} message
   * @memberof ToastServiceService
   */
  info(message: string) : void {
    this.toast(ToastType.Info, message, 3000);
  }

  /**
   * Displays a warning message
   *
   * @param {string} message
   * @memberof ToastServiceService
   */
  warn(message: string) : void {
    this.toast(ToastType.Warning, message, 3000);

  }

  /**
   * Displays an error message
   *
   * @param {string} message
   * @memberof ToastServiceService
   */
  error(message: string) : void {
    this.toast(ToastType.Error, message, 6000);

  }

  /**
   * helper method to send the next data into the observable
   *
   * @param {ToastType} type
   * @param {string} message
   * @memberof ToastServiceService
   */
  toast(type: ToastType, message: string, msDuration: number) {
    this.toast$.next(<ToastMessage>{type: type, message: message, msDuration: msDuration});
  }

  /**
   * triggers the next data in the observable to be nothing
   *
   * @memberof ToastServiceService
   */
  clear() : void {
    this.toast$.next();
  }

}
