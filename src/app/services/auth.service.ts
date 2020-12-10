import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;

  constructor(private httpCliente: HttpClient) { }

  
  public login(usuario: Usuario): Observable<any> {
    const url = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.nombreUsuario);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.httpCliente.post<any>(url, params.toString(), { headers: httpHeaders });
  }
  public hasRole(role: string): boolean
  {
    if (this.usuario.roles.includes(role))
    {
      return true;
    }
    return false;
    
  }
  public guardarUsuario(accessToken: string): void {
    this._usuario = new Usuario();
    let payload = this.obtenerToken(accessToken);
    this._usuario.nombreUsuario = payload.nombreUsuario;
    this._usuario.id = payload.id;
    this._usuario.habilitado = payload.habilitado;
    this._usuario.email = payload.email;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  public obtenerToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }
  public isAuthenticated(): boolean
  {
    let payload = this.obtenerToken(this.token);
    return (payload != null && payload.nombreUsuario && payload.nombreUsuario.length > 0);
  }

  // getters
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token') as string;
      return this.token;
    }
    return null;
  }
  public logout(): void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }
}
