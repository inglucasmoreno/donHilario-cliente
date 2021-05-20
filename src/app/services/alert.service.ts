import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  
  // Alerta - Formulario inválido
  formularioInvalido(): void {
    Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Formulario Inválido',
        confirmButtonText: 'Entendido'
      });    
  }   

  // Alerta - Error desde servidor
  errorApi(msg: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      confirmButtonText: 'Entendido'
    });    
  }

  // Alerta - Cargando...
  loading(msg: string = 'Espere un momento'): void {
    Swal.fire({
      title: 'Cargando',
      text: msg,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });  
  }

  // Alerta - Cierra cualquier alerta
  close(): void { Swal.close(); }

}
