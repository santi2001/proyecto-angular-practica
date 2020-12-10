export class Usuario {

    id: number;
    nombreUsuario: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    habilitado: boolean;
    roles: Array<string> = new Array<string>();
}
