import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InmuebleComponent } from './inmueble/inmueble.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from './observador/auth.guard';

const app_routes: Routes = [
  {path: 'home', component: InmuebleComponent },
  {path: 'vehiculo', component: VehiculoComponent},
  {path: 'perfil', component: PerfilComponent,canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'home',pathMatch: 'full' }
];

@NgModule({
  imports: [
      RouterModule.forRoot( app_routes, { useHash: false } )
  ],
  exports: [
      RouterModule
  ]
})

export class AppRoutingModule { }
