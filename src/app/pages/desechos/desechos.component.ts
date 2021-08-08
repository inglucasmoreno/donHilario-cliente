import { Component, OnInit } from '@angular/core';
import { Desechos } from '../../models/desechos.model';
import { DataService } from 'src/app/services/data.service';
import { DesechosService } from 'src/app/services/desechos.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-desechos',
  templateUrl: './desechos.component.html',
  styles: [
  ]
})
export class DesechosComponent implements OnInit {

  public total = 0;
  public desechos: Desechos[] = [];

  // Paginación
  public paginaActual = 1;
  public cantidadItems = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(private alertService: AlertService,
              private desechosService: DesechosService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Desechos';
    this.listarDesechos();
  }

  // Listar Desechos
  listarDesechos(): void {
    this.desechosService.listarDesechos(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({desechos, total}) => {
      this.desechos = desechos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.filtro.activo = activo;
  }

  // Filtrar por parametro
  filtrarDescripcion(parametro: string): void{
    this.filtro.parametro= parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarDesechos();
  }

}
