import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Users } from '../modelos/users';
import { tokens } from '../modelos/Token';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  userName: string;
  ActUser: Users;
  correo: string;
  tipoUser: String;
  selecteduser: Users;
  empleados: Users[];
  loguser: Users;
  admin: boolean;
  login: boolean;
  frr: string;
  tokenbd: tokens;
  urlPeticionNode = "http://localhost:3000/api/users/";
  constructor(private httpClient: HttpClient) {
    this.admin = false;
    this.userName = '';
    this.tipoUser = '';
    this.login = false;
    this.correo = '';
    this.selecteduser = new Users();
    this.ActUser = new Users();
    this.frr = '';
    this.tokenbd = new tokens();
  }

  obtenerEmpleados() {
    return this.httpClient.get(this.urlPeticionNode + this.tokenbd.tokenBd)
  }

  posEmpleados(user: Users) {
    return this.httpClient.post(this.urlPeticionNode + this.tokenbd.tokenBd, user)
  }

  actEmpleado(user: Users) {
    return this.httpClient.put(this.urlPeticionNode + user._id, user + this.tokenbd.tokenBd)
  }

  deleteEmpleado(_id: string) {
    this.frr = _id;
    return this.httpClient.delete(this.urlPeticionNode + _id + this.tokenbd.tokenBd);
  }
}