import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WineService } from '../services/wine.service';
import { FileService } from '../services/file.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/domain/user';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent  {
  currentUser: User;
  public searchText = '';
  public logOutIcon = faSignOutAlt;
  cbHistory = false;
  constructor(private wineSvc: WineService, private fileSrv: FileService, private router: Router,
              private authenticationService: AuthenticationService ) {
    console.log('HeaderComponent constructor');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  cbHistoryChange(e)
  {
      this.cbHistory = e.target.checked;
  }
  searchClick() {
    console.log('HeaderComponent searchClick');
    // debugger;
    this.wineSvc.search(this.searchText, this.cbHistory);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  export() {
    console.log('HeaderComponent exportClick');
    this.fileSrv.DownloadCsvFile();
  }
}
