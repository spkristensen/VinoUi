import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessageService } from 'src/app/services/message.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user.model';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',  
})
export class SettingsComponent implements OnInit {

  constructor( private authenticationService: AuthenticationService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService
    )
     {
      this.currentUser = authenticationService.currentUserValue;
     }
    currentUser: User;
    error: any;
    passwordNew: string;
    passwordOld: string;

  ngOnInit(): void {
  }

  updatePersonalInfo(errorMessageModal: any): void {
    this.spinner.show();
    this.userService.updatePersonalInfo(this.currentUser).subscribe(user => {
        this.currentUser = user
        this.authenticationService.updateCurrentUser(user);
        this.spinner.hide();
    }, error => {
        this.spinner.hide();
        this.error = error;
        this.modalService.open(errorMessageModal, { ariaLabelledBy: 'modal-basic-title' });
    });
}

updatePassword(errorMessageModal: any): void {
    this.spinner.show();
    this.userService.updatePassword(this.passwordNew, this.passwordOld).subscribe((user: User) => {
        this.currentUser = user
        this.authenticationService.updateCurrentUser(user);
        this.passwordNew = '';
        this.passwordOld = '';
        this.spinner.hide();
    }, (error: any) => {
        this.spinner.hide();
        this.error = error;
        this.modalService.open(errorMessageModal, { ariaLabelledBy: 'modal-basic-title' });
    });
}

}
