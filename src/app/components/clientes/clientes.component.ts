import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Array<Cliente>;
  constructor(private clienteService: ClienteService ) {
    this.clientes = new Array<Cliente>();
    this.cargarClientes();
    }

  ngOnInit(): void {
  }
  public cargarClientes(): void
  {
    this.clienteService.getClientes().subscribe(
      (result) => {
        Object.assign( this.clientes, result);
      }
    );
  }

}
