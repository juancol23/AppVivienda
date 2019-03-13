import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable,NgZone } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import * as globals from '../globals/globals';

@Component({
  selector: 'app-detail-solicitud',
  templateUrl: './detail-solicitud.component.html',
  styleUrls: ['./detail-solicitud.component.css']
})
export class DetailSolicitudComponent implements OnInit {

  public user:any={};
  public id_solicitud:string;
  public data :any;
  public colors = ['red', 'blue','black'];


  constructor(private router: Router,
    private FirebaseService: FirebaseService,private spinner: NgxSpinnerService,

    private route:ActivatedRoute) { }

  ngOnInit() {





    this.route.params.subscribe(params=>{

      this.id_solicitud = params['id'];

    })

    this.getAllUser();

    this.getSolicitud(this.id_solicitud);



  }

  setDistrito(cod){
    let distrito = globals.DISTRICT_DIRECTION[cod].name
    return distrito
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

}
