import { Component, Input, OnInit, Output } from '@angular/core';
import { CrudService } from '../service/crud.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit{

  constructor(private crud: CrudService) {}

  ngOnInit(){

    this.crud.getProducts().subscribe(res => {
      this.products = res,
        console.log('done')
    })

    // this.populateCart()
  }

  products:any
  productsID:any=[]

  populateCart() {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let mycart = JSON.parse(sessionStorage.getItem('mycart') || '[]')
    console.log('cart component: ', mycart)

    var currCart:any=[]

    for(let i=0; i<this.products.length; i++) {
      this.productsID.push(this.products[i].payload.doc.id)
      // console.log(this.products[i].payload.doc.id)

      if(mycart.includes(this.products[i].payload.doc.id)) {
        currCart.push(this.products[i])
      }
    }
    
    return currCart

  }

}
