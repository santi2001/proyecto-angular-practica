import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
// import { DatePipe, formatDate, registerLocaleData} from '@angular/common';
// import localeES from '@angular/common/locales/es';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientes: Array<Cliente>;
  private url = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

  constructor(private httpCliente: HttpClient , private router: Router) {
  }

  public getClientes(): Observable<Array<Cliente>>
  {
    return this.httpCliente.get(this.url).pipe(
      map( (result ) => {
        const clientes = result as Array<Cliente>;
        return clientes.map(cliente => {
          // registerLocaleData(localeES, 'es');
          // let datepipe = new DatePipe('es'); // datepipe
          // cliente.nombre = cliente.nombre.toUpperCase();
          // cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', '');
          //  cliente.createAt = datepipe.transform(cliente.createAt,'dd/MM/yyyy' ); datepipe
          // cliente.apellido = cliente.apellido.toLowerCase();
          return cliente;
        });
      } )
   ); // permite darle una forma al observable. ya que viene de en formato json o any
  }



  public getCliente(id: number): Observable<any>
  {
    return this.httpCliente.get<Cliente>(this.url + '/' + id).pipe(
    catchError(e => {
      this.router.navigate(['/clientes']);
      Swal.fire('Error al intentar obtener al cliente con el ID: ' + id, e.error.mensaje, 'error');
      return throwError(e);
    })
    );
  }


  public agregarCliente(cliente: Cliente): Observable<Cliente>
  {
    return this.httpCliente.post(this.url, cliente, {headers: this.httpHeaders}).pipe(
      map( (result: any) => result.cliente as Cliente),
      catchError(e => {

        if (e.status === 400)
        {
          return throwError(e);
        }
        Swal.fire('Error al agregar Cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  public modificarCliente(cliente: Cliente): Observable<any>
  {
    return this.httpCliente.put<any>(this.url + '/' + cliente.id, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if (e.status === 400)
        {
          return throwError(e);
        }
        Swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  public eliminarCliente(cliente: Cliente): Observable<Cliente>
  {
    return this.httpCliente.delete<Cliente>(this.url + '/' + cliente.id).pipe(
      catchError(e => {
        Swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
}
