import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { UserMgmtService } from '../service/user-mgmt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  registrationform = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]+')]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]+')]),
    age: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    gender: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    plan: new FormControl('', Validators.required)
  })


  constructor(private userService: UserMgmtService) { }

  onRegister() {
    console.log(this.registrationform)
    this.userService.addMember(this.registrationform.value)
      .then(() => {
        alert('Member Added Successfully')
        this.sendEmail()

        this.registrationform.reset()
      })
  }

  public sendEmail() {
    // e.preventDefault();
    emailjs.send('registration_service', 'template_6ngqvlm',
      {
        firstname: this.registrationform.value.firstname,
        email: this.registrationform.value.email,
        phone: this.registrationform.value.phone
      }, 'user_mtPx6kjp6pkNpUTeh0MFz')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  }

}
