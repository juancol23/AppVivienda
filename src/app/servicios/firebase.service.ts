import { Injectable, Pipe } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { inmuebleInterface } from '../models/inmueble';
import { SolicitudInterface } from '../models/solicitud';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Query } from '@firebase/firestore-types'
import { firestore } from 'firebase';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  task: AngularFireUploadTask;

  userCollection: AngularFirestoreCollection<UserInterface>;
  user: Observable<UserInterface[]>;
  userDoc: AngularFirestoreDocument<UserInterface>;


  items: Observable<any[]>;
  itemsCollection: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore,private afStorage: AngularFireStorage,private afsAuth: AngularFireAuth) {


  }

  uploadImage(event) {

    return this.task = this.afStorage.upload(`users/${event.id}/${event.name}`, event.imagen);
    /*this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();
    this.downloadURL = this.afStorage.ref(`users/${event.id}/${event.name}`).getDownloadURL();

    return this.downloadURL;*/


  }

  getUserById(uid){
     return this.afs.collection(`users`).doc(`${uid}`).valueChanges();
  }

getUserByEmail(email){

  return this.afs.collection(`users`, ref => ref.where("email", '==', email))
  .valueChanges();
}

deleteInmueble(id){
  return this.afs.collection(`inmuebles`).doc(`${id}`).delete();
}

  updatePhotoUrl(user){
    this.afs.doc(`users/${user.id}`).update({
      photoUrl : user.image
    })
  }


  updatePerfil(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);

    const data: UserInterface = {
          name:     user.name,
          telefono: user.telefono
        }


    return userRef.update(data);
  }


  verifyPassword(email: string, pass: string , pass2: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(success =>

        this.afsAuth.auth.currentUser.updatePassword(pass2)
        .then(success => resolve("Se actualizo la contraseña correctamente.") )
        .catch(err => reject("Error en la actualizacion."))

        ).catch(
          err => reject("Contraseña Incorrecta.")
        )
    });
  }


  register_inmueble(inmueble) {

    const id = this.afs.createId();

    const data: inmuebleInterface = {
          id_inmueble:       id,
          id_user:           inmueble.user,
          tipo_departamento: inmueble.type_apar,
          operacion:         inmueble.operation,
          cuartos:           inmueble.door,
          bano:              inmueble.bano,
          cochera:           inmueble.cochera,
          vista:             inmueble.vista,
          tipo_depa:         inmueble.tipo,
          amoblado:          inmueble.amoblado,
          area:              inmueble.area,
          estreno:           inmueble.estreno,
          proyecto:          inmueble.proyecto,
          presupuesto:{
            moneda:inmueble.pre_type,
            precio:inmueble.pre_price
          },
          mantenimiento:{
            moneda:inmueble.man_type,
            precio:inmueble.man_price
          },
          departamento:      inmueble.departamento_,
          provincia:         inmueble.provincia_,
          distrito:          inmueble.distrito_,
          direccion:         inmueble.direccion,
          latitud:           inmueble.latitud,
          longitud:          inmueble.longitud,
          fecha:             inmueble.fecha,
          adicionales:{
            terraza:inmueble.terraza,
            mascota:inmueble.mascota,
            deposito:inmueble.deposito,
            ascensor:inmueble.ascensor,
            vigilancia:inmueble.vigilancia,
            servicio:inmueble.servicio,
            dscp:inmueble.dscp,
            reunion:inmueble.reunion,
            piscina:inmueble.piscina,
            gym:inmueble.gym,
            parrilla:inmueble.parrilla,
            juego:inmueble.juego,

          }

    }

    return this.afs.collection(`inmuebles`).doc(`${id}`).set(data);

  }

  getInmuebles(uid){
    return this.afs.collection(`inmuebles`, ref => ref.where("id_user", '==', uid , ).orderBy('fecha','desc') ).valueChanges();
 }


 register_solicitud(solicitud) {

  const id = this.afs.createId();

  const data: SolicitudInterface = {
        id_solicitud:       id,
        id_user:           solicitud.user,
        tipo_departamento: solicitud.type_apar,
        operacion:         solicitud.operation,
        cuartos:           solicitud.door,
        bano:              solicitud.bano,
        cochera:           solicitud.cochera,
        vista:             solicitud.vista,
        tipo_depa:         solicitud.tipo,
        amoblado:          solicitud.amoblado,
        area:              solicitud.area,
        estreno:           solicitud.estreno,
        proyecto:          solicitud.proyecto,
        presupuesto:{
          moneda:solicitud.pre_type,
          precio:solicitud.pre_price
        },
        mantenimiento:{
          moneda:solicitud.man_type,
          precio:solicitud.man_price
        },
        distrito:          solicitud.distrito,
        radio:             solicitud.radius,
        rango: {
          de:solicitud.fromDate,
          hasta:solicitud.toDate
        },
        fecha:             solicitud.fecha,
        comentario:        solicitud.comentario,
        adicionales:{
          terraza:solicitud.terraza,
          mascota:solicitud.mascota,
          deposito:solicitud.deposito,
          ascensor:solicitud.ascensor,
          vigilancia:solicitud.vigilancia,
          servicio:solicitud.servicio,
          dscp:solicitud.dscp,
          reunion:solicitud.reunion,
          piscina:solicitud.piscina,
          gym:solicitud.gym,
          parrilla:solicitud.parrilla,
          juego:solicitud.juego,
        }

  }

  return this.afs.collection(`solicitudes`).doc(`${id}`).set(data);

}


getSolicitudesHome(){

  return this.afs.collection(`solicitudes`, ref => ref.orderBy('fecha','desc').limit(3)).valueChanges();

  }








}
