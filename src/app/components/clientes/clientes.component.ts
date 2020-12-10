import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute} from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Array<Cliente>;
  clienteSeleccionado: Cliente;
  paginador: any;
  // tslint:disable-next-line: max-line-length
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private modalService: ModalService, public authService: AuthService ) {
    this.clientes = new Array<Cliente>();
    }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        let page: number = +params.get('page');
        if (!page)
        {
          page = 0;
        }
        this.cargarClientes(page);
      }
    );

  }
  public cargarClientes(page): void
  {

    this.clienteService.getClientes(page).subscribe(
      (response) => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
        console.log(this.clientes);
      }
      
    );
    this.modalService.notificarUploads.subscribe(
      (cliente) => {
        this.clientes = this.clientes.map(
          (clienteOriginal) => {
            // tslint:disable-next-line: triple-equals
            if (clienteOriginal.id == cliente.id)
            {
              clienteOriginal.foto = cliente.foto;
            }
            return clienteOriginal;
          }
        );
     
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
    });
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
            this.clientes = this.clientes.filter((item: Cliente) => item !== cliente); // esta operacion crea un nuevo array e inserta los elementos que cumplen con la condicion
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
    });
  }
  public abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
