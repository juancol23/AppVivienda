import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {AgmCoreModule} from '@agm/core';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {FormsModule} from '@angular/forms';

import {environment} from './../environments/environment';

  

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDc2AdGnT2qtKTMHxa-5yupJd-m46NGPCI', libraries: ['places']}),
    AppRoutingModule,

    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule

  ],
  // providers: [ExceptionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
