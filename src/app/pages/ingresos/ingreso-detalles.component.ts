import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { IngresosService } from '../../services/ingresos.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { AlertService } from '../../services/alert.service';

import { Proveedor } from 'src/app/models/proveedor.model';
import { Producto } from 'src/app/models/producto.model';

import { Ingreso } from 'src/app/models/ingreso.model';
import { IngresosProductosService } from '../../services/ingresos-productos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {
  
  // Data
  public data = {
    ingreso: '',
    codigo: '',
    cantidad: 0
  };

  // Ingreso
  public idIngreso: string;
  public ingreso: Ingreso;
  
  // Producto
  public productoSeleccionado: Producto;
  public productos: any[];

  // Modal
  public showModal = false;
  public showModalIngresar = false;
  
  // Proveedores
  public proveedorSeleccionado;
  public proveedores: Proveedor[];
  
  // Paginacion
  public paginaActual = 1;
  public cantidadItems = 10;

  // Filtrado
  public parametro = '';

  // Ordenar
  public ordenar = {
  direccion: -1,  // Asc (1) | Desc (-1)
  columna: 'createdAt'
}


  constructor(private dataService: DataService,
              private router: Router,
              private ingresosService: IngresosService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private proveedoresService: ProveedoresService,
              private productosService: ProductosService,
              private ingresosProductosService: IngresosProductosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ingresos - Detalles';
    this.alertService.loading();
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.idIngreso = id;
      this.data.ingreso = id;
      this.obtenerProductos();
      this.obtenerIngreso();
    })
  }

  // Modal: Ingresar producto
  modalNuevoProducto(codigo: any){
    
    // Si no se escribe codigo, no hacer nada
    if(codigo.value.trim() === '') return;
    
    // Se busca el producto
    this.productosService.productoPorCodigo(codigo.value).subscribe( async ({ producto }) => {
      
      this.data.codigo = codigo.value;

      // Se muestra detalle y pregunta cantidad
      this.productoSeleccionado = producto;
      this.showModalIngresar = true;
      
      codigo.value = '';

    },({error}) => {
      codigo.value = '';
      this.alertService.errorApi(error.msg);
    });
  }

  // Ingresando producto
  nuevoProducto(){
    
    if(this.data.cantidad <= 0 || !this.data) return this.alertService.info('Cantidad inválida');

    this.alertService.loading();
    this.showModalIngresar = false;
    this.ingresosProductosService.nuevoProducto(this.data).subscribe( ({ producto }) => {
      this.obtenerProductos();
    },({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.msg);
    });   

    this.data.cantidad = 0;
    
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
  
  // Obtener productos
  obtenerProductos(){
    this.ingresosProductosService.productosPorIngreso(
        this.idIngreso,
        this.ordenar.direccion,
        this.ordenar.columna
      ).subscribe( ({productos}) => {
      this.productos = productos;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });  
  };

  // Obtener proveedores
  obtenerProveedores(){
    this.proveedoresService.listarProveedores().subscribe(({proveedores})=>{
      this.proveedores = proveedores;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg)
    });
  };

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

  // Eliminar producto
  eliminarProducto(id: string){
    this.alertService.loading();
    this.ingresosProductosService.eliminarProducto(id).subscribe(()=>{
      this.obtenerProductos();
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  };

  // Completar ingreso
  completarIngreso(){

    if(this.productos.length === 0){
      this.alertService.info('El ingreso debe tener al menos un producto');
      return;  
    }

    this.alertService.question({ msg: 'Se esta por completar el ingreso', buttonText: 'Completar' })
    .then(({isConfirmed}) => {
      if (isConfirmed) {
        this.alertService.loading();
        this.ingresosService.actualizarIngreso(this.idIngreso, {activo: false}).subscribe(() => {
          this.alertService.close();
          this.router.navigateByUrl('/dashboard/ingresos');  
        },({error})=>{
          this.alertService.errorApi(error.msg);
        });    
      }
   }) 

  }

  // Filtrado por parametro
  filtroParametro(parametro: string){
    this.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.alertService.loading();
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.obtenerProductos();
  }
  

}
