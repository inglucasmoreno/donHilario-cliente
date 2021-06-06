import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

// Componentes
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
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

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            
            // Home
            { path: 'home', component: HomeComponent },
            
            // Usuarios
            { path: 'usuarios', component: UsuariosComponent },
            { path: 'usuarios/nuevo', component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', component: EditarPasswordComponent },
            
            // Unidad de medida
            { path: 'unidad_medida', component: UnidadMedidaComponent},
            { path: 'unidad_medida/editar/:id', component: EditarUnidadComponent},
            
            // Productos
            { path: 'productos', component: ProductosComponent},
            { path: 'productos/nuevo', component: NuevoProductoComponent},
            { path: 'productos/detalle/:id', component: DetalleProductoComponent},
            { path: 'productos/editar/:id', component: EditarProductoComponent},
        
            // Proveedores
            { path: 'proveedores', component: ProveedoresComponent},
            { path: 'proveedores/nuevo', component: NuevoProveedorComponent},
            { path: 'proveedores/editar/:id', component: EditarProveedorComponent},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}