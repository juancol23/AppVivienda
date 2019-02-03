import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private _modaAuth:boolean = true;
  public email_login: string = '';
  public password_login: string = '';
  public isLogged: boolean = false;

  constructor(
    public afAuth: AngularFireAuth, 
    private router: Router, 
    private authService: AuthService) { }

  


  ngOnInit() {
     
  
    this.getCurrentUser();
  }
   
  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        console.log('Usuario logueado');
        this.isLogged = true;  
      } else {
        console.log('Usuario no logueado');
        this.isLogged = false;
      }
    });
  }

  modalAuth(){
    var el = document.getElementsByClassName("modal-backdrop");
    el[0].setAttribute('style', 'display:block');
    this._modaAuth=true;
  }

  onLogin(): void {
    this.authService.loginEmailUser(this.email_login, this.password_login)
      .then((res) => {
          
        var el = document.getElementsByClassName("modal-backdrop");
        // el[0].setAttribute('style', 'display:none');
       
        for(var _i = 0; _i < el.length;_i++){
          el[_i].setAttribute('style', 'display:none'); 
        }
      
        
        this._modaAuth = false; 
         console.log(el.item)
         console.log(el.length)
 
        this.router.navigate(['perfil']);

      }).catch(err => console.log('err', err.message,'Credenciales incorrectas'));
  }

  

  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
  }

 



  

}
