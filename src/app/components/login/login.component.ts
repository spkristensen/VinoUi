import { Component, OnInit } from '@angular/core';    
import { Router, ActivatedRoute } from '@angular/router';    
// import { LoginService } from '../../services/login.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
 
@Component({    
  selector: 'app-login',    
  templateUrl: './login.component.html'    
  //styleUrls: ['./login.component.css']    
})    
export class LoginComponent {    
  loginForm: FormGroup;
  model : any={}; 
  loading = false;
  submitted = false;
  returnUrl: string;
  status: string;       
  errorMessage:string;      
  //constructor(private router:Router,private LoginService:LoginService) { } 
  constructor(
    //titleService: TitleService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private LoginService:LoginService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService)    
    {
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }
    //titleService.setTitle('Login');
    
}   
  
    
  ngOnInit() {  
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });     

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/list';
    this.status = this.route.snapshot.queryParams['status'] || '';
  }   
  get f() { return this.loginForm.controls; }
  
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {              
              this.router.navigate([this.returnUrl]);
            },
            error => {
              // der opstod en fejl vi sender den ned til MessageService
                this.messageService.error(error);
                this.loading = false;
            });
  }
  // logout() {
  //   // remove user from local storage to log user out
  //   localStorage.removeItem('currentUser');
  //   this.currentUserSubject.next(null);
  // }
 } 