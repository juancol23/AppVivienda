import { Component, OnInit,NgZone,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgbDate, NgbCalendar,NgbDatepickerConfig,NgbDatepickerI18n,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


import * as globals from '../globals/globals';
import { style } from '@angular/animations';

declare var $ :any;

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
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
  ]
})
export class SolicitudComponent implements OnInit {

  public data:any=[];
  public user:any={};

  public register:any = {};
  public p: number;


  public isvacacional:boolean=true;
  public rangeDate:boolean=false;

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



  public hoveredDate: NgbDate;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public de:Date;
  public hasta:Date;

  constructor(
    private FirebaseService: FirebaseService,
    private router: Router,
    private ngZone: NgZone,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig) {


    config.minDate = calendar.getToday();
    }

  ngOnInit() {

    this.getAllUser();
    this.getSolicitud();
    this.p=1;
    this.obtenerDepartamentos();

    $(".ngb-dp-months ").css("display", "block");
  }


  getSolicitud(){
    this.FirebaseService.getSolicitudesAll().subscribe((res) => {

     this.data=res;


  })

}


getAllUser(){



  this.FirebaseService.getallUser().subscribe((res) => {
   let name = "";

      for (let index = 0; index < res.length; index++) {

        name = res[index]["name"].split(" ");
        this.user[res[index]["id"]]=name[0].toUpperCase();

      }

      localStorage.setItem("users",  JSON.stringify(this.user));



  });


}

changeVacacional(valor){

  this.register.operation=valor;

  if(valor == "VACACIONAL"){

    this.rangeDate=true;

  }else{

    this.rangeDate=false;

  }

}

changeExit(valor){

  this.register.type_apar=valor;

  this.changeVacacional('ALQUILER');

  $('input:radio[name="operation"][value="ALQUILER"]').click();

  if(valor == "OFICINA" || valor == "TERRENO" ){


    this.isvacacional=false;


  }else{

    this.isvacacional=true;

  }

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



onDateSelection(date: NgbDate) {
  if (!this.fromDate && !this.toDate) {
    this.fromDate = date;
  } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
    this.toDate = date;
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



}
