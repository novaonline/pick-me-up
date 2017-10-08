import { ToastMessage, ToastType } from './../../models/toast-message/index';
import { ToastService } from './../../services/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-toast',
  templateUrl: './simple-toast.component.html',
  styleUrls: ['./simple-toast.component.css'],
  providers: [],
})
export class SimpleToastComponent implements OnInit {

  public toastMessages: ToastMessage[];
  public isVisible: boolean = false;
  private removeDelayMs = 400;
  constructor(private _toastService: ToastService) {
    this.toastMessages = [];
  }

  ngOnInit(): void {
    this._toastService.getObservable().subscribe((toastMessage: ToastMessage) => {
      if (toastMessage === undefined) {
        this.toastMessages = [];
        return;
      }
      this.showToast(toastMessage); // add it for x duration then remove it
    })
  }

  /**
   * add the toast message for x duration (depending on the type) then remove it
   *
   * @param {ToastMessage} toastMessage
   * @memberof SimpleToastComponent
   */
  showToast(toastMessage: ToastMessage): void {
    this.isVisible = true;
    this.toastMessages.push(toastMessage);
    let self = this;
    toastMessage.timeoutId = setTimeout(() => self.removeToast(toastMessage), toastMessage.msDuration);
  }

  /**
   * removing the toast from the message stack
   *
   * @param {ToastMessage} toastMessage
   * @memberof SimpleToastComponent
   */
  removeToast(toastMessage: ToastMessage): void {
    this.isVisible = false;
    setTimeout(() => { this.toastMessages = this.toastMessages.filter(t => t !== toastMessage) }, this.removeDelayMs);
  }

  /**
   * keep the toast message visible until another event says otherwise
   *
   * @param {ToastMessage} toastMessage
   * @memberof SimpleToastComponent
   */
  keepToastMessage(toastMessage: ToastMessage): void {
    let self = this;
    clearTimeout(toastMessage.timeoutId);
  }

  /**
   * add the timeout back so that it will eventually disappear
   *
   * @param {ToastMessage} toastMessage
   * @memberof SimpleToastComponent
   */
  resetTimeoutForToastMessage(toastMessage: ToastMessage): void {
    let self = this;
    toastMessage.timeoutId = setTimeout(() => self.removeToast(toastMessage), toastMessage.msDuration);
  }

  /**
   * looks at the toast message type and determines which class name it should return
   *
   * @param {ToastMessage} toastMessage
   * @returns {string}
   * @memberof SimpleToastComponent
   */
  typeToCssClass(toastMessage: ToastMessage): string {
    if (toastMessage === undefined) {
      return;
    }
    switch (toastMessage.type) {
      case ToastType.Info:
        return "info";
      case ToastType.Warning:
        return "warning";
      case ToastType.Error:
        return "error";
      default:
        return;
    }
  }

}
