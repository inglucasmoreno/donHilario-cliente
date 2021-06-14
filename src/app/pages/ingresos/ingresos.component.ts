import { Component, OnInit } from '@angular/core';

import { IngresosService } from 'src/app/services/ingresos.service';
import { Ingreso } from '../../models/ingreso.model';
import { AlertService } from '../../services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styles: [
  ]
})
export class IngresosComponent implements OnInit {

  public total = 0;
  public ingresos: any[] = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    activo: 'true'
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }
  constructor(private ingresosService: IngresosService,
              private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos';
    this.alertService.loading();
    this.listarIngresos();
  }

  // Generar reporte de ingresos
  generarReporte(){}

  // Listar ingresos
  listarIngresos(): void {
    this.ingresosService.listarIngresos(
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna,
      this.filtro.activo
    ).subscribe( ({ ingresos, total }) => {
      this.ingresos = ingresos;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);  
    });
  }

  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;    
  }

  // Filtro por estado
   filtrarActivos(activo: string): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarIngresos();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarIngresos();
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.alertService.loading();  
    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.total){
        this.paginacion.desde += this.paginacion.limit;
        this.paginacion.hasta += this.paginacion.limit;
      }
    }else{                         // Decrementar
      this.paginacion.desde -= this.paginacion.limit;
      if (this.paginacion.desde < 0){
        this.paginacion.desde = 0;
      }else{
        this.paginacion.hasta -= this.paginacion.limit;
      }
    }
  
    this.listarIngresos();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarIngresos();
  }

  // ngOnInit(): void {
  //   document.getElementById("codigo").focus();
  // }

  // public nuevoProducto(codigo: any): void {
  //   if(codigo.keyCode == 13){ // Enter
  //     console.log(codigo);
  //     codigo.target.value = '';  
  //     document.getElementById("codigo").focus();
  //   }
  // }

  // public mantenerFocus(): void {
  //   console.log('Se mantiene focus');
  //   document.getElementById("codigo").focus();
  // }

}
