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

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }
  public email_login: string = '';
  public password_login: string = '';
  public isLogged: boolean = false;
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

  onLogin(): void {
    this.authService.loginEmailUser(this.email_login, this.password_login)
      .then((res) => {
        this.router.navigate(['perfil']);
      }).catch(err => console.log('err', err.message,'Credenciales incorrectas'));
  }

  

  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
  }

 



  

}
