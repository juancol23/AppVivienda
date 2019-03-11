import { Component, OnInit,Injectable,NgZone } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { MapsAPILoader } from '@agm/core';
declare var $ :any;
import { AuthService } from '../servicios/auth.service';
import * as globals from '../globals/globals';
import { NgForm } from '@angular/forms';
import {NgbDate, NgbCalendar,NgbDatepickerConfig,NgbDatepickerI18n,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


class RequestDepartment {
	id: string
	value: any
}



const WEEKDAYS_SHORT = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];


@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}


@Component({
  selector: 'app-edit-solicitud',
  templateUrl: './edit-solicitud.component.html',
  styleUrls: ['./edit-solicitud.component.css'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
  ]
})
export class EditSolicitudComponent implements OnInit {

  public id_solicitud:string;
  public id_usuario:string;
  public isLogged: boolean = false;

  public data :any;
  public register:any = {};



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
  public markers:any;

  public colors = ['red', 'blue','black'];
  public distric:any;


  public ub_dis:boolean = true;
  public ub_area:boolean = false;


  public rangeDate:boolean=false;
  public hoveredDate: NgbDate;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public de:Date;
  public hasta:Date;

  public istrue:boolean;



  constructor(private authService: AuthService ,
    private FirebaseService: FirebaseService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,

    private route:ActivatedRoute) {

      config.minDate = calendar.getToday();
     }

