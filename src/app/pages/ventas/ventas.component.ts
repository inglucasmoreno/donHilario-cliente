import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { AlertService } from '../../services/alert.service';
import { VentasService } from '../../services/ventas.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: [
  ]
})
export class VentasComponent implements OnInit {

  constructor( private dataService: DataService,
               private productosService: ProductosService,
               private alertService: AlertService,
               private ventasService: VentasService) { }

  public productoVenta = { 
    descripcion: '',
    producto: '', 
    precio_unitario: 0, 
    precio_total: 0, 
    unidad_medida: '',
    cantidad: 0 
  };

  public showModal = false;
  public productoActual: Producto;
  public codigo: string = '';
  public cantidad: number;
  public productos: any[] = [];
  public precioTotal = 0;
  public vuelto = 0;

  ngOnInit(): void {
    document.getElementById('codigo').focus();
    this.dataService.ubicacionActual = 'Dashboard - Ventas';
  }

  // Se busca el producto a partir del codigo
  buscarProducto(): void {

    if(this.codigo.trim() === '') {
      document.getElementById('codigo').focus();
      return this.alertService.info('Formulario inválido')
    };

    this.productosService.productoPorCodigo(this.codigo).subscribe( ({ producto }) => {
      this.productoActual = producto;
      this.productoVenta.descripcion = producto.descripcion;
      this.productoVenta.unidad_medida = producto.unidad_medida.descripcion;
      this.productoVenta.producto = producto._id;
      this.productoVenta.precio_unitario = producto.precio;
      if(producto.tipo === 'Balanza') {
        this.productoVenta.cantidad = Number(this.codigo.slice(7,this.codigo.length - 1)) / 1000;
        this.productoVenta.precio_total = this.productoVenta.cantidad * producto.precio;
      }
      else {
        this.productoVenta.cantidad = 1;
        this.productoVenta.precio_total = producto.precio;
      }
      this.agregarProducto();
      this.codigo = '';
      document.getElementById('codigo').focus();
    },({error})=>{
      this.alertService.errorApi(error.msg);
      this.codigo = '';
      document.getElementById('codigo').focus();
    })
  }

  // Agregar producto
  agregarProducto(): void {

    let repetido = false;

    // Se verifica si el producto esta agregado
    this.productos.find(elemento => {
      if(elemento.producto === this.productoVenta.producto){
        elemento.cantidad += this.productoVenta.cantidad;
        elemento.precio_total = elemento.cantidad * elemento.precio_unitario;
        repetido = true;
        return;
      }
    });
    
    // Si el producto no esta repetido se agrega
    if(!repetido){
      this.productos.push({
        descripcion: this.productoVenta.descripcion,
        unidad_medida: this.productoVenta.unidad_medida,
        producto: this.productoVenta.producto, 
        precio_unitario: this.productoVenta.precio_unitario, 
        precio_total: this.productoVenta.precio_total, 
        cantidad: this.productoVenta.cantidad
      });
    }
  
    this.calculoPrecioTotal();

  }

  // Eliminar producto
  eliminarProducto(producto: any): void {
    this.alertService.question({msg:'¿Quieres eliminar el producto?', buttonText: 'Eliminar'})
                     .then((result)=>{
                        if(result.isConfirmed){
                          this.productos = this.productos.filter(elemento => elemento.producto !== producto.producto);  
                          this.calculoPrecioTotal();
                        }
                        document.getElementById('codigo').focus();
                     });  
  }
  
  // Calcular precio total
  calculoPrecioTotal(): void {
    let precioTemp = 0;
    this.productos.forEach(elemento => {
      precioTemp += elemento.precio_total;
    });
    this.precioTotal = precioTemp;
  }

  // Completar venta
  completarVenta(): void {
    this.alertService.question({msg:'¿Quieres completar la venta?', buttonText: 'Completar'})
                     .then((result)=>{
                       if(result.isConfirmed){
                         this.alertService.loading();
                         const data = { 
                           precio_total: this.precioTotal,
                           productos: this.productos 
                          };
                         this.ventasService.nuevaVenta(data).subscribe( (resp) => {
                           this.reiniciarVenta();
                           this.alertService.success('Venta completada');
                           document.getElementById('codigo').focus();      
                         },({error}) => {
                           this.alertService.errorApi(error.msg);
                           document.getElementById('codigo').focus();      
                         });
                       }
                       document.getElementById('codigo').focus();
                     });  
  }

  // Modal - Calcular vuelto
  modalCalcularVuelto(): void { this.showModal = !this.showModal; }

  // Modal - Reiniciar venta
  modalReiniciarVenta(): void {
    this.alertService.question({msg:'¿Quieres reiniciar la venta?', buttonText: 'Reiniciar'})
                     .then((result)=>{
                        if(result.isConfirmed){ this.reiniciarVenta(); }
                        document.getElementById('codigo').focus();
                      });  
  }
  
  // Reiniciar venta
  reiniciarVenta(): void {
    this.productoVenta = { 
      descripcion: '',
      producto: '', 
      precio_unitario: 0, 
      precio_total: 0, 
      unidad_medida: '',
      cantidad: 0 
    };
    this.productos = [];  
    this.precioTotal = 0;
    this.productoActual = null;
    document.getElementById('codigo').focus();
  }

  // Calcular vuelto
  calcularVuelto(pago: any): void{
    if(pago.value.trim() === '') {
      this.alertService.info('Formulario inválido');
      pago.value = '';
      return;
    };
    const pagoNumber = Number(pago.value);
    this.vuelto = pagoNumber - this.precioTotal;      
  }

  // Cerrar modal
  cerrarModal(txtPago: any): void {
    this.showModal = false;
    document.getElementById('codigo').focus();
    this.vuelto = 0;
    txtPago.value = '';
  }

}
