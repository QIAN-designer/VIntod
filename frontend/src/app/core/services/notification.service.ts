import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<ToastNotification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();

  success(title: string, text?: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  error(title: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#007782'
    });
  }

  warning(title: string, text?: string) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#007782'
    });
  }

  info(title: string, text?: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      timer: 2500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  async confirm(title: string, text: string, confirmButtonText = 'Sí, continuar'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007782',
      cancelButtonColor: '#9ca3af',
      confirmButtonText,
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }
}

