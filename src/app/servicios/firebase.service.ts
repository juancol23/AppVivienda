import { Injectable, Pipe } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { inmuebleInterface } from '../models/inmueble';
import { SolicitudInterface } from '../models/solicitud';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';
import { query } from '@angular/animations';
import { isUndefined } from 'util';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {



  userCollection: AngularFirestoreCollection<UserInterface>;
  user: Observable<UserInterface[]>;
  userDoc: AngularFirestoreDocument<UserInterface>;


  items: Observable<any[]>;
  itemsCollection: AngularFirestoreCollection<any>;


  task: AngularFireUploadTask;

  public


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


  this.afs.collection(`inmuebles`, ref => ref.where("id_inmueble", '==', id))
  .valueChanges().subscribe((res)=>{

    for (let index = 0; index < res.length; index++) {



      for (let index2 = 0; index2 < res[index]["image"].length; index2++) {

      const storageRef = this.afStorage.storage.ref();
    storageRef.child(`inmuebles/${id}/${res[index]["image"][index2]["name"]}`).delete()
    .then(()=>{

    }).catch(err => {

    });

      }


    }




  })


  /*for (const datas of res) {

    this.afs.collection(`files_images`).doc(datas.id_image).delete();
  }*/

  return this.afs.collection(`inmuebles`).doc(`${id}`).delete();


}

