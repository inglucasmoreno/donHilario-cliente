import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';

import { UnidadMedida } from '../../models/unidad-medida.model';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styles: []
})
export class UnidadMedidaComponent implements OnInit {

  public total = 0;
  public unidades: UnidadMedida[] = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    descripcion: '',
    activo: true
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(private unidadMedidaService: UnidadMedidaService,
              private dataService: DataService,
              private alertService: AlertService
              ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Unidad de medida'
    this.alertService.loading();
    this.listarUnidades(); 
  }

  // Generar reporte de usuarios
  generarReporte(): void {}

  // Nueva unidad
  nuevaUnidad(descripcionCtrl: any): void {
    const descripcion = descripcionCtrl.value;
    if(descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    this.alertService.loading();
    descripcionCtrl.value = '';
    this.unidadMedidaService.nuevaUnidad({ descripcion }).subscribe( () => {  
      this.alertService.success('Unidad creada correctamente');
      this.alertService.close();
      this.listarUnidades();
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Listar unidades
  listarUnidades(): void {
    this.alertService.loading();
    this.unidadMedidaService.listarUnidades(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.activo,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe( ({ total, unidades }) => {
      this.total = total;
      this.unidades = unidades;
      this.alertService.close(); 
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Actualizar estado
  actualizarEstado(unidad: UnidadMedida): void {  
    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
                     .then(({isConfirmed}) => {
                        if(isConfirmed){
                          this.alertService.loading();
                          this.unidadMedidaService.actualizarUnidad(unidad._id, { activo: !unidad.activo }).subscribe( () => {
                            this.alertService.success('Estado actualizado');
                            this.listarUnidades();          
                          },(({ error }) => {
                            this.alertService.errorApi(error.msg);
                          }));                   
                       }    
                      }
    );     
  }
  
  // Reiniciar paginacion
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarUnidades();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarUnidades();
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
  
    this.listarUnidades();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarUnidades();
  }

}
