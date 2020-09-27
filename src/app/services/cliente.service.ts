import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientes: Array<Cliente>;
  private url = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

  constructor(private httpCliente: HttpClient) {
  this.clientes = new Array<Cliente>();
  this.clientes.push(new Cliente(1, 'santiago', 'churquina', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(2, 'damian', 'Ruedas', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(3, 'carlos', 'Torres', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(4, 'martin', 'Dominguez', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(5, 'facundo', 'Garcia', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(6, 'agustin', 'Vilte', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(7, 'federico', 'Cuevas', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(8, 'gaston', 'Gallardo', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(9, 'Cristian', 'Valderama', new Date(), 'santiagochurquina95@gmail.com'));
  this.clientes.push(new Cliente(10, 'Belen', 'Garzon', new Date(), 'santiagochurquina95@gmail.com'));
  }

  public getClientes(): Observable<Array<Cliente>>
  {
    return this.httpCliente.get(this.url).pipe(
      map( (result ) => result as Array<Cliente> )); // permite darle una forma al observable. ya que viene de en formato json o any
  }



  public getCliente(id: number): Observable<Cliente>
  {
    return this.httpCliente.get(this.url + '/' + id).pipe(
      map( result => result as Cliente)
    );
  }


  public agregarCliente(cliente: Cliente): Observable<Cliente>
  {
    return this.httpCliente.post(this.url, cliente, {headers: this.httpHeaders}).pipe(
      map( result => result as Cliente)
    );
  }
  public modificarCliente(cliente: Cliente): Observable<Cliente>
  {
    return this.httpCliente.put<Cliente>(this.url, cliente, {headers: this.httpHeaders});
  }
}
