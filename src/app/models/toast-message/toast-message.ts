import { ToastType } from './toast-type.enum';
export class ToastMessage {
  message: string;
  type: ToastType;
  msDuration: number;
  timeoutId: any;
}
