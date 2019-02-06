import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';

declare var $ :any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService , private FirebaseService: FirebaseService) { }

/*LOGIN*/
public email_login: string = null;
public password_login: string = null;

/*REGISTRO*/
public email_registro: string = null;
public nombre_registro: string = null;
public password_registro: string = null;
public password_registro_2: string = null;

/*USUARIO*/
public idUser: string = null;
public nameUser: string=null;
public isLogged: boolean = false;

/*ERRORES*/
public _message_login: boolean = false;
public message_text_login: String = "";
public _message_register: boolean = false;
public message_text_register: String = "";


  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {

          this.isLogged = true;

          this.FirebaseService.getUserById(auth.uid).subscribe((res) => {

            this.nameUser=res['name'];

          })

      }else{

        this.isLogged = false;

      }

    });
  }



  onAddUser(): void {
    if(this.password_registro==this.password_registro_2){

      this.authService.registerUser(this.email_registro, this.password_registro,this.nombre_registro)
      .then((res) => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
              user.updateProfile({
              displayName: this.nombre_registro,
              photoURL: "assets/img/foto_perfil.jpg"
            }).then((res) => {

              this.router.navigate(['perfil']);
              $("#exampleModalCenter").hide();
              $(".modal-backdrop").hide();

            }).catch((err) => console.log(err.message));
          }
        });
      }).catch(err => {

        this._message_register = true;
        switch (err.message) {
          case 'createUserWithEmailAndPassword failed: Second argument "password" must be a valid string.':
            this.message_text_register="La contraseña debe tener al menos 6 caracteres";
            break;
          case "The email address is already in use by another account.":
            this.message_text_register="La dirección de correo electrónico ya está en uso por otra cuenta.";
            break;
          case "Password should be at least 6 characters":
            this.message_text_register="La contraseña debe tener al menos 6 caracteres";
            break;
          case "The email address is badly formatted.":
            this.message_text_register="La dirección de correo electrónico está mal formateada.";
              break;
          default:
          this.message_text_register="Error generico";
        }

        setTimeout(()=>{
          this._message_register = false;
          this.message_text_register = "";
          }, 5000);


      });

    }else{

      this._message_register = true;
      this.message_text_register="Las contraseñas no coinciden";

    }

  }



  onLogin(): void {
    this.authService.loginEmailUser(this.email_login, this.password_login)
      .then((res) => {

        this.router.navigate(['perfil']);
       $("#exampleModalCenter").hide();
       $(".modal-backdrop").hide();

      }).catch(
        err => {

          this._message_login = true;

          switch (err.message) {
            case "The password is invalid or the user does not have a password.":
              this.message_text_login="Correo y/o contraseña incorrectos.";
              break;
            case "The email address is badly formatted.":
              this.message_text_login="La dirección de correo electrónico está mal formateada.";
              break;
            case "The user account has been disabled by an administrator.":
              this.message_text_login="La cuenta de usuario ha sido desactivada por un administrador.";
                break;
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.message_text_login="Correo y/o contraseña incorrectos.";
                break;
            default:
            this.message_text_login="Error generico";
          }

          setTimeout(()=>{
            this._message_login = false;
            this.message_text_login = "";
            }, 5000);


        });
  }


  onLoginFacebook(): void {
    this.authService.loginFacebookUser().then(
      (success) => {

      this.router.navigate(['perfil']);
      $("#exampleModalCenter").hide();
      $(".modal-backdrop").hide();

      }
    ).catch(err => {

        this._message_login = true;

        switch (err.message) {
          case "The user account has been disabled by an administrator.":
            this.message_text_login="La cuenta de usuario ha sido desactivada por un administrador.";
              break;
          default:
          this.message_text_login="Error generico";
        }

        setTimeout(()=>{
          this._message_login = false;
          this.message_text_login = "";
          }, 5000);

       });
  }


  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
  }



}
