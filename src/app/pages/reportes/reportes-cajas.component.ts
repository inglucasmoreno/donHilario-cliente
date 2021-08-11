import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reportes-cajas',
  templateUrl: './reportes-cajas.component.html',
  styles: [
  ]
})
export class ReportesCajasComponent implements OnInit {

  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Reportes - Cajas";
  }

}
