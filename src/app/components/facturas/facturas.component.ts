import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/models/factura';
import { ClienteService } from 'src/app/services/cliente.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { FacturaService } from 'src/app/services/factura.service';
import { Producto } from 'src/app/models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from 'src/app/models/item-factura';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo = 'nueva Factura';
  factura: Factura;
  autocompletecontrol = new FormControl();
  productos: string[] = ['mesa', 'Tablet', 'tv Lg', 'Bicicleta'];
  productosfiltrados: Observable<Producto[]>;
  // tslint:disable-next-line: max-line-length
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private facturaService: FacturaService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.factura = new Factura();
    this.activatedRoute.paramMap.subscribe(
      params=>{
        let clienteId = +params.get('clienteId');
        this.clienteService.getCliente(clienteId).subscribe( cliente => this.factura.cliente = cliente);
        this.factura.cliente.listaFacturas = null;
      }
    );
    this.productosfiltrados = this.autocompletecontrol.valueChanges
    .pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => value ?  this._filter(value) : [])
    
    );
  }




  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }
  mostrarNombre(producto?: Producto): string | undefined{
    return producto ? producto.nombre : undefined;
  }
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void
  {

    let producto = event.option.value as Producto;
    console.log(producto);
    if (this.existeItem(producto.id))
    {
      this.incrementaCantidad(producto.id);
    }
    else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompletecontrol.setValue(''); // limpia el campo del filtrado
    event.option.focus(); // para que el campo no apáresca seleccionado
    event.option.deselect();
  }
  actualizarcantidad(id: number, event: any): void
  {
    let cantidad = event.target.value as number;
    if (cantidad == 0)
    {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id)
      {
       // item.importeTotal= item.calcularImporte();
        item.cantidad = cantidad;
      }
      return item;
    });
  }
  existeItem(id: number): boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id)
      {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad (id: number) : void{
    this.factura.items = this.factura.items.map((item: ItemFactura)=>{
      if (id === item.producto.id)
      {
        ++item.cantidad;
      }
      return item;
    })
  }
  eliminarItemFactura(id): void{
    this.factura.items = this.factura.items.filter((ele: ItemFactura) => ele.producto.id !== id);
  }
   create(facturaForm): void{
     if(this.factura.items.length==0 )
     {
     this.autocompletecontrol.setErrors({ 'invalid': true});
     }
     if (facturaForm.form.valid && this.factura.items.length >0)
     {
      console.log(this.factura);
      this.facturaService.createFactura(this.factura).subscribe(
        result => {
          Swal.fire(this.titulo, 'Factura ' + this.factura.descripcion + ' creada con exito !!!', 'success');
          this.router.navigate(['/clientes']);
        }
      );
     }
  
   }
}
