import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { UnidadMedidaComponent } from './unidad-medida/unidad-medida.component';
import { EditarUnidadComponent } from './unidad-medida/editar/editar-unidad.component';
import { ProductosComponent } from './productos/productos.component';
import { NuevoProductoComponent } from './productos/nuevo-producto.component';
import { EditarProductoComponent } from './productos/editar/editar-producto.component';
import { DetalleProductoComponent } from './productos/detalle-producto.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { NuevoProveedorComponent } from './proveedores/nuevo-proveedor.component';
import { EditarProveedorComponent } from './proveedores/editar/editar-proveedor.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { IngresoDetallesComponent } from './ingresos/ingreso-detalles.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { VentasComponent } from './ventas/ventas.component';
import { VentasHistorialComponent } from './ventas/ventas-historial.component';
import { VentasDetallesComponent } from './ventas/ventas-detalles.component';
import { CajasComponent } from './cajas/cajas.component';
import { CajasHistorialComponent } from './cajas/cajas-historial.component';

@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    EditarPasswordComponent,
    UnidadMedidaComponent,
    EditarUnidadComponent,
    ProductosComponent,
    NuevoProductoComponent,
    EditarProductoComponent,
    DetalleProductoComponent,
    ProveedoresComponent,
    NuevoProveedorComponent,
    EditarProveedorComponent,
    IngresosComponent,
    IngresoDetallesComponent,
    VentasComponent,
    VentasHistorialComponent,
    VentasDetallesComponent,
    CajasComponent,
    CajasHistorialComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class PagesModule { }
