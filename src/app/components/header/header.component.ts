import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService , private router: Router) { }

  ngOnInit(): void {
  }
  logout(): void
  {
    let usuario = this.authService.usuario.nombreUsuario;
    this.authService.logout();
    if (this.authService.isAuthenticated)
    {
      swal.fire('Logout', 'Nos vemos :D ' + usuario + ' has cerrado session', 'success');
    }
    else{
      swal.fire('No se pudo cerrar session', 'Uffff... hubo un error al ' + 'cerrado session', 'success');
    }
    this.router.navigate(['/login']);
  }
}
