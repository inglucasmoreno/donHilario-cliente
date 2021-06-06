import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { UnidadMedidaService } from 'src/app/services/unidad-medida.service';
import { Producto } from '../../../models/producto.model';
import { AlertService } from '../../../services/alert.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styles: [
  ]
})
export class EditarProductoComponent implements OnInit {

  public unidades = [];
  public productoId = '';
  public stockMinimo = true;
  public producto: Producto = {
    _id: '',
    codigo: '',
    descripcion: '',
    unidad_medida: '',
    cantidad: 0,
    stock_minimo: false,
    cantidad_minima: 0,
    precio: 0,
    activo: true  
  };

  public productoForm = this.fb.group({
    codigo: ['', Validators.required],
    descripcion: ['', Validators.required],
    unidad_medida: ['', Validators.required],
    stock_minimo: [false, Validators.required],
    cantidad_minima: [0, Validators.required],
    precio: [0, Validators.required],
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

  // Editando producto
  editarProducto(): void {

    const {codigo, descripcion, stock_minimo, cantidad_minima, precio} = this.productoForm.value;   
    
    const cantidadMinimaValida = stock_minimo && Number(cantidad_minima) < 0;

    if(cantidadMinimaValida){
      this.alertService.formularioInvalido();
      return;         
    }

    const formularioValido = this.productoForm.valid && 
                             codigo.trim() !== '' && 
                             descripcion.trim() !== '' && 
                             Number(precio) >= 0 

    if(formularioValido){ 
        this.alertService.loading();
        const data = this.productoForm.value;
        if(!this.stockMinimo) data.cantidad_minima = 0;
        this.productosService.actualizarProducto(this.producto._id, data).subscribe(()=>{
          this.alertService.success('Producto actualizado correctamente');
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
    this.unidadMedidaService.listarUnidades(0, 0, true).subscribe( ({ unidades }) => {
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
      this.productoForm.setValue({
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        unidad_medida: producto.unidad_medida,
        stock_minimo: producto.stock_minimo,
        cantidad_minima: producto.cantidad_minima,
        precio: producto.precio,
        activo: producto.activo        
      });
      this.alertService.close(); 
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

}
