import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Iniciar Session';
  usuario: Usuario;
  public hide = true;
  loginRegistro: FormGroup;
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {

    this.loginRegistro = this.formBuilder.group({
      username: [this.usuario.nombre, [Validators.required]],
      password : [this.usuario.password, [Validators.required, Validators.minLength(5)]]
    });
    if (this.authService.isAuthenticated())
    {
      Swal.fire('Login', 'Hola ' +  this.authService.usuario.nombreUsuario + ' ya estas autenticado!', 'info');
      this.router.navigate(['/clientes']);
    }
  }
  public login(): void{
  console.log(this.usuario);
  if (this.usuario.nombreUsuario == null || this.usuario.password == null)
  {
 Swal.fire('Error Login', 'Nombre de usuario o contraseña vacias !!', 'error');
  }
  this.authService.login(this.usuario).subscribe(
    (result) => {
      console.log(result);
      this.router.navigate(['/clientes']);
      this.authService.guardarUsuario(result.access_token);
      this.authService.guardarToken(result.access_token);
      const usuario = this.authService.usuario;
      Swal.fire('Login', 'Hola ' + usuario.nombreUsuario + ', has iniciado session con exito!!', 'success');
    },
    (err) => {
      if (err.status == 400){
        // no especificar cual de los dos es el error, ya que una persona malintencionada. podria intentar acceder
        Swal.fire('Error Login', 'Usuario o Clave incorrectas!!', 'error');
      }
    }
  );
  }
  onRegistreSubmmit(){

  }
}
