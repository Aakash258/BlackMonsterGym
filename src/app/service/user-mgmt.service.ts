import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserMgmtService {

  constructor(private firestore: AngularFirestore) { }

  getUsers() {
    return this.firestore.collection('admin-users').snapshotChanges()
  }

  getMembers() {
    return this.firestore.collection('members').snapshotChanges()
  }

  addMember(user: any) {
    return this.firestore.collection('members').add(user)
  }

}
