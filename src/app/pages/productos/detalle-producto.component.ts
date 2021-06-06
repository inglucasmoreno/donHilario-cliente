import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ProductosService } from 'src/app/services/productos.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styles: [
  ]
})
export class DetalleProductoComponent implements OnInit {

  public producto;

  constructor(
      private activatedRoute: ActivatedRoute,
      private productosService: ProductosService,
      private dataService: DataService,
      private alertService: AlertService      
    ) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Productos - Detalles';
    this.activatedRoute.params.subscribe(({id}) => {
      this.getProducto(id);
    })
  }

  getProducto(id: string): void {
    this.productosService.getProducto(id).subscribe( ({ producto }) => {
      this.producto = producto;
      this.alertService.close();
    });   
  }


}
