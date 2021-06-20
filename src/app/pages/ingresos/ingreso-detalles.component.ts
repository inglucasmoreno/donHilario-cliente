import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';
import { IngresosService } from '../../services/ingresos.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { AlertService } from '../../services/alert.service';

import { Ingreso } from 'src/app/models/ingreso.model';
import { Proveedor } from 'src/app/models/proveedor.model';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {
  
  // Ingreso
  public idIngreso: string;
  public ingreso: Ingreso;

  // Modal
  public showModal = false;
  public proveedorSeleccionado;

  // Proveedores
  public proveedores: Proveedor[];

  constructor(private dataService: DataService,
              private ingresosService: IngresosService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private proveedoresService: ProveedoresService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos - Detalles';
    this.alertService.loading();
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.idIngreso = id;
      this.obtenerIngreso();
    })
  }

  // Ingreso por ID
  obtenerIngreso(){
    this.ingresosService.getIngreso(this.idIngreso).subscribe( ({ ingreso }) => {
      this.ingreso = ingreso;
      this.proveedorSeleccionado = ingreso.proveedor._id;
      this.obtenerProveedores();
    },({error})=> [
      this.alertService.errorApi(error.msg)
    ]);
  }
  
  // Obtener proveedores
  obtenerProveedores(){
    this.proveedoresService.listarProveedores().subscribe(({proveedores})=>{
      this.proveedores = proveedores;
      this.alertService.close();
    })
  }

  // Editar ingreso
  editarIngreso(){
    const data = { proveedor: this.proveedorSeleccionado }
    this.ingresosService.actualizarIngreso(this.idIngreso, data).subscribe(()=> {
      this.alertService.loading();
      this.showModal = false;
      this.obtenerIngreso();     
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  

}
