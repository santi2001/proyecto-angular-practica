import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { RouterModule, Routes } from '@angular/router';
import { ClienteService} from './services/cliente.service';
import {FormsModule} from '@angular/forms';
import { FormularioAltaClienteComponent } from './components/formulario-alta-cliente/formulario-alta-cliente.component';
const routes: Routes = [
  { path: '', redirectTo : '/clientes', pathMatch: 'full' },
  {path : 'clientes', component : ClientesComponent},
  {path: 'clientes/form', component: FormularioAltaClienteComponent},
  {path: 'clientes/form/:id', component: FormularioAltaClienteComponent}// un componente puede tener dos rutas
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    FormularioAltaClienteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ClienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
