import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  styles:[
  ]
})

export class PerfilComponent implements OnInit{

  public photo_profile: string =null;
  public name_profile: string =null;

  public isLogged: boolean = false;
  public typeUser: boolean = false;

  public modelProfile:any = {};
  public modelPassword: any = {};
  public error:any={};

  public data:any;


  public _message_perfil: boolean = false;
  public message_text_perfil: String = null;

  public _message_img: boolean = false;
  public message_text_img: String = null;


  public message_c_valid:boolean = false;
  public message_text_contra: String = null;

  public latitud:string;
  public longitud:string;


  //public formPerfilContrasena: NgForm;

  selectedFiles: FileList;

  constructor( private authService: AuthService ,
    private mapsAPILoader: MapsAPILoader, private FirebaseService: FirebaseService,private router: Router) {

  }



  ngOnInit() {

    this.getCurrentUser();
    this.getInmueble();
  }



  getInmueble(){

    this.authService.isAuth().subscribe(auth => {
      if (auth) {


            this.FirebaseService.getInmuebles(auth.uid).subscribe((res) => {
              this.data=res;
            })

      }else {

      }
    });
  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        if(auth.providerData[0].providerId=="facebook.com"){
          this.typeUser=true;
        }

            this.FirebaseService.getUserById(auth.uid).subscribe((res) => {
              this.modelProfile.nameProfile=res['name'];
              this.name_profile=res['name'];
              this.modelProfile.email=res['email'];
              this.modelPassword.email=res['email'];
              this.photo_profile=res["photoUrl"];
              this.modelProfile.phoneNumber=res["telefono"];
            })

      }else {
        this.isLogged = false;
      }
    });
  }


onlyText(event) {
    const pattern = /[a-zA-ZñÑ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}


onlyNumber(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}


onUpdatePassword(form: NgForm):void{

  this.FirebaseService.verifyPassword(this.modelPassword.email,this.modelPassword.password,this.modelPassword.passwordNew)
  .then(

    success=> {
      this.message_c_valid= true,
      this.error.message="success",
      this.message_text_contra = success+"",
      form.reset(),
      setTimeout(()=>{
        this.message_c_valid = false;
        this.error.message = "";
        }, 5000);
    }

  ).catch(
    err=> {
      this.message_c_valid= true,
      this.error.message="error",
      this.message_text_contra = err+""
    }
  );




}



  onUpdatePerfilUser(): void {

    this.authService.isAuth().subscribe(auth => {

      if (auth) {

        auth.updateProfile({
        displayName: this.modelProfile.nameProfile,
        photoURL: auth.photoURL

      }).then((res) => {

        this.FirebaseService.updatePerfil(
          {
            name: this.modelProfile.nameProfile,
            telefono: this.modelProfile.phoneNumber,
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
