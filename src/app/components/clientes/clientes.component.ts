import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

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
    this.cargarClientes();
  }
  public cargarClientes(): void
  {
    this.clienteService.getClientes().subscribe(
      (result) => {
        Object.assign( this.clientes, result);
      }
    );
  }
  public eliminarCliente(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Esta Seguro?',
      text: 'esta a punto de eliminar al cliente ' + cliente.nombre + '\n' + ' ¿desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.eliminarCliente(cliente).subscribe(
          (resultado) => {
            swalWithBootstrapButtons.fire(
              'Cliente eliminado!',
              ' Se ha eliminado al cliente' + cliente.nombre + ' con exito!!.',
              'success'
            );
            // tslint:disable-next-line: max-line-length
            this.clientes = this.clientes.filter((item: Cliente) => item !== cliente);// esta operacion crea un nuevo array e inserta los elementos que cumplen con la condicion
          }
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Operacion cancelada',
          'No se ha cancelado la eliminacion',
          'error'
        );
      }
    })
  }

}
