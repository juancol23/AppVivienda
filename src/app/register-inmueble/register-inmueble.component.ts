import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';

declare var $ :any;

@Component({
  selector: 'app-register-inmueble',
  templateUrl: './register-inmueble.component.html',
  styleUrls: ['./register-inmueble.component.css']
})
export class RegisterInmuebleComponent implements OnInit {

  public register:any = {};
  public isLogged: boolean = false;
  public user:string;




  constructor(private authService: AuthService , private FirebaseService: FirebaseService,private router: Router) { }

  ngOnInit() {
    this.reset();

    this.getCurrentUser();

  }


  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log(this.isLogged);
        this.user=auth.uid;

      }else {
        this.isLogged = false;
        console.log(this.isLogged);
        this.user="";
      }
    });
  }

  reset(){
    this.register.type_apar="DEPARTAMENTO"
    this.register.operation="ALQUILER"
    this.register.door="1"
    this.register.bano="1"
    this.register.cochera="1"
    this.register.vista="INTERNA"
    this.register.tipo="FLAT"
    this.register.amoblado="FULL"
    this.register.man_type="SOLES"
    this.register.pre_type="SOLES"
    this.register.proyecto="SI"
    this.register.estreno="SI"
    this.register.terraza=false
    this.register.mascota=false
    this.register.deposito=false
    this.register.ascensor=false
    this.register.vigilancia=false
    this.register.servicio=false
    this.register.dscp=false
    this.register.reunion=false
    this.register.piscina=false
    this.register.gym=false
    this.register.parrilla=false
    this.register.juego=false
    this.register.departamento="LIMA"
    this.register.distrito="MIRAFLORES"
    this.register.area=""
    this.register.pre_price=""
    this.register.man_price=""
    this.register.direccion=""
    this.register.latitud=-12.114090;
    this.register.longitud=-77.027842;
    

  }

  onlyNumber(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}
onlyDireccion(event) {
  const pattern = /[a-zA-ZñÑ 0-9.-]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}


  registerInmueble(form: NgForm){

 
      if (this.isLogged) {

        this.register.fecha=new Date();
        this.register.user=this.user;

        this.FirebaseService.register_inmueble(this.register).then((res) =>{

          this.reset()
          $("#modal_ok").modal('show');

       }).catch((err)=>

         alert("error")

       );


      }else {

        $("#exampleModalCenter").modal('show');

      }



  }


  cerrar():void{

    $("#modal_ok").hide();
    $(".modal-backdrop").hide();

    this.router.navigate(['perfil']);
  }

}
