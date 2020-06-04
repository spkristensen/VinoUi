import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/domain/user';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WineService } from 'src/app/services/wine.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
})
export class ListeComponent implements OnInit {

  currentUser: User;
  rows : any;   
  constructor(
    private wineService: WineService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService) {
    
    this.currentUser = authenticationService.currentUserValue;  
    this.listVine();

    // this.fetch(data => {
    //   this.rows = data;
    // });
   }
   
   ordersList1 = [
    { Id: '1', Årgang: '2010', Navn: 'CLine',Land: 'USA', Antal: '10', Pris: '127' },
    { Id: '2', Årgang: '2011', Navn: 'Abc',Land: 'Italine', Antal: '15', Pris: '130' },
  ];
   columns = [ 
    {name: "Id"}, 
    {name: "Årgang"}, 
    {name: "Navn"}, 
    {name: "Land"},
    {name: "Antal"},
    {name: "Pris"}];

  ngOnInit(): void {
    // this.fetch(data => {
    //   this.rows = data;
    // });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `@swimlane/ngx-datatable/assets/data/100k.json`);
    
    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();

    
  }

  listVine(): any {
    console.log('listcomponent listVine');
    // debugger;
    this.wineService.listVine(true).subscribe((data: any) => {
      // console.log(data);
      // this.wineService.vin = data;
      this.rows = data;
    },
      error => {
        if (error.message == null) {
          this.messageService.error(error.title, false);
        } else {
          this.messageService.error(error.message, false);
        }
      }
    );
  }

}
