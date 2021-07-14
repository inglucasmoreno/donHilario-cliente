import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { UnidadMedidaService } from 'src/app/services/unidad-medida.service';
import { Producto } from '../../../models/producto.model';
import { AlertService } from '../../../services/alert.service';
import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styles: [
  ]
})
export class EditarProductoComponent implements OnInit {

  // Variables de producto
  public unidades = [];
  private porcentajeVenta = environment.porcentajeVenta;
  public precio_venta = 0;
  public productoId = '';
  public stockMinimo = true;
  public digitos = 30;            // Maxima longitud de digitos para producto normal
  public digitosBalanza = 7;      // Maxima longitud de digitos para producto de balanza
  public tipo = 'Normal';         // Tipo: Normal o Balanza 
  public producto: any = {   // Objeto: producto
    _id: '',
    codigo: '',
    tipo: 'Normal',
    descripcion: '',
    unidad_medida: '',
    cantidad: 0,
    stock_minimo: false,
    cantidad_minima: 0,
    precio_costo: 0,
    activo: true  
  };

  
  // Formulario Reactivo
  public productoForm = this.fb.group({
    codigo: ['', Validators.required],
    tipo: ['Normal', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    precio_costo: [0, Validators.required],
    activo: [true, Validators.required]
  });

  constructor(private activatedRoute: ActivatedRoute,
              private unidadMedidaService: UnidadMedidaService,
              private alertService: AlertService,
              private dataService: DataService,
              private fb: FormBuilder,
              private productosService: ProductosService,
              private router: Router) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Productos - Editando';
    this.alertService.loading();
    this.activatedRoute.params.subscribe( async ({ id }) => {
      this.productoId = id;
      this.obtenerUnidades();
    })
  }

  // Actualizar precio de venta
  actualizarPrecioVenta(): void {
    let precio_venta_tmp = 0;   
    this.productoForm.value.precio_venta === null ? precio_venta_tmp = 0 : precio_venta_tmp = this.productoForm.value.precio_costo * (this.porcentajeVenta/100 + 1);
    this.precio_venta = Number(precio_venta_tmp.toFixed(2));
  }

  // Cambio de tipo de productos
  cambioTipo(tipo): void {
    this.digitos = tipo === 'Balanza' ? this.digitosBalanza : 30;
    this.tipo = tipo;
  }

  // Editando producto
  editarProducto(): void {

    const {codigo, descripcion, stock_minimo, cantidad_minima, precio_costo} = this.productoForm.value;   
    
    const cantidadMinimaValida = stock_minimo && Number(cantidad_minima) < 0;

    if(cantidadMinimaValida){
      this.alertService.formularioInvalido();
      return;         
    }

    const formularioValido = this.productoForm.valid && 
                             codigo.trim() !== '' && 
                             descripcion.trim() !== '' && 
                             Number(precio_costo) >= 0 

    if(formularioValido){ 
        this.alertService.loading();
        const data = this.productoForm.value;
        data.precio = this.precio_venta;
        if(!this.stockMinimo) data.cantidad_minima = 0;
        this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
          this.alertService.success('Producto actualizado correctamente');
          this.dataService.detectarStockMinimo();
          this.alertService.close();
          this.router.navigateByUrl(`/dashboard/productos`);
        },({error}) =>{
          this.alertService.errorApi(error.msg);
        });
    }else{
      this.alertService.formularioInvalido();
    }
  }

  // Obtener unidades
  obtenerUnidades(): void {
    this.unidadMedidaService.listarUnidades().subscribe( ({ unidades }) => {
      this.unidades= unidades;
      this.obtenerProducto(this.productoId);
    },({error}) => {
      this.alertService.errorApi(error.msg);
    }); 
  }

  // Obtener datos de producto por ID
  obtenerProducto(id: string): void {
    this.productosService.getProducto(id).subscribe(({producto})=>{
      this.producto = producto;
      this.stockMinimo = producto.stock_minimo;
      this.precio_venta = producto.precio;
      this.cambioTipo(producto.tipo);
      this.productoForm.setValue({
        codigo: producto.codigo,
        tipo: producto.tipo,
        descripcion: producto.descripcion,
        unidad_medida: producto.unidad_medida._id,
        stock_minimo: producto.stock_minimo,
        cantidad_minima: producto.cantidad_minima,
        precio_costo: producto.precio_costo,
        activo: producto.activo        
      });
      this.alertService.close(); 
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

}
