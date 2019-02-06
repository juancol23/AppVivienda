import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
declare var $ :any;
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {




  constructor( private authService: AuthService) { }

public email: string = null;

public true_m: boolean = false;
public message_true: String = "";
public false_m: boolean = false;
public message_false: String = "";
    


  ngOnInit() {

    $("#exampleModalCenter").hide();
    $(".modal-backdrop").hide();

  }
    


  
  resetPasswordEmail(form: NgForm): void {
    this.authService.resetPassword(this.email)
      .then((res) => {

        this.true_m = true;
        this.message_true="Verificar tu correo electrónico.";
         
        setTimeout(()=>{
          this.true_m = false;
          this.message_true = "";
          }, 5000);

        form.reset();

      }).catch(
        err => {

          this.false_m = true;

          switch (err["message"]) {
            case "The email address is badly formatted.":
              this.message_false="La dirección de correo electrónico está mal formateada.";
              break;
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.message_false="No existe correo electrónico.";
                break;
            case 'sendPasswordResetEmail failed: First argument "email" must be a valid string.':
              this.message_false="Ingresar correo electrónico.";
              break
            default:
            this.message_false="Error.";
          }

          setTimeout(()=>{
            this.false_m = false;
            this.message_false = "";
            }, 5000);


        });
  
  }

}
