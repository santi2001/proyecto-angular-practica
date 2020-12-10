import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { Factura } from 'src/app/models/factura';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { FacturaService } from 'src/app/services/factura.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  public fotoSeleccionada: File;
   public progreso = 0;
  constructor(private clienteService: ClienteService, public modalService: ModalService , public authService: AuthService, 
              private facturaService: FacturaService, private activateRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((result) => {
      let id: number = +result.get('id');

      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });
    console.log(this.cliente);
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada?.type.indexOf('image') < 0)
    {
      this.fotoSeleccionada = null;
      Swal.fire('Error al seleccionar una imagen: ', 'El archivo debe ser de tipo imagen', 'error');
    }
  }
  subirFoto() {
    if (!this.fotoSeleccionada)
    {
      Swal.fire('Error: debe seleccionar una foto', '' , 'error' );
    }
    else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        (event) => {
        {
          if (event.type === HttpEventType.UploadProgress)
          {
            this.progreso = Math.round((event.loaded / event.total) * 100);
            console.log(this.progreso);
          }else if (event.type === HttpEventType.Response )
          {
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUploads.emit(this.cliente);

            Swal.fire('la foto se ha subido completamente', response.mensaje  , 'success');
          }
         // this.cliente = result;
        }
      });
    }
  }
  cerrarModal()
  {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
  delete(factura: Factura): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Esta Seguro?',
      text: 'esta a punto de eliminar la factura   ' + factura.descripcion + '\n' + ' ¿desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.eliminarFactura(factura.id).subscribe(
          () => {
            swalWithBootstrapButtons.fire(
              'Factura eliminada!',
              ' Se ha eliminado a la factura ' + factura.descripcion + ' con exito!!.',
              'success'
            );
            // tslint:disable-next-line: max-line-length
            this.cliente.listaFacturas = this.cliente.listaFacturas.filter((item: Factura) => item !== factura); // esta operacion crea un nuevo array e inserta los elementos que cumplen con la condicion
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
}
