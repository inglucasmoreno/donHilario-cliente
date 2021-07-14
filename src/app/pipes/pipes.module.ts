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
import { FiltroPromocionesPipe } from './filtro-promociones.pipe';
import { FiltroStockMinimoPipe } from './filtro-stock-minimo.pipe';

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
    FiltroIngresoProductosPipe,
    FiltroPromocionesPipe,
    FiltroStockMinimoPipe,
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
    FiltroIngresoProductosPipe,
    FiltroPromocionesPipe,
    FiltroStockMinimoPipe,
  ]
})
export class PipesModule { }
