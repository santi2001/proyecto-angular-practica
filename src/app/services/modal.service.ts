import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal = false;
  // tslint:disable-next-line: variable-name
  private _notificarUploads = new EventEmitter<any>();
 
  constructor() { }
  abrirModal()
  {
    this.modal = true;
  }
  cerrarModal()
  {
    this.modal = false;
  }
  public get notificarUploads(): EventEmitter<any> {
    return this._notificarUploads;
  }
  public set notificarUploads(value) {
    this._notificarUploads = value;
  }
}
