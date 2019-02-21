import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection, } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { inmuebleInterface } from '../models/inmueble';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  task: AngularFireUploadTask;

  userCollection: AngularFirestoreCollection<UserInterface>;
  user: Observable<UserInterface[]>;
  userDoc: AngularFirestoreDocument<UserInterface>;



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




}
