import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reportes-cantidades-desechos',
  templateUrl: './reportes-cantidades-desechos.component.html',
  styles: [
  ]
})
export class ReportesCantidadesDesechosComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Reportes - Cantidades vs Desechos";
  }

}
