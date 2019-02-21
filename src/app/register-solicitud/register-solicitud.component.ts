import { Component, OnInit,ElementRef,ViewChild,NgZone } from '@angular/core';
import * as globals from '../globals/globals';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { MouseEvent } from '@agm/core';
declare var google;
declare var $ :any;

class RequestDepartment {
	id: string
	value: any
}

interface marker {
  id:number;
  nombre:string;
	lat: number;
  lng: number;
  color: string;
}


@Component({
  selector: 'app-register-solicitud',
  templateUrl: './register-solicitud.component.html',
  styleUrls: ['./register-solicitud.component.css']
})
export class RegisterSolicitudComponent implements OnInit {

  public register:any = {};
  public isLogged: boolean = false;
  public user:string;


  public objDepart: any;
	public keyDeparts: string[];
  public selectDepart: any;
  public departSeleccionado  = 0;

  public objProvs: any;
	public showProvs = new Array();
	public keyProvs: string[];
	public selectProv: any;
  public proviSeleccionado = 0;

  public objDists: any;
	public showDists = new Array();
	public selectDistric: any;
	public keyDistrs: string[];
  public districSeleccionado = 0;

  public latitude: number;
  public longitude: number;
  public zoom:number;
  public markers: marker[]=[];
  public colors = ['red', 'blue', 'yellow', 'orange', 'black', 
        'gray', 'lightblue', 'purple', 'green'];
  

  constructor(private authService: AuthService ,
    private FirebaseService: FirebaseService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.getCurrentUser();
    this.reset();
    this.obtenerDepartamentos();

    $('.show_dis').on('click', '.dis-d', function(e){
      e.preventDefault();
      $(this).parent('div').remove();

  }); 

 
  }
  
 

 
  mapClicked(event){

    var lat = event.coords.lat;
    var lng = event.coords.lng;

    if(this.markers.length<3){
      let count = this.markers.length+1;
      this.markers.push({
        id: this.markers.length,
        nombre: "Area "+ count,
        lat: lat,
        lng: lng,
        color:this.colors[Math.floor(Math.random() * this.colors.length)]
      });
  
      console.log(this.markers);

    }else{
      console.log("solo puede seleccionar 3 lugares.");
    }

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
    this.register.departamento=""
    this.register.distrito=""
    this.register.provincia=""
    this.register.area=""
    this.register.pre_price=""
    this.register.man_price=""
    this.latitude=-12.114090;
    this.longitude=-77.027842;
    this.zoom=14;
  }


  sortByTwoProperty = () => {
		return (x, y) => {
			return ((x["value"]["name"] === y["value"]["name"]) ? 0 : ((x["value"]["name"] > y["value"]["name"]) ? 1 : -1));
		}
  }

  sortByProperty = (property) => {
		return (x, y) => {
			return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
		}
	}

  obtenerDepartamentos() {
    this.objDepart = globals.DEPARTMENTS_DIRECTION;
		let arrayDepartments: RequestDepartment[] = Array()
		this.keyDeparts = []
		for (let i in this.objDepart) {
			let obj = new RequestDepartment()
			obj.id = i
			obj.value = this.objDepart[i]
			arrayDepartments.push(obj)
		}
		arrayDepartments.sort(this.sortByTwoProperty())
		for (let i = 0; i < arrayDepartments.length; i++) {
			this.keyDeparts.push(arrayDepartments[i]["id"])
		}
  }

  selDepart() {
		this.selectDepart = document.getElementById("department");
    this.departSeleccionado = this.selectDepart.value;
    this.listarProvincias(this.departSeleccionado);

    this.selCity();


	}

  listarProvincias(skuDep) {
    this.objProvs = globals.PROVINCE_DIRECTION;
		this.showProvs.length = 0;
		this.keyProvs = Object.keys(this.objProvs);
		this.keyProvs.forEach((item, index) => {
			if (this.objProvs[item].skuDep == skuDep) {
				this.showProvs.push(this.objProvs[item]);
			}

		})
  }

  selCity() {

		this.selectProv = document.getElementById("city");
    this.proviSeleccionado = this.selectProv.value;
    this.listarDistritos(this.departSeleccionado + this.proviSeleccionado);



  }

  listarDistritos(skuDepPro) {

    this.objDists = globals.DISTRICT_DIRECTION;
		this.showDists.length = 0;
		this.keyDistrs = Object.keys(this.objDists);
		this.keyDistrs.forEach((item, index) => {

			if (this.objDists[item].skuDepPro == skuDepPro) {
				this.showDists.push(this.objDists[item]);

			}
			this.showDists.sort(this.sortByProperty("name"))
		})

  }

  selDistrict() {
		this.selectDistric = document.getElementById("district");
    this.districSeleccionado = this.selectDistric.value;
	}


  addDistrito(){
    if(this.register.distrito==""){

      alert("vacio");

    }else{

      let distrito = globals.DISTRICT_DIRECTION[this.register.departamento+this.register.provincia+this.register.distrito].name;
      let count = $(".show_dis .col-4 a").toArray().length;
      let input = "<div class='col-4' style='padding:0px'><a href='javascript:void(0)' title='Eliminar Distrito' class='dis-d' id='dis"+count+"' >"+distrito+"</a></div>"
      let encontro = $(".show_dis .col-4 a").text().indexOf(distrito);

      if(count<3){

             if(encontro == - 1){
               $(".show_dis").append(input);

               
             
             }else{
               alert("ya selecciono dsitrito");
             }

      }else{
        alert("3 distritos;")
      }

      
    }
  }  
 
  
  
  



}
