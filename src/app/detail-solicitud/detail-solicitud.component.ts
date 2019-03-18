import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable,NgZone } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import * as globals from '../globals/globals';
import { AuthService } from '../servicios/auth.service';

declare var $ :any;


@Component({
  selector: 'app-detail-solicitud',
  templateUrl: './detail-solicitud.component.html',
  styleUrls: ['./detail-solicitud.component.css']
})


export class DetailSolicitudComponent implements OnInit {

  public user:any={};
  public id_solicitud:string;
  public data :any;

  public arrayInmueble:any=[];
  public colors = ['red', 'blue','black'];

  public filtro:any;


  public isLogged: boolean = false;
  public id_user_inmueble:string;


  constructor(
    private authService: AuthService ,
    private router: Router,
    private FirebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute)
  {}

  ngOnInit() {




    this.route.params.subscribe(params=>{

      this.id_solicitud = params['id'];

    })

    this.getAllUser();

    this.getSolicitud(this.id_solicitud);

    this.getCurrentUser();


  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        this.id_user_inmueble=auth.uid;

      }else {
        this.isLogged = false;
        this.id_user_inmueble="";
      }
    });
  }


  backButton(){

    window.history.back();
  }

  setDistrito(cod){
    let distrito = globals.DISTRICT_DIRECTION[cod].name
    return distrito
  }

  setfecha(fecha){

    return fecha.toDate();
  }

  getAllUser(){


    this.FirebaseService.getallUser().subscribe((res) => {
     let name = "";

        for (let index = 0; index < res.length; index++) {

          name = res[index]["name"].split(" ");
          this.user[res[index]["id"]]=name[0].toUpperCase();

        }

        localStorage.setItem("users",  JSON.stringify(this.user));

        this.spinner.hide();
    });


}


getSolicitud(id){

  this.spinner.show();

  this.FirebaseService.getSolicitudesbyId(id).subscribe((res) => {


   if(res.length==0){

    this.data="";


    this.router.navigate(['/home']);


    }else{

    this.data=res;

    this.filtro={
      ordenar:'desc',
      id_user:'',
      tipo_departamento:this.data[0].tipo_departamento,
      operacion:this.data[0].operacion,
      cuartos:this.data[0].cuartos,
      bano:this.data[0].bano,
      cochera:this.data[0].cochera,
      vista:this.data[0].vista,
      tipo_depa:this.data[0].tipo_depa,
      amoblado:this.data[0].amoblado,
      estreno:this.data[0].estreno,
      proyecto:this.data[0].proyecto,
      area:this.data[0].area,
      presupuesto:this.data[0].presupuesto,
      mantenimiento:this.data[0].mantenimiento,
      distrito:this.data[0].distrito,
      radio:this.data[0].radio,
      ascensor:this.data[0].adicionales.ascensor,
      deposito:this.data[0].adicionales.deposito,
      dscp:this.data[0].adicionales.dscp,
      gym:this.data[0].adicionales.gym,
      juego:this.data[0].adicionales.juego,
      mascota:this.data[0].adicionales.mascota,
      parrilla:this.data[0].adicionales.parrilla,
      piscina:this.data[0].adicionales.piscina,
      reunion:this.data[0].adicionales.reunion,
      servicio:this.data[0].adicionales.servicio,
      terraza:this.data[0].adicionales.terraza,
      vigilancia:this.data[0].adicionales.vigilancia
    }

    console.log(this.filtro);



    }

})
}

setmapalat(coordenadas){

  let mapa= coordenadas.split(',');

   return parseFloat(mapa[0]);

 }

 setmapalon(coordenadas){

   let mapa= coordenadas.split(',');

    return parseFloat(mapa[1]);

  }

  match(){

    if (this.isLogged) {

      this.filtro["id_user"]=this.id_user_inmueble;



      /*if(this.id_user_inmueble==this.data[0].id_user){

        alert("No puede postular a una misma solicitud");
        return false
      }*/

      this.FirebaseService.getMatch(this.filtro).subscribe((res)=>{

        if(res.length>0){

     this.arrayInmueble=res


     this.arrayInmueble = this.arrayInmueble.filter(elem => elem.tipo_departamento == this.filtro["tipo_departamento"]);
     this.arrayInmueble = this.arrayInmueble.filter(elem => elem.operacion == this.filtro["operacion"]);
     this.arrayInmueble = this.arrayInmueble.filter(elem => elem.cuartos  >= this.filtro["cuartos"] );
     this.arrayInmueble = this.arrayInmueble.filter(elem => elem.bano  >= this.filtro["bano"] );

     if(this.filtro["cochera"]=='NO'){
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.cochera == this.filtro["cochera"] );
     }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.cochera  >= this.filtro["cochera"] );
     }

     if(this.filtro["vista"]=='INDISTINTO'){

    }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.vista == this.filtro["vista"] );
    }

    if(this.filtro["tipo_depa"]=='INDISTINTO'){

    }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.tipo_depa == this.filtro["tipo_depa"] );
    }

    if(this.filtro["amoblado"]=='INDISTINTO'){

    }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.amoblado == this.filtro["amoblado"] );
    }
    if(this.filtro["estreno"]=='INDISTINTO'){

    }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.estreno == this.filtro["estreno"] );
    }
    if(this.filtro["proyecto"]=='INDISTINTO'){

    }else{
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.proyecto == this.filtro["proyecto"] );
    }

    this.arrayInmueble = this.arrayInmueble.filter(elem =>elem.area  <=  this.filtro["area"]   );

    this.arrayInmueble = this.arrayInmueble.filter(elem =>elem.presupuesto.precio  <=  this.filtro["presupuesto"].precio  );
    this.arrayInmueble = this.arrayInmueble.filter(elem =>elem.mantenimiento.precio  <=  this.filtro["mantenimiento"].precio   );

    if(this.filtro["terraza"] ==true ){
      this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.terraza == this.filtro["terraza"] );
    }

  if(this.filtro["dscp"]==true  ) {
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.dscp == this.filtro["dscp"] );
  }

  if(this.filtro["gym"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.gym == this.filtro["gym"] );

  }

  if(this.filtro["juego"]==true){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.juego == this.filtro["juego"] );

  }

  if(this.filtro["mascota"]==true  ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.mascota == this.filtro["mascota"] );

  }

  if(this.filtro["parrilla"]==true   ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.parrilla == this.filtro["parrilla"] );

 }

  if(this.filtro["piscina"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.piscina == this.filtro["piscina"] );

  }

  if(this.filtro["reunion"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.reunion == this.filtro["reunion"] );

  }

  if(this.filtro["servicio"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.servicio == this.filtro["servicio"] );

  }

  if(this.filtro["vigilancia"]==true){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.vigilancia == this.filtro["vigilancia"] );

  }

  if(this.filtro["deposito"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.deposito == this.filtro["deposito"] );

  }

  if(this.filtro["ascensor"]==true ){
    this.arrayInmueble = this.arrayInmueble.filter(elem => elem.adicionales.ascensor == this.filtro["ascensor"] );

  }

  if(this.filtro["distrito"]!=[]){

    this.arrayInmueble = this.arrayInmueble.filter(elem => this.filtro["distrito"].includes(elem.coddireccion));

  }else{

    console.log("sin filtro");
  }


        }else{

          console.log("Registrar Inmueble")

        }

        console.log(this.arrayInmueble);
      })


    }else{

      $("#exampleModalCenter").modal('show');

    }

  }

}