  ngOnInit() {

    this.getCurrentUser();
    this.latitude=-12.114090
    this.longitude=-77.027842
    this.zoom=13;

    this.obtenerDepartamentos();
    this.changeCheckbox();


  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        this.id_usuario=auth.uid;



        this.route.params.subscribe(params=>{

          this.id_solicitud = params['id'];



        })

        this.getEdit(this.id_usuario,this.id_solicitud);


      }else {

        this.isLogged = false;


      }
    });
  }



  getEdit(id1,id2){


    this.FirebaseService.geteditSolicitud(id1,id2).subscribe((res)=>{



      if(res.length==0){


      this.data="";

      this.istrue=false;

      this.router.navigate(['/perfil']);


      }else{

        this.istrue = true;

        this.data = res;

      this.register.type_apar=this.data[0]["tipo_departamento"]
      $(`input:radio[name="type_apar"][value=${this.data[0]["tipo_departamento"]}]`).click();

      this.register.operation=this.data[0]["operacion"]
      $(`input:radio[name="operation"][value=${this.data[0]["operacion"]}]`).click();

      this.changeVacacional(this.data[0]["operacion"])

      this.register.door=this.data[0]["cuartos"]
      $(`input:radio[name="door"][value=${this.data[0]["cuartos"]}]`).click();

      this.register.bano=this.data[0]["bano"]
      $(`input:radio[name="bano"][value=${this.data[0]["bano"]}]`).click();

      this.register.cochera=this.data[0]["cochera"]
      $(`input:radio[name="cochera"][value=${this.data[0]["cochera"]}]`).click();


      this.register.vista=this.data[0]["vista"]
      $(`input:radio[name="vista"][value=${this.data[0]["vista"]}]`).click();

      this.register.tipo=this.data[0]["tipo_depa"]
      $(`input:radio[name="tipo"][value=${this.data[0]["tipo_depa"]}]`).click();

      this.register.amoblado=this.data[0]["amoblado"]
      $(`input:radio[name="amoblado"][value=${this.data[0]["amoblado"]}]`).click();

      this.register.estreno=this.data[0]["estreno"]
      $(`input:radio[name="estreno"][value=${this.data[0]["estreno"]}]`).click();

      this.register.proyecto=this.data[0]["proyecto"]
      $(`input:radio[name="proyecto"][value=${this.data[0]["proyecto"]}]`).click();

      this.register.area=this.data[0]["area"]

      this.register.pre_type=this.data[0]["presupuesto"]["moneda"]

      this.register.pre_price=this.data[0]["presupuesto"]["precio"]

      this.register.man_type=this.data[0]["mantenimiento"]["moneda"]

      this.register.man_price=this.data[0]["mantenimiento"]["precio"]

      this.register.comentario=this.data[0]["comentario"]

      this.distric=this.data[0]["distrito"]

      if(this.distric.length==0 ){}else{
        this.ub_dis= true
        this.ub_area= false
        $("#v-pills-home-tab").click();
      }

      this.markers=this.data[0]["radio"]

      if(this.markers.length==0 ){}
      else{

        this.ub_dis= false
        this.ub_area= true
        $("#v-pills-profile-tab").click();
      }


      if(this.data[0]["adicionales"]["terraza"]){
        $(`input:checkbox[name="terraza"]`).prop('checked',true)
        $(`input:checkbox[name="terraza"]`).parent().addClass("pintar");
        this.register.terraza=this.data[0]["adicionales"]["terraza"]
        }else{
        $(`input:checkbox[name="terraza"]`).prop('checked',false)
        this.register.terraza=false
        }



      if(this.data[0]["adicionales"]["mascota"]){
        $(`input:checkbox[name="mascota"]`).prop('checked',true)
        $(`input:checkbox[name="mascota"]`).parent().addClass("pintar");
        this.register.mascota=this.data[0]["adicionales"]["mascota"]
        }else{
        $(`input:checkbox[name="mascota"]`).prop('checked',false)
        this.register.mascota=false
        }

        if(this.data[0]["adicionales"]["deposito"]){

        $(`input:checkbox[name="deposito"]`).prop('checked',true)
        $(`input:checkbox[name="deposito"]`).parent().addClass("pintar");
          this.register.deposito=this.data[0]["adicionales"]["deposito"]
          }else{
            $(`input:checkbox[name="deposito"]`).prop('checked',false)
          this.register.deposito=false
          }

          if(this.data[0]["adicionales"]["ascensor"]){

        $(`input:checkbox[name="ascensor"]`).prop('checked',true)
        $(`input:checkbox[name="ascensor"]`).parent().addClass("pintar");
            this.register.ascensor=this.data[0]["adicionales"]["ascensor"]
            }else{

        $(`input:checkbox[name="ascensor"]`).prop('checked',false)
            this.register.ascensor=false
            }

            if(this.data[0]["adicionales"]["vigilancia"]){

        $(`input:checkbox[name="vigilancia"]`).prop('checked',true)
        $(`input:checkbox[name="vigilancia"]`).parent().addClass("pintar");
              this.register.vigilancia=this.data[0]["adicionales"]["vigilancia"]
              }else{
                $(`input:checkbox[name="vigilancia"]`).prop('checked',false)
              this.register.vigilancia=false
              }

              if(this.data[0]["adicionales"]["servicio"]){

        $(`input:checkbox[name="servicio"]`).prop('checked',true)
        $(`input:checkbox[name="servicio"]`).parent().addClass("pintar");
                this.register.servicio=this.data[0]["adicionales"]["servicio"]
                }else{

        $(`input:checkbox[name="servicio"]`).prop('checked',false)
                this.register.servicio=false
                }

                if(this.data[0]["adicionales"]["dscp"]){

        $(`input:checkbox[name="dscp"]`).prop('checked',true)
        $(`input:checkbox[name="dscp"]`).parent().addClass("pintar");
                  this.register.dscp=this.data[0]["adicionales"]["dscp"]
                  }else{

        $(`input:checkbox[name="dscp"]`).prop('checked',false)
                  this.register.dscp=false
                  }

                  if(this.data[0]["adicionales"]["reunion"]){

        $(`input:checkbox[name="reunion"]`).prop('checked',true)
        $(`input:checkbox[name="reunion"]`).parent().addClass("pintar");
                    this.register.reunion=this.data[0]["adicionales"]["reunion"]
                    }else{

        $(`input:checkbox[name="reunion"]`).prop('checked',false)
                    this.register.reunion=false
                    }

                    if(this.data[0]["adicionales"]["piscina"]){

        $(`input:checkbox[name="piscina"]`).prop('checked',true)
        $(`input:checkbox[name="piscina"]`).parent().addClass("pintar");
                      this.register.piscina=this.data[0]["adicionales"]["piscina"]
                      }else{

        $(`input:checkbox[name="piscina"]`).prop('checked',false)
                      this.register.piscina=false
                      }


                      if(this.data[0]["adicionales"]["gym"]){

        $(`input:checkbox[name="gym"]`).prop('checked',true)
        $(`input:checkbox[name="gym"]`).parent().addClass("pintar");
                        this.register.gym=this.data[0]["adicionales"]["gym"]
                        }else{

        $(`input:checkbox[name="gym"]`).prop('checked',false)
                        this.register.gym=false
                        }

                        if(this.data[0]["adicionales"]["parrilla"]){

        $(`input:checkbox[name="parrilla"]`).prop('checked',true)
        $(`input:checkbox[name="parrilla"]`).parent().addClass("pintar");
                          this.register.parrilla=this.data[0]["adicionales"]["parrilla"]
                          }else{

        $(`input:checkbox[name="parrilla"]`).prop('checked',false)
                          this.register.parrilla=false
                          }

                          if(this.data[0]["adicionales"]["juego"]){

        $(`input:checkbox[name="juego"]`).prop('checked',true)
        $(`input:checkbox[name="juego"]`).parent().addClass("pintar");
                            this.register.juego=this.data[0]["adicionales"]["juego"]
                            }else{

        $(`input:checkbox[name="juego"]`).prop('checked',false)
                            this.register.juego=false
                            }

                          if(this.data[0]["rango"]["de"]=="" || this.data[0]["rango"]["hasta"]==""){



                          }else{

                            let date: NgbDate = new NgbDate(this.data[0]["rango"]["de"].toDate().getFullYear(), this.data[0]["rango"]["de"].toDate().getMonth() + 1, this.data[0]["rango"]["de"].toDate().getDate());
                            let date2: NgbDate = new NgbDate(this.data[0]["rango"]["hasta"].toDate().getFullYear(), this.data[0]["rango"]["hasta"].toDate().getMonth() + 1, this.data[0]["rango"]["hasta"].toDate().getDate());
                            this.fromDate=date
                            this.toDate=date2



                            this.de=this.data[0]["rango"]["de"].toDate()
                            this.hasta=this.data[0]["rango"]["hasta"].toDate()


                          }





      }


    })
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


addDistrito(){
  if(this.register.distrito=="" || this.register.distrito.empty){

    alert("Debe seleccionar un distrito");

  }else{
    /*let departamento =globals.DEPARTMENTS_DIRECTION[this.register.departamento].name;
    let pronvincia =globals.PROVINCE_DIRECTION[this.register.departamento+this.register.provincia].name;
    let distrito = globals.DISTRICT_DIRECTION[this.register.departamento+this.register.provincia+this.register.distrito].name;*/

    let distrito = this.register.departamento+this.register.provincia+this.register.distrito

    if(this.distric.length<3){

      let istrue = this.distric.includes(distrito);

         if(istrue){

          alert("Ya selecciono el distrito.")

         }else{


      this.distric.push(distrito)

         }

    }else{

      alert("Solo puede seleccionar 3 distritos");

    }

  }
}


eliminarItem(indice){

this.distric.splice(indice, 1);


  console.log(this.distric);
}
eliminarItem_mapa(indice){

  this.markers.splice(indice, 1);


  console.log(this.markers);

 }

mapClicked(event){

  var lat = event.coords.lat;
  var lng = event.coords.lng;

  var string = lat+","+lng;

  if(this.markers.length<3){

    this.markers.push(string);

    console.log(this.markers);

  }else{
    alert("Solo puede seleccionar 3 lugares.");
  }

}




change(valor){

if(valor == 'distrito'){

  this.ub_dis= true;
  this.ub_area= false;



}else{

  this.ub_dis= false;
  this.ub_area= true;

}

}



onDateSelection(date: NgbDate) {
if (!this.fromDate && !this.toDate) {
  this.fromDate = date;
} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
  this.toDate = date;

  console.log(this.fromDate,this.toDate);

  this.de =new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
  this.hasta =new Date(this.toDate.year,this.toDate.month-1,this.toDate.day);

  console.log(this.de,this.hasta);
} else {
  this.toDate = null;
  this.fromDate = date;
}
}

