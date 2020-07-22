import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'src/app/domain/user';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WineService } from 'src/app/services/wine.service';
import { MessageService } from 'src/app/services/message.service';
import { faFileExcel, faSyncAlt, faSearch, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
// import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxPanelComponent } from 'jqwidgets-ng/jqxpanel';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ListeComponent implements OnInit, AfterViewInit {
  constructor(
    private wineService: WineService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService) {
    this.currentUser = authenticationService.currentUserValue;
  }
  currentUser: User;
  // @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;
  @ViewChild('myPanel', { static: false }) myPanel: jqxPanelComponent;
  faExportIcon = faFileExcel;
  ngAfterViewInit(): void {
    this.wineService.listVine(true).subscribe((data: any) => {
       console.log(data);     
       this.source.localdata = data;
      //  this.myGrid.createComponent(this.gridSettings); 
      //  // passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
      //  this.myGrid.updatebounddata('cells');  
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
  localization: any =
  {
    currencySymbol: " Kr.",
    currencySymbolPosition: "after"
  }

  source: any =
  {
      datatype: 'json',      
      datafields:
        [
          { name: 'vinId', type: 'int' },
          { name: 'aargang', type: 'int' },
          { name: 'navn', type: 'string' },
          { name: 'vinType', type: 'string' },
          { name: 'producent', type: 'string' },
          { name: 'website', type: 'string' },
          { name: 'land', type: 'string' },
          { name: 'drue', type: 'string' },
          { name: 'koebsDato', type: 'date' },
          { name: 'distrikt',  type: 'string' },
          { name: 'klassifikation', type: 'string' },
          { name: 'flaskeStoerrelse',  type: 'string' },
          { name: 'indkoebsSted',  type: 'string' },
          { name: 'alkohol',  type: 'string' },
          { name: 'antal', type: 'int' },
          { name: 'koebsPris', type: 'number' },
          { name: 'noter',  type: 'string' },
          { name: 'anvendelse',  type: 'string' },
          { name: 'imageName',  type: 'string' },
          { name: 'timeStamp', type: 'date' },
          { name: 'hylde', type: 'string' },
        ],
      localdata: null
  };
  dataAdapter: any = new jqx.dataAdapter(this.source);
  columns: any[] =
    [
      { text: 'Id', datafield: 'vinId', width: 50 },
      { text: 'År', datafield: 'aargang', width: 50 },
      { text: 'Navn', datafield: 'navn', width: 300 },
      { text: 'Type', datafield: 'vinType', width: 75 },
      { text: 'Producent', datafield: 'producent', width: 75 },
      { text: 'WWW', datafield: 'website', width: 75 },
      { text: 'Land', datafield: 'land', width: 100 },
      { text: 'Drue', datafield: 'drue', width: 300 },
      { text: 'Dato', datafield: 'koebsDato', width: 100, cellsformat: 'yyyy-MM-dd'},
      { text: 'Distrikt', datafield: 'distrikt', width: 100 },
      { text: 'Klassifikation', datafield: 'klassifikation', width: 100 },
      { text: 'FlaskeStoerrelse', datafield: 'flaskeStoerrelse', width: 100 },
      { text: 'Indkøbssted', datafield: 'indkoebsSted', width: 100 },
      { text: 'Alkohol', datafield: 'alkohol', width: 60 },
      { text: 'Antal', datafield: 'antal', width: 50, cellsalign: 'right' },
      { text: 'Pris', datafield: 'koebsPris', width: 75, cellsalign: 'right', cellsformat: 'c2' },
      { text: 'Noter', datafield: 'noter', width: 200 },
      { text: 'Anvendelse', datafield: 'anvendelse', width: 100 },
      { text: 'ImageName', datafield: 'imageName', width: 100 },
      { text: 'TimeStamp', datafield: 'timeStamp', width: 100, cellsformat: 'yyyy-MM-dd' },
      { text: 'Hylde', datafield: 'hylde', width: 100 },
    ];

  gridSettings: jqwidgets.GridOptions = {
      width: 1850,
      source: this.dataAdapter,      
      editable: false,
      columnsresize: true,
      selectionmode: 'multiplecellsadvanced',
      columns: this.columns
  };

  
  windowWidth: any;
  
  getWidth(): any {
    if (document.body.offsetWidth < 1850) {
      return '100%';
    }

    return 1850;
  }
  
  getHeight(): any {
    if (document.body.offsetHeight < 780) {
      return 525;
    }
    return 740;
  }
 

  ngOnInit(): void {
  }

  public resizeOnResponsive(desktop: number, mobile: number) {
    if (this.windowWidth <= 1000) {
      return mobile;
    }
    else {
      return desktop;
    }
  }  
}
