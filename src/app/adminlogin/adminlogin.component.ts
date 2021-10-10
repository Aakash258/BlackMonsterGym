import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserMgmtService } from '../service/user-mgmt.service';
import { CrudService } from '../service/crud.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {

  users!: any

  constructor(private router: Router, private userService: UserMgmtService, private productService: CrudService,
    private storage: AngularFireStorage) { }

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })

  ShowAddForm: boolean = false;


  onLogin() {

    this.userService.getUsers().subscribe(response => { this.users = response })

    for (let i = 0; i < this.users?.length; i++) {

      // shows all the user ids and passwords
      console.log(this.users[i].payload.doc.data().email, this.users[i].payload.doc.data().password)

      if (this.users[i].payload.doc.data().email == this.loginform.get('email')?.value) {
        if (this.users[i].payload.doc.data().password == this.loginform.get('password')?.value) {
          sessionStorage.setItem('loginstatus', 'true')
          this.loginform.setValue({
            email: '',
            password: ''
          })
        }
        break;
      }
    }

    // if ((this.loginform.get('email')?.value) == 'Admin' && this.loginform.get('password')?.value == 'Admin') {
    //   sessionStorage.setItem('loginstatus', 'true')
    //   this.loginform.setValue({
    //     email: '',
    //     password: ''
    //   })
    // }

  }


  checkloginstatus() {
    return (sessionStorage.getItem('loginstatus') == 'true') ? true : false
  }

  logout() {
    sessionStorage.setItem('loginstatus', 'false')
    this.router.navigate(['adminlogin'])
  }

  showaddform() {
    this.ShowAddForm = true
  }

  addProductForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required)
  })


  selectedimage: any
  isSubmitted = false

  uploadProductImage(formValue: any) {
    this.isSubmitted=true

    var filepath = `products/${this.addProductForm.get('name')?.value}_${new Date().getTime()}`
    const fileref = this.storage.ref(filepath)
    this.storage.upload(filepath, this.selectedimage).snapshotChanges().pipe(
      finalize(() => {
        fileref.getDownloadURL().subscribe((url) => {
          // alert(url)

          console.log(formValue)

          formValue['imageUrl'] = url

          this.isSubmitted = false
          this.addProduct(formValue)
        })
      })
    ).subscribe()
  }
  
  addProduct(formValue: any) {
    this.productService.addProduct(formValue)
      .then(res => {
        alert('Product Added Successfully')
        this.addProductForm.reset()
      })
  } 

  imgsrc: any

  chooseImg(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgsrc = e.target.result
      reader.readAsDataURL(event.target.files[0])
      this.selectedimage = event.target.files[0]
    }
  }

  // addProductForm = new FormGroup({
  //   name: new FormControl('', [Validators.required]),
  //   price: new FormControl('', Validators.required),
  //   description: new FormControl('', Validators.required)
  // })

  // addProduct() {
  //   this.productService.addProduct(this.addProductForm.value)
  //     .then(res => {
  //       alert('Product Added Successfully')
  //       this.ShowAddForm = false
  //     })
  // }




  deleteproduct = false
  products: any

  showDeleteProduct() {
    this.getProducts()
    this.deleteproduct = true
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res,
        console.log('done')
    })
  }

  deleteProduct(id: any) {
    console.log("deletion id: " + id)
    if(confirm('Are you sure?')){
      this.productService.deleteProduct(id).then(res => {
      });
    }
    return
  }



  showmembers= false
  members : any

  showMembers() {
    this.getMembers()
    this.showmembers = true
  }

  getMembers() {
    this.userService.getMembers().subscribe(res => {
      this.members = res
    })
  }

  back() {
    this.showmembers = false
    this.ShowAddForm = false
    this.deleteproduct = false
  }

}
