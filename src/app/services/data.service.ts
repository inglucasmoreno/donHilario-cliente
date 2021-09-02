import { Injectable } from '@angular/core';
import { ProductosService } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  ubicacionActual: string = 'Dashboard';
  promocionesAlert = false;
  stockAlert = false;
  
  constructor(private productosService: ProductosService) { }
  
  // Detector de promociones
  detectarPromociones(): void {
    this.promocionesAlert= false;
    this.productosService.listarProductos().subscribe(({productos}) => {
      productos.forEach(producto => {
        if(producto.promocion){
          this.promocionesAlert = true;
          return;
        }
      });
    }); 
  }

  // Detector de stock minimo
  detectarStockMinimo(): void {
    this.stockAlert= false;
    this.productosService.listarProductos().subscribe(({productos}) => {
      productos.forEach(producto => {
        if(producto.stock_minimo && (producto.cantidad <= producto.cantidad_minima)){
          this.stockAlert = true;
          return;
        }
      });
    }); 
  }

}
