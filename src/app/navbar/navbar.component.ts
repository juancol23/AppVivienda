import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { User } from 'firebase/app';
import { UserInterface } from '../models/user';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService , private FirebaseService: FirebaseService) { }
  public email_login: string = null;
  public password_login: string = null;
  public email_registro: string = null;
  public nombre_registro: string = null;
  public password_registro: string = null;
  public password_registro_2: string = null;
  public idUser: string = null;
  public nameUser: string=null;
  public isLogged: boolean = false;


  ngOnInit() {

    this.getCurrentUser();


  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        this.idUser = auth.uid;
        this.FirebaseService.getUserById(this.idUser).subscribe((result) => {
          let name= result["name"].split(" ");

          if(name.length==1){
            this.nameUser=`${name[0]}`;
          }else if(name.length>=2){
            this.nameUser=`${name[0]} ${name[1]} `;
          }

        })
      } else {
        this.isLogged = false;
      }
    });
  }



  onAddUser() {
    if(this.password_registro==this.password_registro_2){

      this.authService.registerUser(this.email_registro, this.password_registro)
      .then((res) => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
              user.updateProfile({
              displayName: this.nombre_registro,
              photoURL: "assets/img/foto_perfil.jpg"
            }).then((res) => {


               this.router.navigate(['perfil']);

            }).catch((err) => alert(err.message));
          }
        });
        console.log(res);
        this.router.navigate(['perfil']);
      }).catch(err => alert(err.message));

    }else{

      alert("Las contraseñas no coinciden");

    }

  }

  onLogin(): void {
    this.authService.loginEmailUser(this.email_login, this.password_login)
      .then((res) => {
        this.router.navigate(['perfil']);
      }).catch(
        err => alert(err.message));
  }

  onLoginFacebook(): void {
    this.authService.loginFacebookUser().then(
      (success) => {
      this.router.navigate(['perfil']);
      }
    ).catch(
       err => alert(err.message));
  }


  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
  }



}
