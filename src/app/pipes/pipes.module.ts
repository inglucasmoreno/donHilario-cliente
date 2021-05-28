import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    RolPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe
  ]
})
export class PipesModule { }
