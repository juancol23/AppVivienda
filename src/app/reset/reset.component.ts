import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
declare var $ :any;

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {




  constructor( private authService: AuthService ) { }

public email: string = null;

public true_m: boolean = false;
public message_true: String = "";
public false_m: boolean = false;
public message_false: String = "";

  ngOnInit() {

    $("#exampleModalCenter").hide();
    $(".modal-backdrop").hide();

  }

  resetPasswordEmail(): void {
    if(this.email==""){

      this.false_m = true;
      this.message_false="Ingrese su correo *";

      setTimeout(()=>{
        this.false_m = false;
        this.message_false=""
        }, 5000);


    }else{
    this.authService.resetPassword(this.email)
      .then((res) => {

        this.true_m = true;
        this.message_true="Comprueba si has recibido un correo.";


      }).catch(
        err => {
          console.log(err["message"]);


          this.false_m = true;

          switch (err["message"]) {
            case "The password is invalid or the user does not have a password.":
              this.message_false="Correo y/o contraseña incorrectos.";
              break;
            case "The email address is badly formatted.":
              this.message_false="La dirección de correo electrónico está mal formateada.";
              break;
            case "The user account has been disabled by an administrator.":
              this.message_false="La cuenta de usuario ha sido desactivada por un administrador.";
                break;
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.message_false="No existe correo.";
                break;
            default:
            this.message_false="Error generico";
          }

          setTimeout(()=>{
            this.false_m = false;
            this.message_false = "";
            }, 5000);


        });
  }
  }

}
