import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { InmuebleComponent } from './inmueble/inmueble.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ResetComponent } from './reset/reset.component';
import { MustMatchDirective } from './validationForm/match.directive';
import { AppPasswordDirective } from './validationForm/app-password.directive';
import { AppPasswordDirectiveLogin } from './validationForm/app-password-login.directive';
import { RegisterInmuebleComponent } from './register-inmueble/register-inmueble.component';
import {AgmCoreModule} from '@agm/core';
import { CommonModule } from '@angular/common';
import { RegisterSolicitudComponent } from './register-solicitud/register-solicitud.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import { EditInmuebleComponent } from './edit-inmueble/edit-inmueble.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    InmuebleComponent,
    VehiculoComponent,
    PerfilComponent,
    ResetComponent,
    MustMatchDirective,
    AppPasswordDirective,
    AppPasswordDirectiveLogin,
    RegisterInmuebleComponent,
    RegisterSolicitudComponent,
    EditInmuebleComponent,
    EditSolicitudComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDc2AdGnT2qtKTMHxa-5yupJd-m46NGPCI', libraries: ['places']}),
    NgbModule,
    NgxSpinnerModule,
    NgxPaginationModule
  ],
  providers: [AngularFireAuth, AngularFirestore],
  bootstrap: [AppComponent]
})

export class AppModule {
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
