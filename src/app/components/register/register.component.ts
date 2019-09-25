import { Component, OnInit } from '@angular/core';    
import {Observable} from 'rxjs';    
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';    
import { LoginService } from 'src/app/services/login.service';
import { Register } from 'src/app/model/register.model';
    
@Component({    
  selector: 'app-register',    
  templateUrl: './register.component.html',    
  //styleUrls: ['./register.component.css']    
})    
export class RegisterComponent implements OnInit {    
  data = false;    
  UserForm: FormGroup;    
  massage:string;    
  employeeForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private loginService:LoginService) { }    
    
  ngOnInit() { 
     //https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example
    // https://github.com/cornflourblue/angular-6-registration-login-example/blob/master/src/app/register/register.component.ts
    // Se på ovenstående , der må være en løsning at finder her
    
    //   this.UserForm = this.formbulider.group({    
    //   UserName: ['', [Validators.required]],    
    //   LoginName: ['', [Validators.required]],    
    //   Password: ['', [Validators.required]],    
    //   Email: ['', [Validators.required]],    
    //   ContactNo: ['', [Validators.required]],    
    //   Address: ['', [Validators.required]],    
    // });
    this.UserForm = new FormGroup(
      { UserName : new FormControl(['', Validators.requiredTrue]), 
        LoginName : new FormControl(['', Validators.requiredTrue]),
        Password : new FormControl(['', Validators.requiredTrue]),
        Email : new FormControl(['', Validators.requiredTrue], Validators.email),
        ContactNo : new FormControl(['', Validators.requiredTrue]),
        Address : new FormControl(['', Validators.requiredTrue]),
      },      
      );

    // this.UserForm = this.formBuilder.group({
    //   UserName: ['', Validators.required],
    //   LoginName: ['', Validators.required],
    //   Password: ['', [Validators.required, Validators.minLength(6)]],
    //   Email: ['', [Validators.required, Validators.email]],
    //   ContactNo: ['', [Validators.required]],
    //   Address: ['', [Validators.required]]
    //   });
      //, {
      //   validator: MustMatch('password', 'confirmPassword')
      // });
  };
 

  onFormSubmit()    
  {    
    const user = this.UserForm.value;    
    this.Createemployee(user);    
  }

  Createemployee(register:Register) {    
    this.loginService.CreateUser(register).subscribe(    
    ()=>    
    {    
      this.data = true;    
      this.massage = 'Data saved Successfully';    
      this.UserForm.reset();    
    });    
  }    
}  