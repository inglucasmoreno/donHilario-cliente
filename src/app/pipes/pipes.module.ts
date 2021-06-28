import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';
import { AlertaStockPipe } from './alerta-stock.pipe';
import { MonedaPipe } from './moneda.pipe';
import { FiltroUsuariosPipe } from './filtro-usuarios.pipe';
import { FiltroProductosPipe } from './filtro-productos.pipe';
import { FiltroIngresosPipe } from './filtro-ingresos.pipe';
import { FiltroUnidadMedidaPipe } from './filtro-unidad-medida.pipe';
import { FiltroProveedoresPipe } from './filtro-proveedores.pipe';
import { FiltroIngresoProductosPipe } from './filtro-ingreso-productos.pipe';

@NgModule({
  declarations: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroProductosPipe,
    FiltroIngresosPipe,
    FiltroUnidadMedidaPipe,
    FiltroProveedoresPipe,
    FiltroIngresoProductosPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroProductosPipe,
    FiltroIngresosPipe,
    FiltroUnidadMedidaPipe,
    FiltroProveedoresPipe,
    FiltroIngresoProductosPipe
  ]
})
export class PipesModule { }