deleteSolicitud(id){

  return this.afs.collection(`solicitudes`).doc(`${id}`).delete();
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


    const data: inmuebleInterface = {
      id_inmueble:       inmueble.id,
      id_user:           inmueble.user,
      tipo_departamento: inmueble.type_apar,
      operacion:         inmueble.operation,
      cuartos:           inmueble.door,
      bano:              inmueble.bano,
      cochera:           inmueble.cochera,
      vista:             inmueble.vista,
      tipo_depa:         inmueble.tipo,
      amoblado:          inmueble.amoblado,
      area:              parseInt(inmueble.area),
      estreno:           inmueble.estreno,
      proyecto:          inmueble.proyecto,
      image:[],
      presupuesto:{
        moneda:inmueble.pre_type,
        precio:parseInt(inmueble.pre_price)
      },
      mantenimiento:{
        moneda:inmueble.man_type,
        precio:parseInt(inmueble.man_price)
      },
      coddireccion:          inmueble.distrito_,
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


    /*for (const file of images) {

      const path = `inmuebles/${inmueble.id}/${file.name}`;
      const ref = this.afStorage.ref(path);
      const task = this.afStorage.upload(path, file);
      let id = this.afs.createId();



      task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
          return this.afs.collection('files_images').doc(`${id}`).set({
            id_image:id,
            id_inmueble:inmueble.id,
            name: f.metadata.name,
            url: url
          });

        })
      })
    }*/


    return this.afs.collection(`inmuebles`).doc(`${inmueble.id}`).set(data)

  }

  uploadFiles(id,data){

    const dato = {

      name: data.name,
      id_image: data.id_image,
      id_inmueble:data.id_inmueble,
      url:data.url

    }



    return this.afs.collection('inmuebles').doc(id).update({image:data})

  }







  getInmuebles(uid){
    return this.afs.collection(`inmuebles`, ref => ref.where("id_user", '==', uid , ).orderBy('fecha','desc') ).valueChanges();
 }


 getImageInmueble(id){
  return this.afs.collection(`files_images`, ref => ref.where("id_inmueble", '==', id )).valueChanges();


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
        area:              parseInt(solicitud.area),
        estreno:           solicitud.estreno,
        proyecto:          solicitud.proyecto,
        presupuesto:{
          moneda:solicitud.pre_type,
          precio:parseInt(solicitud.pre_price)
        },
        mantenimiento:{
          moneda:solicitud.man_type,
          precio:parseInt(solicitud.man_price)
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

getSolicitudesAll(filtro){

  return this.afs.collection(`solicitudes`, ref => {

    let query : firebase.firestore.Query = ref;
    if(filtro["tipo_departamento"]!=''){
      query = query.where('tipo_departamento', '==', filtro["tipo_departamento"])
    }

    if(filtro["operacion"]!=''){
      query = query.where('operacion', '==', filtro["operacion"])
    }

    if(filtro["distrito"]!=''){
      query = query.where('distrito', 'array-contains', filtro["distrito"])
    }

    if(filtro["bano"]!=''){
      query = query.where('bano', '==', filtro["bano"])
    }

    if(filtro["cochera"]!=''){
      query = query.where('cochera', '==', filtro["cochera"])
    }

    if(filtro["cuartos"]!=''){
      query = query.where('cuartos', '==', filtro["cuartos"])
    }

    if(filtro["estreno"]!=''){
      if(filtro["estreno"]=='INDISTINTO'){

      }else{
       query = query.where('estreno', '==', filtro["estreno"])
      }
     }


    if(filtro["proyecto"]!=''){
      if(filtro["proyecto"]=='INDISTINTO'){

      }else{
       query = query.where('proyecto', '==', filtro["proyecto"])
      }
     }

    if(filtro["vista"]!=''){
     if(filtro["vista"]=='INDISTINTO'){

     }else{
      query = query.where('vista', '==', filtro["vista"])
     }
    }

    if(filtro["tipo_depa"]!=''){
      if(filtro["tipo_depa"]=='INDISTINTO'){

      }else{
       query = query.where('tipo_depa', '==', filtro["tipo_depa"])
      }
    }

    if(filtro["amoblado"]!=''){
      if(filtro["amoblado"]=='INDISTINTO'){

      }else{
       query = query.where('amoblado', '==', filtro["amoblado"])
      }
    }

    if(filtro["terraza"] !=''  ){

      if( !isUndefined(filtro["terraza"]) ){
        query = query.where('adicionales.terraza', '==', filtro["terraza"])
      }
    }

    if(filtro["dscp"]!=''  ) {

      if(!isUndefined(filtro["dscp"]) ){
       query = query.where('adicionales.dscp', '==', filtro["dscp"])
      }

    }

    if(filtro["gym"]!='' ){

      if( !isUndefined(filtro["gym"]) ){
        query = query.where('adicionales.gym', '==', filtro["gym"])
       }


    }

    if(filtro["juego"]!=''){

      if( !isUndefined(filtro["juego"]) ){

        query = query.where('adicionales.juego', '==', filtro["juego"])
       }

    }

    if(filtro["mascota"]!='' ){

      if( !isUndefined(filtro["mascota"]) ){

        query = query.where('adicionales.mascota', '==', filtro["mascota"])
       }


    }

    if(filtro["parrilla"]!=''  ){

      if( !isUndefined(filtro["parrilla"]) ){

        query = query.where('adicionales.parrilla', '==', filtro["parrilla"])
       }



    }

    if(filtro["piscina"]!='' ){

      if( !isUndefined(filtro["piscina"]) ){

        query = query.where('adicionales.piscina', '==', filtro["piscina"])
       }

    }

    if(filtro["reunion"]!='' ){

      if(!isUndefined(filtro["reunion"]) ){

        query = query.where('adicionales.reunion', '==', filtro["reunion"])
       }
    }

    if(filtro["servicio"]!='' ){

      if( !isUndefined(filtro["servicio"]) ){


       query = query.where('adicionales.servicio', '==', filtro["servicio"])

       }
    }

    if(filtro["vigilancia"]!=''){

      if( !isUndefined(filtro["vigilancia"]) ){


        query = query.where('adicionales.vigilancia', '==', filtro["vigilancia"])

        }

    }

    if(filtro["deposito"]!='' ){

      if( !isUndefined(filtro["deposito"]) ){



        query = query.where('adicionales.deposito', '==', filtro["deposito"])

        }

    }

    if(filtro["ascensor"]!='' ){

      if( !isUndefined(filtro["ascensor"]) ){


        query = query.where('adicionales.ascensor', '==', filtro["ascensor"])
        }

    }

    if(filtro["moneda"]!='' ){

      if( !isUndefined(filtro["moneda"]) ){


        query = query.where('presupuesto.moneda', '==', filtro["moneda"])
        }


    }

    return query
    }
    ).valueChanges();

  }

getSolicitudesHome(){

  return this.afs.collection(`solicitudes`, ref => ref.orderBy('fecha','desc').limit(3)).valueChanges();

  }

getallUser(){

return  this.afs.collection(`users`).valueChanges();
}

getSolicitudesByUser(uid){
  return this.afs.collection(`solicitudes`, ref => ref.where("id_user", '==', uid  ).orderBy('fecha','desc') ).valueChanges();
}


geteditSolicitud(id1,id2){

return this.afs.collection(`solicitudes`, ref => {

  let query : firebase.firestore.Query = ref;
  query = query.where('id_user', '==', id1)
  query = query.where('id_solicitud', '==', id2)
  return query
  }).valueChanges();


}


edit_solicitud(solicitud) {


  const data: SolicitudInterface = {
        tipo_departamento: solicitud.type_apar,
        operacion:         solicitud.operation,
        cuartos:           solicitud.door,
        bano:              solicitud.bano,
        cochera:           solicitud.cochera,
        vista:             solicitud.vista,
        tipo_depa:         solicitud.tipo,
        amoblado:          solicitud.amoblado,
        area:             parseInt( solicitud.area),
        estreno:           solicitud.estreno,
        proyecto:          solicitud.proyecto,
        presupuesto:{
          moneda:solicitud.pre_type,
          precio:parseInt(solicitud.pre_price)
        },
        mantenimiento:{
          moneda:solicitud.man_type,
          precio:parseInt(solicitud.man_price)
        },
        distrito:          solicitud.distrito,
        radio:             solicitud.radius,
        rango: {
          de:solicitud.fromDate,
          hasta:solicitud.toDate
        },
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

  return this.afs.collection(`solicitudes`).doc(`${solicitud.inmueble}`).update(data);

}


}
