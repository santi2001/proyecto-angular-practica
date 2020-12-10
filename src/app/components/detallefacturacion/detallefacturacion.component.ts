import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from 'src/app/models/factura';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-detallefacturacion',
  templateUrl: './detallefacturacion.component.html',
  styleUrls: ['./detallefacturacion.component.css']
})
export class DetallefacturacionComponent implements OnInit {
  titulo = 'factura';
  public factura1: Factura = new Factura();
  constructor( private facturaService: FacturaService, private activateRouter: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.obtenerFactura();
  }

  public obtenerFactura(): void{
    this.activateRouter.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        if (id)
        {
          this.facturaService.getFactura(id).subscribe(
            result => {
              this.factura1 = result;
              console.log(result);
            }
          );
        }
      }
    );
  }

}
