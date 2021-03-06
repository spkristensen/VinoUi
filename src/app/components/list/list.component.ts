import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
import { jqxExpanderComponent } from 'jqwidgets-ng/jqxexpander';
import { WineService } from '../../services/wine.service';
import { FooterComponent } from '../../footer/footer.component';
import { Vin } from '../../model/vin.model';
import { MessageService } from '../../services/message.service';
import { WineComponent } from '../wine/wine.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FotoService } from 'src/app/services/foto.service';
import { SearchItem } from 'src/app/model/SearchItem.models';
import { User } from 'src/app/model/user.model';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements AfterViewInit {
  @ViewChild('wineTree') wineTree: jqxTreeComponent;
  @ViewChild('wineListContextMenu') wineListContextMenu: jqxMenuComponent;
  @ViewChild('FooterComponent') footerComponent: FooterComponent;
  @ViewChild('WineComponent') wineComponent: WineComponent;
  @ViewChild('expanderComponent') expanderComponent: jqxExpanderComponent;

  treeSettings: jqwidgets.TreeOptions =
    {
      width: '100%',
      height: '100%',
      source: null
    };
  wineCount = 0;
  winePriceTotal = 0;
  selectedWine: Vin;
  selectedItem: any;
  searchClickedSubscription: Subscription;
  wineCreatedSubscription: Subscription;
  wineDeletedSubscription: Subscription;
  wineUpdatedSubscription: Subscription;

  searchString = ' ';
  rightClickWineId: string;
  currentUser: User;
  getWineSubscription: Subscription;
  isFetchingData = false;
  searchItem: SearchItem;
    // https://www.youtube.com/watch?v=FssKK37Ob4k
  constructor(
    private wineService: WineService,
    private fotoService: FotoService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService) {
    console.log('listcomponent Constructor');
    this.currentUser = authenticationService.currentUserValue;    
    this.searchClickedSubscription = wineService.searchClickedAnnounced$.subscribe(searchItem => {
      this.isFetchingData = true;
      if (searchItem.searchHistory == true || searchItem.searchValue != '') {
        this.searchVin(searchItem);                  
      } else {
        this.treeListGetAll(0, false);
      }
    });

    this.wineCreatedSubscription = wineService.wineCreatedAnnounced$.subscribe(data => {
      this.treeListGetAll(data, false);
      // this.selectedWine = null; // Fjern visning på højre side
    });

    this.wineUpdatedSubscription = wineService.wineUpdatedAnnounced$.subscribe(data => {
      this.treeListGetAll(data.vinId, true);
    });

    this.wineDeletedSubscription = wineService.wineDeletedAnnounced$.subscribe(data => {
      const items = this.wineTree.getItems();
      const itemToExpandAfterDelete = this.findPrevItem(items, this.rightClickWineId);
      this.treeListGetAll(itemToExpandAfterDelete, false);

      this.getWineSubscription = wineService.getWineAnnounced$.subscribe(vin => {
        this.selectedWine = vin;
      });      
    });
    this.searchItem = new SearchItem();
    this.searchItem.searchValue = '';
    this.searchItem.searchHistory = false;
  }
  // private updateFooterInfoAnnounced = new Subject<string>();
  // updateFooterInfoAnnounced$ = this.updateFooterInfoAnnounced.asObservable();

  wineTreeOnInitialized(): void {

    // this.wineTree.selectItem(document.getElementById('home'));
    // this.wineTree.expandItem(document.getElementById('solutions'));
    console.log('listcomponent wineTreeOnInitialized');

    document.addEventListener('contextmenu', event => {
      event.preventDefault();

      // .classList.contains('jqx-tree-item-li')) {
      if ((event.target as Element).parentElement.className === 'jqx-tree-item-li') {
        this.wineTree.selectItem(event.target);
        // this.selectedItem = this.wineTree.getSelectedItem();
        const element = event.target as HTMLElement;
        this.rightClickWineId = element.parentElement.id; // event.srcElement.parentElement.id; // id på den vin der er højreklikket på
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        this.wineListContextMenu.open(event.clientX + 5 + scrollLeft, event.clientY + 5 + scrollTop);
        return false;
      } else {
        this.wineListContextMenu.close();
      }
    });
  }

  wineListContextMenuOnItemClick(event: any): void {
    const item = event.args.innerText;
    // let item = this.wineTree.getItem(event.element);
    this.selectedItem = null;
    switch (item) {
      case 'Opret vin': {
        this.selectedItem = this.wineTree.getSelectedItem();
        if (this.selectedItem != null) {
          this.wineService.getVinOpret(this.rightClickWineId).subscribe((data: Vin) => {
            console.log(data);
          },
            error => {
              this.messageService.error(error.message, false);
            });
        } else {
          this.wineService.vin = new Vin();
        }
        break;
      }
      case 'Slet vin': {
        this.wineService.sletVin(this.rightClickWineId).subscribe((data: Vin) => {
          console.log(data);
          this.messageService.success('Vinen blev slettet');
        },
          error => {
            this.messageService.error(error.message, false);
          });
        break;
      }
    }
  }

  ngAfterViewInit(): void {
    console.log('listcomponent ngAfterViewInit');
    this.wineTreeOnInitialized();
    // $http.get("/api/CarDetail/GetAMCars?userId=" + userid + "&customerId=" + customerId).success(callback_success);
    this.wineService.searchVin(this.searchItem).subscribe((res: any) => {
      console.log('listcomponent after search: ' + res);
      console.log(res);
      this.treeSettings.source = res;
      this.wineTree.createComponent(this.treeSettings);
      const items = this.wineTree.getItems();
      this.setTooltip();
      this.wineTree.expandItem(items[0]);
    },
      error => {
        this.messageService.error(error);
      });
  }

  treeListGetAll(vinId: any, getVin: boolean) {
    this.wineService.getAllWines(this.searchItem).subscribe((res: any) => {
      console.log('TreeListGetAll: ' + res);
      this.treeSettings.source = res;
      this.wineTree.clear();
      this.wineTree.addTo(res[0], res[0].id);
      const items = this.wineTree.getItems();
      this.wineTree.expandItem(items[0]);
      this.setTooltip();
      if (vinId > 1) {
        this.expandItem(items, vinId);
      } else {
        this.expandCountryItem(items, vinId);
      }
      if (this.selectedItem === undefined) {
        const item = this.findItemToSelect(items, vinId);
        this.wineTree.selectItem(item);
        if (getVin) {
          this.getVin(item);
        } // hent vin efter den er opdateret
      }
      this.isFetchingData = false;
    });
  }
  expandCountryItem(wineTreeItems: any, wineId: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wineTreeItems.length; i++) {
      const treeItem = wineTreeItems[i];
      if (treeItem.id === wineId.toString()) {
        this.wineTree.expandItem(treeItem);
      }
    }
  }

  expandItem(wineTreeItems: any, wineId: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wineTreeItems.length; i++) {
      const treeItem = wineTreeItems[i];
      if (treeItem.id === wineId.toString()) {
        this.wineTree.expandItem(treeItem);
        this.wineTree.expandItem(treeItem.parentElement);
      }
    }
  }

  findPrevItem(wineTreeItems: any, wineId: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wineTreeItems.length; i++) {
      const treeItem = wineTreeItems[i];
      if (treeItem.id === wineId.toString()) {
        return treeItem.prevItem.id;
      }
    }
    return 0;
  }

  findItemToSelect(wineTreeItems: any, wineId: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wineTreeItems.length; i++) {
      const treeItem = wineTreeItems[i];
      if (treeItem.id === wineId.toString()) {
        return treeItem;
      }
    }
    return 0;
  }

  getWidth(): any {
    if (document.body.offsetWidth < 1850) {
      return '90%';
    }
    return 1850;
  }

  getHeight(): any {
    if (document.body.offsetHeight < 780) {
      return 525;
    }
    return 780;
  }

  // Ved hjælp af jquery løbes træet igennen for at finde de noder som er vine. på dem sættes title som er tooltip
  setTooltip() {
    const treeItems = $('.jqx-tree-item-li');
    // tslint:disable-next-line: only-arrow-functions
    $.each(treeItems, function(index, element) {
      if ($(element).children().length !== 2 || $($(element).children().eq(1)[0]).children().length !== 0) {
        return;
      }
      const vinId = element.attributes[0].value;
      // console.log(element.attributes[0].value);
      $(element).attr('title', 'Id: ' + vinId);
    });
  }
  // panels: any[] = [
  //  { size: '50%', min: '10%', collapsible: false },
  //  { size: '50%', min: '5%' }
  // ];

  onTreeSelect(event: any): void {
    // debugger;
    console.log('onTreeSelect ' + event.args.type);

    if (event.args.type === null) {
      return;
    }

    const item: any = this.wineTree.getItem(event.args.element);
    if (isNaN(item.id)) {
      if (item.isExpanded) {
        this.wineTree.collapseItem(item);
      } else {
        this.wineTree.expandItem(item);
      }
    } else {
      this.getVin(item);
    }
    console.log(item);
  }

  getVin(treeVinItem): any {
    console.log('listcomponent getVin');
    // debugger;
    this.wineService.getVin(treeVinItem.id).subscribe((data: Vin) => {
      // console.log(data);
      // this.wineService.vin = data;
      // this.selectedWine = data;
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

  searchVin(searchItem): any {
    console.log('listcomponent searchVin: ' + searchItem);

    this.wineService.searchVin(searchItem).subscribe((res: any) => {
      this.treeSettings.source = res;
      this.wineTree.clear();
      this.wineTree.addTo(res[0], res[0].id);
      const items = this.wineTree.getItems();
      this.wineTree.expandItem(items[0]);
      this.isFetchingData = false;
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  getWinesCount(treeListData): any {
    // debugger;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < treeListData.length; i++) {
      const land = treeListData[i];
      if (land.items !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < land.items.length; j++) {
          this.getWineCount(land.items[j]);
        }
      }
    }
  }

  getWineCount(wineTypeNode): any {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < wineTypeNode.items.length; i++) {
      // tslint:disable-next-line: no-shadowed-variable
      const vin = wineTypeNode.items[i];
      if (vin !== undefined && vin !== null) {
        this.wineCount = this.wineCount + vin.antal;
        this.winePriceTotal = this.winePriceTotal + (vin.antal * vin.koebsPris);
      }
    }
  }

}
