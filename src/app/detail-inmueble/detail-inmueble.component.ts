import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable,NgZone } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import * as globals from '../globals/globals';

declare var $ :any;

@Component({
  selector: 'app-detail-inmueble',
  templateUrl: './detail-inmueble.component.html',
  styleUrls: ['./detail-inmueble.component.css']
})
export class DetailInmuebleComponent implements OnInit {

  public user:any={};
  public id_solicitud:string;
  public data :any;
  public posicion : any;
  public imageurl :any;


  constructor(private router: Router,
    private FirebaseService: FirebaseService,private spinner: NgxSpinnerService,

    private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params=>{

      this.id_solicitud = params['id'];

    })

    this.getAllUser();

    this.getInmueble(this.id_solicitud);

    window.onkeyup = function (event) {
      if (event.keyCode == 27) {
        $(".visualizar").removeClass("mostrar");
      }
     }



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

getInmueble(id){

  this.spinner.show();

  this.FirebaseService.getInmueblebyId(id).subscribe((res) => {


   if(res.length==0){

    this.data="";


    this.router.navigate(['/home']);


    }else{

    this.data=res;
    console.log(this.data)

    }

})
}

backButton(){

  window.history.back();
}

setDistrito(cod){
  let distrito = globals.DISTRICT_DIRECTION[cod].name
  return distrito
}

setprovincia(cod){

    let setear= cod.substr(0,4)

    let name = globals.PROVINCE_DIRECTION[setear].name

    return name
}

abrirImagen(pos){
  $(".visualizar").addClass("mostrar");


  this.posicion=pos;

  this.imageurl=this.data[0]["image"][pos]["url"];

  console.log(this.data[0]["image"][pos]["url"]);

}

cerrra_visualizar(){
  $(".visualizar").removeClass("mostrar");
}

btn_galeria(valor){

  let count = this.data[0]["image"].length;

  if(valor== 'l' && this.posicion==0){
    return false;
  }
   if(valor == 'r' && this.posicion==count-1){
    return false;
   }

  if(valor=='l'){
    this.posicion=this.posicion-1;

     this.imageurl=this.data[0]["image"][this.posicion]["url"];
  }

  if(valor=='r'){
    this.posicion=this.posicion+1;

    this.imageurl=this.data[0]["image"][this.posicion]["url"];
  }


}

}
