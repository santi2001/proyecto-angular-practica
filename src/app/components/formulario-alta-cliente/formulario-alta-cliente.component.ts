import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from 'src/app/models/region';
@Component({
  selector: 'app-formulario-alta-cliente',
  templateUrl: './formulario-alta-cliente.component.html',
  styleUrls: ['./formulario-alta-cliente.component.css']
})
export class FormularioAltaClienteComponent implements OnInit {
  titulo = 'formulario Alta';
  cliente: Cliente;
  regiones: Region[];
  errores: string[];
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.cliente = new Cliente();
  }

  ngOnInit(): void {
    this.cargarCliente();
  }
  public crearCliente(): void {
    this.clienteService.agregarCliente(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);

        Swal.fire('Nuevo Cliente', 'El cliente ' + cliente.nombre + ' fue agregado con exito', 'success');
      },
      (err) => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  public cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
    this.clienteService.getRegiones().subscribe((regiones) => (this.regiones = regiones));
  }
  public modificarCliente(): void {
    this.cliente.listaFacturas = null;
    this.clienteService.modificarCliente(this.cliente).subscribe(
      (json) => {
        this.router.navigate(['/clientes']);
        Swal.fire(
          'Cliente Actualizado',
          ' El Cliente ' + json.cliente.nombre + ' fue actualizado con exito!!',
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
      }
    );
  }
  public eliminarCliente(): void {
    this.clienteService.eliminarCliente(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/clientes']);
      Swal.fire('Cliente Eliminado', ' El Cliente fue eliminado con exito!!');
    });
  }
  public compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
