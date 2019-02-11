import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { inmuebleInterface } from '../models/inmueble';

@Component({
  selector: 'app-register-inmueble',
  templateUrl: './register-inmueble.component.html',
  styleUrls: ['./register-inmueble.component.css']
})
export class RegisterInmuebleComponent implements OnInit {

  public register:any = {};

  constructor() { }

  ngOnInit() {
    this.register.type_apar="Departamento"
    this.register.operation="Alquiler"
    this.register.door="1"
    this.register.bano="1"
    this.register.cochera="1"
    this.register.vista="Interna"
    this.register.tipo="Flat"
    this.register.amoblado="Full"
    this.register.man_type="Soles"
    this.register.pre_type="Soles"
    this.register.proyecto="Si"
    this.register.estreno="Si"
  }


  onlyNumber(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}

  registerInmueble(form: NgForm){



    console.log(JSON.stringify(this.register));
  }

}
