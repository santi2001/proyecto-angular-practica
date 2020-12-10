import {Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable()
export class Authtoken implements HttpInterceptor {
    constructor(private authService: AuthService,private router: Router)
    {
    }
    intercept(req : HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        let token = this.authService.token;
        if(token!=null)
        {
            const authReq = req.clone({
                headers: req.headers.set('Authorization','Bearer '+ token)
            });
            return next.handle(authReq);
        }
       

        return next.handle(req).pipe(
            catchError(e =>{
                if(e.status==401)
                {
                    if(this.authService.isAuthenticated())
                    {
                        this.authService.logout();
                    }
                    this.router.navigate(['/login']);
                }
                if(e.status== 403)
                {
                    Swal.fire('Acceso denegado', 'Hola '+ this.authService.usuario.nombreUsuario+ ' no tiene acceso a este recurso!!','warning');
                }
                return throwError(e);
            })
        );
    }
}
