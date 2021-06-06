import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { Proveedor } from '../../models/proveedor.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styles: [
  ]
})
export class ProveedoresComponent implements OnInit {

  public total = 0;
  public proveedores: Proveedor[] = [];

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
    columna: 'razon_social'
  }

  constructor(private proveedoresService: ProveedoresService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Proveedores';
    this.listarProveedores();
  }

  // Generar reporte de usuarios
  generarReporte(): void {}

  // Listar Proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores(
      this.paginacion.limit,
      this.paginacion.desde,
      this.filtro.activo,
      this.filtro.descripcion,
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({proveedores, total}) => {
      this.proveedores = proveedores;
      this.total = total;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado
  actualizarEstado(proveedor: Proveedor): void {
    this.alertService.question({ msg: 'Se esta por actualizar un estado', buttonText: 'Actualizar' })
                     .then(({isConfirmed}) => {
                        if (isConfirmed) {
                            this.alertService.loading();
                            this.proveedoresService.actualizarProveedor(proveedor._id, { activo: !proveedor.activo }).subscribe( () => {
                              this.listarProveedores();          
                            },(({ error }) => {
                              this.alertService.errorApi(error.msg);
                            }));
                        }
                     }) 
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
    this.listarProveedores();
  }

  // Filtrar por parametro
  filtrarDescripcion(descripcion: string): void{
    this.alertService.loading();
    this.filtro.descripcion= descripcion;
    this.reiniciarPaginacion();
    this.listarProveedores();
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
  
    this.listarProveedores();

  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarProveedores();
  }

}
