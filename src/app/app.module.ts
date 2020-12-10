// importaciones de angular
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DatePipe, formatDate, registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es';
registerLocaleData(localeES, 'es');
import { LOCALE_ID, NgModule } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RouterModule, Routes } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
// componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FormularioAltaClienteComponent } from './components/formulario-alta-cliente/formulario-alta-cliente.component';
import { ClienteService} from './services/cliente.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { DetalleComponent } from './components/detalle/detalle.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import {MatCardModule} from '@angular/material/card';
import { FacturasComponent } from './components/facturas/facturas.component';
import { DetallefacturacionComponent } from './components/detallefacturacion/detallefacturacion.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TokenInterceptor} from '../app/token/interceptors/token';
import {Authtoken} from '../app/token/interceptors/authtoken';
const routes: Routes = [
  {path: '', redirectTo : '/clientes', pathMatch: 'full' },
  {path: 'clientes', component : ClientesComponent},
  {path: 'clientes/page/:page', component : ClientesComponent},
  {path: 'clientes/form', component: FormularioAltaClienteComponent, canActivate: [AuthGuard, RoleGuard], data: {role : 'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component: FormularioAltaClienteComponent, canActivate: [AuthGuard, RoleGuard], data: {role : 'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent}, // un componente puede tener dos rutas o mas
  {path: 'facturas/:id', component: DetallefacturacionComponent, canActivate: [AuthGuard, RoleGuard], data: {role : 'ROLE_USER'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [AuthGuard, RoleGuard], data: {role : 'ROLE_ADMIN'}}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    FormularioAltaClienteComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    FacturasComponent,
    DetallefacturacionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [ClienteService, {provide : LOCALE_ID, useValue: 'es'}
  , {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,multi: true },{provide: HTTP_INTERCEPTORS, useClass: Authtoken,multi: true }],
  
  bootstrap: [AppComponent]
})
export class AppModule {

}
