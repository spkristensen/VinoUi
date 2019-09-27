import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import { WineService } from '../services/wine.service';
import { User } from 'src/app/domain/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'  
})
export class FooterComponent implements OnInit {
  currentUser: User;
  updateFooterInfoSubscription: Subscription;
  constructor(authService: AuthenticationService,private wineService: WineService) {
    console.log('FooterComponent constructor');
    this.currentUser = authService.currentUserValue;
    this.updateFooterInfoSubscription = wineService.updateFooterInfoAnnounced$.subscribe(data => {
      this.setFooterInfo();
    });
  }
  wineCount: any;
  winePriceTotal: any;
  wineInfo: string;

  okMessage: string;
  errorMessage: string;
  private success = new Subject<string>();
  private error = new Subject<string>();

  ngOnInit() {
    console.log('FooterComponent ngOnInit');
    // debugger;
    this.success.subscribe((message) => this.okMessage = message);
    this.success.pipe(debounceTime(5000)).subscribe(() => this.okMessage = null);

    this.error.subscribe((message) => this.errorMessage = message);
    this.error.pipe(debounceTime(5000)).subscribe(() => this.errorMessage = null);
    // this.setFooterInfo();
  }
  showError(info) {
    this.error.next(`${new Date()} - ` + info);
  }

  setFooterInfo() {
    this.wineService.getFooterInfo().subscribe((data: any) => {
      console.log(data);
      this.wineCount = data.antal;
      this.winePriceTotal = data.totalAmount;
      this.wineInfo = this.wineCount +
        ' flasker' + ',' +
        ' ' + '' +
        ' kr: ' +
        this.winePriceTotal.toLocaleString('da-DK', { style: 'decimal', maximumFractionDigits: 0, minimumFractionDigits: 0 }) +
        ',-';
    });
  }
}
