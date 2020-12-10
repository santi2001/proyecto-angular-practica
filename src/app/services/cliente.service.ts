import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from '../models/region';
import { AuthService } from './auth.service';
// import { DatePipe, formatDate, registerLocaleData} from '@angular/common';
// import localeES from '@angular/common/locales/es';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  clientes: Array<Cliente>;
  private url = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpCliente: HttpClient, private router: Router, private authService: AuthService) { }


  getRegiones(): Observable<Region[]>
  {
    return this.httpCliente.get<Region[]> (this.url + '/regiones');
  }

  public getClientes(page: number): Observable<any> {
    return this.httpCliente.get(this.url + '/page/' + page ).pipe(
      tap((response: any) => {
        console.log('clienteService : tap 1');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((result: any) => {
        let clientes = result.content as Array<Cliente>;
        clientes.map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // // registerLocaleData(localeES, 'es');
          // // let datepipe = new DatePipe('es'); // datepipe
          // // cliente.nombre = cliente.nombre.toUpperCase();
          //  cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', '');
          // //  cliente.createAt = datepipe.transform(cliente.createAt,'dd/MM/yyyy' ); datepipe
          // // cliente.apellido = cliente.apellido.toLowerCase();
          return cliente;
        });
        return result;
      }),
      tap((response: any) => {
        console.log('clienteService : tap 2');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    ); // permite darle una forma al observable. ya que viene de en formato json o any
  }

  public getCliente(id: number): Observable<any> {
    return this.httpCliente.get<Cliente>(this.url + '/' + id).pipe(
      catchError((e) => {
        if(e.status!=401 &&e.error.mensaje)
        {
          this.router.navigate(['/clientes']);
        Swal.fire('Error al intentar obtener al cliente con el ID: ' + id, e.error.mensaje, 'error');
        }
        return throwError(e);
      })
    );
  }

  public agregarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpCliente.post(this.url, cliente).pipe(
      map((result: any) => result.cliente as Cliente),
      catchError((e) => {

        if (e.status === 400) {
          return throwError(e);
        }
      
        return throwError(e);
      })
    );
  }
  public modificarCliente(cliente: Cliente): Observable<any> {
    return this.httpCliente.put<any>(this.url + '/' + cliente.id, cliente).pipe(
      catchError((e) => {

        if (e.status === 400) {
          return throwError(e);
        }
     
        return throwError(e);
      })
    );
  }
  public eliminarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpCliente.delete<Cliente>(this.url + '/' + cliente.id).pipe(
      catchError((e) => {

        
        return throwError(e);
      })
    );
  }
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>
  {
    
    let formdata = new FormData();
    formdata.append('archivo', archivo);
    formdata.append('id', id);
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null)
    {
     httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }
    const req =  new HttpRequest('POST' , this.url + '/upload', formdata, { reportProgress : true , headers: httpHeaders});


    return this.httpCliente.request(req);
  }
}
