import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {

  public showModal = false;

  constructor() { }

  ngOnInit(): void {}

  // Control de modal
  openModal(): void { this.showModal = true }
  closeModal(): void { this.showModal = false }


}
