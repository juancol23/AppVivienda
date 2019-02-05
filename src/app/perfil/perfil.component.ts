import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import * as _ from "lodash";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public nombre_perfil: string = null;
  public nombre_perfil_principal: string = null;
  public email_perfil: string = null;
  public telefono_perfil: string = null;
  public foto_perfil: string = null;
  public isLogged: boolean = false;

  public _message_perfil: boolean = false;
  public message_text_perfil: String = "";

  public _message_img: boolean = false;
  public message_text_img: String = "";

  constructor( private authService: AuthService , private FirebaseService: FirebaseService) { }
  
  selectedFiles: FileList;

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        
        console.log(auth);
         
        this.FirebaseService.getUserById(auth.uid).subscribe((result) => {
          
          this.nombre_perfil=result["name"];
          this.email_perfil=result["email"];
          this.foto_perfil=result["photoUrl"];
          this.telefono_perfil=result["telefono"];
        
        })
        

      }else {
        this.isLogged = false;
      }
    });
  }

  onUpdatePerfilUser(): void {

    this.authService.isAuth().subscribe(auth => {

      if (auth) {
        auth.updateProfile({
        displayName: this.nombre_perfil,
        photoURL: auth.photoURL

      }).then((res) => {

        this.FirebaseService.updatePerfil(
          {
            displayName: this.nombre_perfil,
            phoneNumber: this.telefono_perfil,
            photoUrl: auth.photoURL,
            email:auth.email,
            id:auth.uid
          }).then((res) =>{


             this._message_perfil = true;
             this.message_text_perfil = "Se actualizaron los datos correctamente.";

             setTimeout(()=>{
             this._message_perfil = false;
             this.message_text_perfil = "";
             }, 5000);


          }).catch((err)=>

                console.log(err.message)

          );

      }).catch((err) => console.log(err.message));
    }
    });
  }

detectFiles(event) {
    this.selectedFiles = event.target.files;
}

uploadSingle() {
  this.authService.isAuth().subscribe(auth => {

    let file = this.selectedFiles.item(0);

    this.FirebaseService.uploadImage({
      name   : file.name,
      imagen : file,
      id     : auth.uid

    }).then((res) => {
       
      res.ref.getDownloadURL().then((url) => {

        auth.updateProfile({
          displayName: auth.displayName,
          photoURL: url
        }).then((resp) => {

          this.FirebaseService.updatePhotoUrl({
            image:url,
            id:auth.uid

          });


          this._message_img = true;
          this.message_text_img = "Se actualizo foto de perfil";

          setTimeout(()=>{
          this._message_img = false;
          this.message_text_img = "";
          }, 5000);
      
          
        }).catch((err) => console.log(err.message));
       
      }).catch((err) => console.log(err.message));
      
    }).catch((err) => console.log(err.message));
  
  })
  
 
}










}