isHovered(date: NgbDate) {
return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
}

isInside(date: NgbDate) {
return date.after(this.fromDate) && date.before(this.toDate);
}

isRange(date: NgbDate) {
return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
}

changeVacacional(valor){

this.register.operation=valor;

if(valor == "VACACIONAL"){

  this.rangeDate=true;
  this.fromDate = this.calendar.getToday();
  this.toDate = null;

}else{

  this.rangeDate=false;
  this.fromDate = null;
  this.toDate = null;

}

}

onlyNumber(event) {
  const pattern = /[0-9]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
      event.preventDefault();
  }
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


setDistrito(cod){
  let distrito = globals.DISTRICT_DIRECTION[cod].name
  return distrito
}

editSolicitud(form: NgForm){

  if (this.isLogged) {


    this.register.user=this.id_usuario;
    this.register.inmueble=this.id_solicitud;


      if(this.register.operation =="VACACIONAL"){

        if(this.fromDate==null ||  this.toDate == null){

          alert("Seleccionar rango de fechas");
          return false;

        }else{

          this.register.fromDate = this.de;
          this.register.toDate = this.hasta;

        }
      }else{

         this.register.fromDate = ""
         this.register.toDate = ""
      }



      if(this.ub_dis){

        if(this.distric.length>0){

          this.register.distrito= this.distric;

        }else{

          alert("Debe seleccionar un distrito.");

          return false;

        }

      }else{

        this.register.distrito=[]

      }

      if(this.ub_area){

        if(this.markers.length>0){

          this.register.radius=this.markers;


        }else{

           alert("Debe seleccionar una area.");
           return false;
        }

      }else{

        this.register.radius=[];

      }


      this.FirebaseService.edit_solicitud(this.register).then((res) =>{

        $(".modal-edit").modal('show');

     }).catch((err)=>

       alert("error")

     );


    return false;


  }else {

    $("#exampleModalCenter").modal('show');

  }

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
