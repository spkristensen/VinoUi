import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WineService } from '../services/wine.service';
import { FileService } from '../services/file.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { User } from '../model/user.model';

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

  treeView(){
    console.log('HeaderComponent TreeViewClick');
    this.router.navigate(['/list']);
  }

  liste(){
    console.log('HeaderComponent ListeClick');
    this.router.navigate(['/VinListe']);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  export() {
    console.log('HeaderComponent exportClick');
    this.fileSrv.DownloadCsvFile(this.cbHistory);
  }

  vinliste()  {
    console.log('HeaderComponent vinlisteClick');
    this.router.navigate(['/VinListe']);
  }

  settings()  {
    console.log('HeaderComponent settingsClick');
    this.router.navigate(['/Settings']);
  }
}
