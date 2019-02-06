import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit{

  public nombre_perfil: string = ""
  public email_perfil: string = "";
  public telefono_perfil: string ="";
  public foto_perfil: string ="";
  public id:String="";


  public isLogged: boolean = false;

  public _message_perfil: boolean = false;
  public message_text_perfil: String = "";

  public _message_img: boolean = false;
  public message_text_img: String = "";


  selectedFiles: FileList;

  constructor( private authService: AuthService , private FirebaseService: FirebaseService) {

   }



  ngOnInit() {

    this.getCurrentUser();

  }



  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {

      if (auth) {
        this.isLogged = true;
        console.log(auth);
            this.FirebaseService.getUserById(auth.uid).subscribe((res) => {

              this.nombre_perfil=res['name'];
              this.email_perfil=res['email'];
              this.foto_perfil=res["photoUrl"];
              this.telefono_perfil=res["telefono"];

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
            name: this.nombre_perfil,
            telefono: this.telefono_perfil,
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
