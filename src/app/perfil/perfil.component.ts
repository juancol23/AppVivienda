import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public nombre_perfil: string = null;
  public email_perfil: string = null;
  public telefono_perfil: string = null;
  public foto_perfil: string = null;
  public isLogged: boolean = false;

  constructor( private authService: AuthService , private FirebaseService: FirebaseService) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        this.FirebaseService.getUserById(auth.uid).subscribe((result) => {

          this.nombre_perfil=result["name"];
          this.telefono_perfil=result["telefono"];
          this.email_perfil=auth.email;
          this.foto_perfil=result["photoUrl"];

        });

      }else {
        this.isLogged = false;
      }
    });
  }


}
