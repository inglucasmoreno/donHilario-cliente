import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-ventas-detalles',
  templateUrl: './ventas-detalles.component.html',
  styles: [
  ]
})
export class VentasDetallesComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Ventas - Detalle"
  }

}
