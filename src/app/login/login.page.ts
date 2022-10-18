import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Users } from '../modelos/users';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  usuario: Users;
  password: string;
  password2: string;
  opt: boolean;
  bandera = false;
  showPassword = false;
  passtogle = 'eye';
  s: number;
  eq = false;
  nameC = false;
  dirC = false;
  emailC = false;
  error = false;
  constructor(public alertController: AlertController,
    public router: Router, public userService: UsuarioService) {
    this.opt = true;
    this.usuario = new Users();
    this.s = 0;
  }
  toggleopt() {
    this.opt = !this.opt;
    console.log(this.opt);
  }

  toglepass(): void {
    this.showPassword = !this.showPassword
  }

  ObtenerUsers() {
    this.userService.obtenerEmpleados()
      .subscribe(res => {
        this.userService.empleados = res as Users[];
        console.log(res);
      })
  }

  ngOnInit() {
    this.ObtenerUsers();
  }
  //pendiente
  iniciarSesion(form: NgForm) {
    this.validar(form);
    if (this.userService.login) {
      this.userService.tipoUser = this.userService.ActUser.role;
      if (this.userService.ActUser.role == 'admin') {
        this.userService.admin = true;
      }
      this.noregAlert();
      this.resetForm(form);
      this.router.navigate(['/tabs/tab1']);
    } else {
      this.noAlert();
    }
  }
  revisar() {
    if (this.password2 == this.userService.selecteduser.password) {
      this.bandera = true;
    } else this.bandera = false;
    this.eq = true;
  }

  Registrarse(form: NgForm) {
    this.eq = true;
    this.regvalidar(form);
    if (this.s == 0 && this.bandera && this.nameC && this.dirC && this.emailC) {
      this.userService.selecteduser.role="humano";
      this.userService.posEmpleados(this.userService.selecteduser).subscribe(
        res => {
          if (res=!'error'){
            console.log('Entré');
          }
          if (!this.error) {
            this.userService.ActUser.name = this.userService.selecteduser.name.toString();
            this.userService.correo = this.userService.selecteduser.email.toString();
            this.resetForm(form);
            this.userService.login = true;
            this.presentAlert();
            this.router.navigate(['/tabs/tab1']);
            console.log(res);
          }else{
            this.error=false;
            this.inAlert();
          }
        });
    }
    else {
      this.reAlert()
      this.s = 0;
      this.eq = false;
    }
  }

  regvalidar(form: NgForm) {
    if (this.userService.selecteduser.name != "") {
      for (let index = 0; index < this.userService.selecteduser.name.length; index++) {
        if (this.userService.selecteduser.name.substring(index) != "") {
          this.nameC = true;
        }
      }
    } else { this.nameC = false; }
    if (this.password2 == "") {

    }
    if (this.password2 == this.userService.selecteduser.password) {
      this.bandera = true;
    } else { this.bandera = false; }
    if (this.userService.selecteduser.direccion != "") {
      for (let index = 0; index < this.userService.selecteduser.direccion.length; index++) {
        if (this.userService.selecteduser.direccion.substring(index) != "") {
          this.dirC = true;
        }

      }
    }
    if (this.userService.selecteduser.email != "") {
      this.emailC = true;
      this.userService.empleados.forEach(element => {
        if (this.userService.selecteduser.email == element.email) {
          this.s++;
        }
      });
    } else { this.emailC = false }
  }

  validar(form: NgForm) {
    this.ObtenerUsers();
    this.userService.empleados.forEach(gf => {
      if (this.userService.selecteduser.email == gf.email) {
        if (this.userService.selecteduser.password == gf.password) {
          this.userService.ActUser = gf;
          this.userService.login = true;
        }
      }
    });
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.userService.selecteduser = new Users();
      this.bandera = false;
      this.eq = false;
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Registro',
      message: 'Se a registrado satisfactoriamente',
      buttons: ['OK']
    });

    await alert.present();
  }

  async inAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Error',
      message: 'Hubo un error interno de la aplicación, El servicio no se encuentra disponible',
      buttons: ['OK']
    });

    await alert.present();
  }

  async noregAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Login',
      message: 'Login correcto bienvenido ' + this.userService.ActUser.name,
      buttons: ['OK']
    });

    await alert.present();
  }
  async reAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Registro',
      message: 'El correo ya ha sido registrado verifique los datos',
      buttons: ['OK']
    });
    await alert.present();
  }

  async noAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Usuario',
      subHeader: 'Login',
      message: 'Login incorrecto verifique las credenciales',
      buttons: ['OK']
    });
    await alert.present();
  }
  //pass show


}