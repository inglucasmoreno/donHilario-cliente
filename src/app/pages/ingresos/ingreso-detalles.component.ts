import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { IngresosService } from '../../services/ingresos.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { AlertService } from '../../services/alert.service';

import { Proveedor } from 'src/app/models/proveedor.model';

import { Ingreso } from 'src/app/models/ingreso.model';
import { IngresosProductosService } from '../../services/ingresos-productos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { MediaResService } from '../../services/media-res.service';

@Component({
  selector: 'app-ingreso-detalles',
  templateUrl: './ingreso-detalles.component.html',
  styles: [
  ]
})
export class IngresoDetallesComponent implements OnInit {
  
  public showActualizar = false;

  // Data
  public data = {
    ingreso: '',
    codigo: '',
    cantidad: 0
  };

  // Media res
  public cantidadMediaRes = 1;
  public mediaRes: any[] = [];

  // Actualizacion de precio
  public nuevoPrecio = null;
  public nuevoPorcentaje = 40;

  // Ingreso
  public idIngreso: string;
  public ingreso: Ingreso;
  
  // Producto
  public productoSeleccionado: any;
  public productos: any[];
  public nuevoStock = 0;

  // Modal
  public showModal = false;
  public showModalIngresar = false;
  public showModalRes = false;
  public showModalResEditar = false;
  public showDetalles = false;
  public showDetallesActualizar = false;
  
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
  direccion: 1,  // Asc (1) | Desc (-1)
  columna: 'producto.descripcion'
}


  constructor(private dataService: DataService,
              private router: Router,
              private ingresosService: IngresosService,
              private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private mediaResService: MediaResService,
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

  // Actualizar precio de producto
  actualizarPrecio(): void {
    
    let precio_venta_tmp = 0;

    if(this.nuevoPrecio < 0 || this.nuevoPrecio === null || this.nuevoPorcentaje <= 0 || this.nuevoPorcentaje == null){
      this.alertService.info('Formulario inválido');
      return;
    }    
    
    if(this.productoSeleccionado.tipo === 'Normal') precio_venta_tmp = this.nuevoPrecio * (this.nuevoPorcentaje/100 + 1);
    else precio_venta_tmp = this.nuevoPrecio;
    
    const data: any = { 
      precio_costo: this.nuevoPrecio,
      precio: Number(precio_venta_tmp.toFixed(2)),
      porcentaje_ganancia: this.nuevoPorcentaje
    };  
    
    this.productosService.actualizarProducto(this.productoSeleccionado._id, data).subscribe(()=>{
      const codigo = { value: this.productoSeleccionado.codigo };
      this.modalNuevoProducto(codigo);
      this.alertService.success('Precio actualizado');
      this.nuevoPrecio = null;
    },({error})=>{
      this.alertService.errorApi(error);
      this.nuevoPrecio = null;
    });

  }

  // Calculo de nuevo stock
  calculoNuevoStock(): void{
    this.nuevoStock = this.productoSeleccionado.cantidad + this.data.cantidad;
  }

  // Modal: Ingresar producto
  modalNuevoProducto(codigo: any){
    
    this.data.cantidad = 0;
    this.nuevoPrecio = null;

    // Si no se escribe codigo, no hacer nada
    if(codigo.value.trim() === '') return;
    
    // Se busca el producto
    this.productosService.productoPorCodigo(codigo.value).subscribe( async ({ producto }) => {
      
      this.data.codigo = codigo.value;

      // Se muestra detalle y pregunta cantidad
      this.productoSeleccionado = producto;
      this.nuevoPorcentaje = producto.porcentaje_ganancia;
      this.showModalIngresar = true;
      
      this.showActualizar = false;
      codigo.value = '';

      this.calculoNuevoStock();

    },({error}) => {
      codigo.value = '';
      this.showActualizar = false;
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
      this.nuevoPrecio = null;
      this.showActualizar = false;
    },({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.msg);
      this.showActualizar = false;
    });   

    this.data.cantidad = 0;
    
  }

  // Nueva media res
  nuevaMediaRes(){
    
    // Se verifica si la cantidad es valida
    if(this.cantidadMediaRes <= 0 || this.cantidadMediaRes === null){
      this.alertService.info('Cantidad inválida');
      return;
    }

    this.alertService.loading();
    this.ingresosProductosService.nuevaMediaRes({ idIngreso: this.idIngreso, cantidad: this.cantidadMediaRes }).subscribe(resp => {
      this.obtenerProductos();
      this.cantidadMediaRes = 1;
      this.showModalRes = false;
      this.alertService.close();
    },({error}) => {
      this.alertService.errorApi(error.msg);
    });
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

  // Editando valores del array mediaRes
  editarValorMediaRes(id: string, cantidad: string){
    const resultado: any = this.mediaRes.find(elemento => {
      return elemento.id_producto === id;
    }); 
    resultado.cantidad = Number(cantidad);
  }
  
  // Actualizar valores de media res
  actualizarMediaRes(){
    for(let producto of this.mediaRes){
      if(producto.cantidad <= 0 || producto.cantidad === null) return this.alertService.info('Hay cantidades inválidas');
    } 
    this.alertService.loading();
    this.mediaResService.actualizarMediaRes(this.mediaRes).subscribe(()=>{
      this.modalMediaRes();
    },({error})=>{
      this.alertService.errorApi(error);
    });
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
          this.dataService.detectarStockMinimo();
          this.alertService.close();
          this.router.navigateByUrl('/dashboard/ingresos');  
        },({error})=>{
          this.alertService.errorApi(error.msg);
        });    
      }
   }) 

  }

  modaMediaResEditar(): void {
    this.showDetallesActualizar = false;
    this.showModalRes = false;
    this.showModalResEditar = true;  
  }

  // Listar productos de media res
  listarMediaRes(): void {
    this.alertService.loading();
    this.mediaResService.listarMediaRes().subscribe(({ productos }) => {
      this.mediaRes = productos;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    })
  }

  // Abrir modal media res
  modalMediaRes(): void {
    this.listarMediaRes();
    this.cantidadMediaRes = 1;
    this.showModalResEditar = false;
    this.showDetalles = false;
    this.showModalRes = true;
  }

  // Filtrado por parametro
  filtroParametro(parametro: string){
    this.paginaActual = 1;
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
