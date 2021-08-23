import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-productos',
  templateUrl: './reportes-productos.component.html',
  styles: [
  ]
})
export class ReportesProductosComponent implements OnInit {

  // Data
  public data = {
    fechaDesde: null,
    fechaHasta: null,
    tipo_filtro: 'Ingresos',
    mayoristaSeleccionado: ''
  }

  // Mayoristas
  public mayoristas: any[] = [];

  constructor() { }

  ngOnInit(): void {};

  buscar(): void {}

}
