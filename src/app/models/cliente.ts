import { Factura } from './factura';
import { Region } from './region';

export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    createAt: Date;
    email: string;
    foto: string;
    region: Region;
    listaFacturas: Array<Factura>;
    // tslint:disable-next-line: max-line-length
    constructor(id?: number, nombre?: string, apellido?: string, createAt?: Date, email?: string, region?: Region, facturas? : Array<Factura> )
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.createAt = createAt;
        this.email = email;
        this.region = region;
  //      this.facturas = facturas;
    }
}
