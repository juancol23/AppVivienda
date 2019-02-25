import { Component, OnInit,ElementRef,ViewChild,NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';
import * as globals from '../globals/globals';
import { MapsAPILoader } from '@agm/core';
declare var google;
declare var $ :any;
class RequestDepartment {
	id: string
	value: any
}

@Component({
  selector: 'app-register-inmueble',
  templateUrl: './register-inmueble.component.html',
  styleUrls: ['./register-inmueble.component.css']
})
export class RegisterInmuebleComponent implements OnInit {

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
  public latitude_m: number;
  public longitude_m: number;
  public zoom:number;

  @ViewChild("search")
  public searchElementRef: ElementRef;





  constructor(private authService: AuthService ,
     private FirebaseService: FirebaseService,
     private router: Router,
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone) { }

  ngOnInit() {
    this.reset();
    this.obtenerDepartamentos();
    this.getCurrentUser();
    this.zoom=12;

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"],
        componentRestrictions: { country: 'PE'}
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.latitude_m = place.geometry.location.lat();
          this.longitude_m = place.geometry.location.lng();

          this.zoom=15;

          this.register.latitud=this.latitude
          this.register.longitud=this.longitude




        });
      });
    });


     this.changeCheckbox();


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
    this.register.bano="NO"
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
    this.register.direccion=""
    this.latitude=-12.114090
    this.longitude=-77.027842
    this.latitude_m = null
    this.longitude_m = null

    this.register.latitud= null
    this.register.longitud= null

    $(".chb").removeClass("pintar");

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
        this.register.departamento_=globals.DEPARTMENTS_DIRECTION[this.register.departamento].name;
        this.register.provincia_=globals.PROVINCE_DIRECTION[this.register.departamento+this.register.provincia].name;
        this.register.distrito_=globals.DISTRICT_DIRECTION[this.register.departamento+this.register.provincia+this.register.distrito].name;

      if(this.register.latitud== null || this.register.longitud==null){
        alert("Debe buscar direccion");
        return false;
      }

        this.FirebaseService.register_inmueble(this.register).then((res) =>{

          form.reset();
          this.reset();
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

  changeCheckbox(){


    //Ten en cuenta que estamos seleccionando por clase label-cliente. Como estamos jugando con los children (en este caso los input) no deberías tener problemas si tienes varios label/input pero tenlo en cuenta.
    $(".chb").click(function(){
      //Si el hijo está checked le ponemos a la label el color #2d89ef si no el #5e5e5e
      if($(this).children().is(":checked"))
      {
        $(this).addClass("pintar");
      }
      else
      {
        $(this).removeClass("pintar");
      }
    });

  }



}
