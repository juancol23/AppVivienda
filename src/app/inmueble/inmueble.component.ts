import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { map } from 'rxjs/internal/operators/map';
@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.component.html',
  styleUrls: ['./inmueble.component.css']
})
export class InmuebleComponent implements OnInit {
  public data:any=[];
  public latitude: number;
  public longitude: number;
  public is_radio:boolean;
  public not_radio:boolean;
  constructor(private router: Router,
    private FirebaseService: FirebaseService) {



  }

  ngOnInit() {

    this.is_radio = true;
    this.not_radio=false;
    this.getSolicitud();

  }


  redireccionar(href):void{

    this.router.navigate([href]);
  }

  getSolicitud(){
    let name = "";
    let array=[]
    this.FirebaseService.getSolicitudesHome().subscribe((res) => {

     this.data=res;

     for (let index = 0; index < this.data.length; index++) {


      this.FirebaseService.getUserById(res[index]["id_user"]).subscribe((res) =>{

        name = res["name"].split(" ")
        this.data[index]["nombre"]=name[0].toUpperCase();;

      })
  }


  })



}


}


