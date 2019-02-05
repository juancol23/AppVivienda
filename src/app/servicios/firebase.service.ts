import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../models/user';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { takeLast } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<String>;
  percentage: Observable<number>;
  snapshot: Observable<any>;



  constructor(private afs: AngularFirestore,private afStorage: AngularFireStorage) { }

  uploadImage(event) {
    
    return this.task = this.afStorage.upload(`users/${event.id}/${event.name}`, event.imagen);
    /*this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();
    this.downloadURL = this.afStorage.ref(`users/${event.id}/${event.name}`).getDownloadURL();
    
    return this.downloadURL;*/

    
  }

  getUserById(uid){
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  updatePhotoUrl(user){
    this.afs.doc(`users/${user.id}`).update({
      photoUrl : user.image
    })
  }

  updatePerfil(user) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);

    const data: UserInterface = {

          name:     user.displayName,
          email:    user.email,
          photoUrl: user.photoUrl,
          telefono: user.phoneNumber

        }

    return userRef.set(data);

  }



}
