import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url = 'http://localhost:8080/api/facturas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor( private httpCliente: HttpClient, private authService: AuthService) {

   }
   public getFactura(id: number): Observable<Factura>{

    return this.httpCliente.get<Factura>(this.url + '/' + id);
  }
  private agregarAuthorizationheaders(){
    let token= this.authService.token;
    if (token != null)
    {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }
  eliminarFactura(id: number): Observable<void>{
    return this.httpCliente.delete<void>(this.url + '/' + id);
  }
  filtrarProductos(term: string): Observable<Producto[]>{
    return this.httpCliente.get(this.url + '/filtrar-productos/' + term).pipe(
      map( result => result as Producto[])
    );
  }
  createFactura(factura: Factura): Observable<Factura>
  {
    return this.httpCliente.post<Factura> (this.url, factura);
  }
}
