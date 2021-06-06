import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';
import { AlertaStockPipe } from './alerta-stock.pipe';
import { MonedaPipe } from './moneda.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe,
    MonedaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe,
    AlertaStockPipe,
    MonedaPipe
  ]
})
export class PipesModule { }
