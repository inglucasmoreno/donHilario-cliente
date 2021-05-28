import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { saveAs } from 'file-saver-es'; 

import { UsuariosService } from '../../services/usuarios.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from 'src/app/services/data.service';

import { Usuario } from '../../models/usuario.model';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  // Usuarios Listados
  public usuarios: Usuario[];
  public total = 0;

  // Paginacion
  public paginacion = { 
    limit: 10,
    desde: 0,
    hasta: 10
  };

  // Filtrado
  public filtro = {
    activo: true,
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'apellido'
  }

  public loading = true;

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios' 
    this.alertService.loading();
    this.listarUsuarios(); 
  }

  // Generar reporte de usuarios
  generarReporte(): void {
    this.alertService.question({msg: "Se esta por generar un reporte", buttonText: 'Generar'})
      .then(({isConfirmed}) => {
        if (isConfirmed) this.alertService.loading('Generando reporte');
      })
  }

  // Listar usuarios
  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(
      this.paginacion.limit, 
      this.paginacion.desde, 
      this.filtro.activo, 
      this.filtro.parametro,
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( resp => {
      const { usuarios, total } = resp;
      this.usuarios = usuarios;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.msg);
    }));
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(usuario: Usuario): void {
    const { uid, activo } = usuario;
      this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
          .then(({isConfirmed}) => {  
            if (isConfirmed) {
              this.alertService.loading();
              this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(() => {
                this.alertService.loading();
                this.listarUsuarios();
              }, ({error}) => {
                this.alertService.close();
                this.alertService.errorApi(error.msg);
              });
            }
          });
  }

  // Funcion de paginación
  actualizarDesdeHasta(selector): void {
    this.loading = true;

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
    this.alertService.loading();
    this.listarUsuarios();

  }
  
  // Reiniciar paginacion
  reiniciarPaginacion(): void {
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;
    this.paginacion.limit = 10;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtro.activo = activo;
    this.reiniciarPaginacion();
    this.alertService.loading();
    this.listarUsuarios();
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
    this.loading = true;
    this.filtro.parametro = parametro;
    this.reiniciarPaginacion();
    this.alertService.loading();
    this.listarUsuarios();
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.alertService.loading();
    this.listarUsuarios();
  }

}
