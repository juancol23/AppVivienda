import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.component.html',
  styleUrls: ['./inmueble.component.css']
})
export class InmuebleComponent implements OnInit {
  public data:any=[];
  public user:any={};


  constructor(private router: Router,
    private FirebaseService: FirebaseService,
    private afs: AngularFirestore,private spinner: NgxSpinnerService) {
  }

  ngOnInit() {

    this.getAllUser();
    this.getSolicitud();
    this.spinner.show();





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


  redireccionar(href):void{

    this.router.navigate([href]);
  }

  getSolicitud(){
    this.FirebaseService.getSolicitudesHome().subscribe((res) => {

     this.data=res;


  })






}


}


