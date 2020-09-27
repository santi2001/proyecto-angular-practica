export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    createAt: Date;
    email: string;

    constructor(id?: number, nombre?: string, apellido?: string, createAt?: Date, email?: string )
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.createAt = createAt;
        this.email = email;
    }
}
