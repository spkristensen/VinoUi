import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WineService } from '../services/wine.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/domain/user'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent  {
  currentUser: User;
  public searchText: string = '';

  constructor(private wineSvc: WineService, private router: Router,
    private authenticationService: AuthenticationService ) {      
    console.log('HeaderComponent constructor');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
 
  searchClick() {
    console.log('HeaderComponent searchClick');
    //debugger;
    this.wineSvc.search(this.searchText);    
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
