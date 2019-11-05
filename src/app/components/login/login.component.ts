import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  year = new Date().getFullYear();
  loginForm: FormGroup;
  model: any = {};
  loading = false;
  submitted = false;
  returnUrl: string;
  status: string;
  errorMessage: string;
  signInIcon = faSignInAlt;
  isFetchingLogin = false;
  constructor(
    // titleService: TitleService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messageService: MessageService) {
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }
    // titleService.setTitle('Login');
}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/list';
    this.status = this.route.snapshot.queryParams.status || '';
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isFetchingLogin = true;

    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              this.isFetchingLogin = false;
              this.router.navigate([this.returnUrl]);
            },
            error => {
              // der opstod en fejl vi sender den ned til MessageService
                this.isFetchingLogin = false;
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
