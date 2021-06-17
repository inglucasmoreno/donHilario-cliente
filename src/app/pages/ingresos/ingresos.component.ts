import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { IngresosService } from 'src/app/services/ingresos.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styles: [
  ]
})
export class IngresosComponent implements OnInit {

  public showModal = false;

  public total = 0;
  public ingresos: any[] = [];

  public proveedor: string = '';
  public proveedores: any = [];

  // Paginación
  public paginacion = {
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    codigo: '',
    descripcion: '',
    activo: 'true'
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(private ingresosService: IngresosService,
              private proveedoresService: ProveedoresService,
              private dataService: DataService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos';
    this.alertService.loading();
    this.listarIngresos();
    this.listarProveedores();
  }

  // Generar reporte de ingresos
  generarReporte(){}

  // Listar proveedores
  listarProveedores(): void {
    this.proveedoresService.listarProveedores(0,0, true).subscribe(({proveedores}) => {
      this.proveedores = proveedores;
      this.proveedor = proveedores[0]._id;
    });
  }

  // Listar ingresos
  listarIngresos(): void {
    this.ingresosService.listarIngresos(
      this.paginacion.hasta,
      this.paginacion.desde,
      this.filtro.codigo,
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

  // Crear nuevo ingreso
  nuevoIngreso(): void {
    this.showModal = false
    this.alertService.loading();
    const data = { proveedor: this.proveedor };
    this.ingresosService.nuevoIngreso(data).subscribe(({ ingreso }) => {
      this.alertService.close();
      this.router.navigateByUrl(`dashboard/ingresos/detalles/${ingreso._id}`);
    },(({error}) => {
      this.alertService.errorApi(error.msg);
    })); 
  }

  // Reiniciar paginacion
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;    
  }

  // Filtro por activo
   filtrarActivos(activo: string): void{
    this.alertService.loading();
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.listarIngresos();
  }

   // Filtrar por codigo
   filtrarCodigo(codigo: string): void{
    this.alertService.loading();
    this.filtro.codigo = codigo;
    this.reiniciarPaginacion();
    this.listarIngresos();
  }

  // Filtrar por proveedor
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
