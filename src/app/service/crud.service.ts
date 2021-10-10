import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(private firestore: AngularFirestore) { }

  getProducts() {
    return this.firestore.collection("products").snapshotChanges()
  }

  addProduct(product: any) {
    return this.firestore.collection('products').add(product)
  }

  deleteProduct(id : any) {
    return this.firestore.collection('products').doc(id).delete()
  }
}
