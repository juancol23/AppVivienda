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
  public latitude: number;
  public longitude: number;
  public is_radio:boolean;
  public not_radio:boolean;
  public istrue:boolean = false;


  constructor(private router: Router,
    private FirebaseService: FirebaseService,
    private afs: AngularFirestore,private spinner: NgxSpinnerService) {



  }

  ngOnInit() {

    this.is_radio = true;
    this.not_radio=false;
    this.getAllUser();
    this.getSolicitud();
    this.spinner.show();

   /* this.afs.firestore.collection(`users`).onSnapshot(function(querySnapshot) {
      var cities = {};
      console.log(querySnapshot.size);
      console.log("Current cities in CA: ", cities);
    });*/



  }



  getAllUser(){



      this.FirebaseService.getallUser().subscribe((res) => {

          console.log("No existe");

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


