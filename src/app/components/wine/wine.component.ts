import { Component, OnInit, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { VindrueType } from '../../model/vindrue-type.model';
import { VinType } from '../../model/vin-type.model';
import { VinDistrikt } from '../../model/vin-distrikt.model';
import { VinFlaskestoerrelse } from '../../model/vin-flaskestoerrelse.model';
import { VinIndkoebssted } from '../../model/vin-indkoebssted.model';
import { VinKlassifikation } from '../../model/vin-klassifikation.model';
import { VinLand } from '../../model/vin-land.model';
import { KodelisteItem } from '../../model/kodeliste-item.model';
import { VinProducent } from '../../model/vin-producent.model';
import { WineService } from '../../services/wine.service';
import { FotoService } from '../../services/foto.service';
import { MessageService } from '../../services/message.service';
import { Vin } from '../../model/vin.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Image } from './../../model/image.model';
import { format } from 'url';
import { User } from 'src/app/model/user.model';

declare var $: any;

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
})

export class WineComponent implements OnInit {
  currentUser: User;
  // @Input() wine: Vin;
  wine: Vin;
  editDate: any;
  vindrueTyper: VindrueType[];
  vinTyper: VinType[];
  vinDistrikter: VinDistrikt[];
  vinFlaskestoerrelser: VinFlaskestoerrelse[];
  vinIndkoebsSteder: VinIndkoebssted[];
  vinKlassifikationer: VinKlassifikation[];
  vinLande: VinLand[];
  vinProducenter: VinProducent[];

  vinLand: VinLand;
  vinDistrikt: VinDistrikt;
  vinIndkoebssted: VinIndkoebssted;
  vinFlaskestoerrelse: VinFlaskestoerrelse;
  vinProducent: VinProducent;
  vinType: VinType;
  vindrueType: VindrueType;
  vinKlassifikation: VinKlassifikation;

  kodelisteItem: KodelisteItem;

  labelKodeListeModalName: string;
  labelKodeListeModalTitle: string;
  valueKodeListeModalName: string;
  kodelisteType: string;

  okMessage: string;
  errorMessage: string;
  kodelisteItemUpdateSubscription: Subscription;
  WineGetSubscription: Subscription;
  WineGetCreateSubscription: Subscription;
  wineDeletedSubscription: Subscription;
  fileUploadedSubscription: Subscription;
  vinDetail: Vin;  
  imageUrl = '../assets/img/UploadImageDefault.png';
  imageUrlOrg = '';
  imageTempplate = true;
  imageShow = false;
  // selectedFile: File = null;
  // onFileSelected(file: FileList) {
  //   console.log(file);
  //   this.selectedFile = file.item(0);
  //   this.opretBillede();
  // }

  // private wineCreatedAnnounced = new Subject<string>(); // Vin oprettet og den der lytter kan gøre et eller andet
  // wineCreatedAnnounced$ = this.wineCreatedAnnounced.asObservable();

  // parentShowEvent: EventEmitter<any>;

  // tslint:disable-next-line: max-line-length
  constructor(
    private wineService: WineService,
    private messageService: MessageService,
    private fotoService: FotoService,
    authenticationService: AuthenticationService, ) {
    this.currentUser = authenticationService.currentUserValue;
    this.getVindrueTyper();
    this.getVinTyper();
    this.getVinDistrikter(-1); // landid -1 så henter vi alle
    this.getVinFlaskestoerrelser();
    this.getVinindkoebssteder();
    this.getVinKlassifikationer(-1);
    this.getVinLande();
    this.getVinProducenter(-1);
    this.vinLand = new VinLand();
    this.vinDistrikt = new VinDistrikt();
    this.vinType = new VinType();
    this.vindrueType = new VindrueType();
    this.vinKlassifikation = new VinKlassifikation();
    this.vinProducent = new VinProducent();
    this.vinFlaskestoerrelse = new VinFlaskestoerrelse();
    this.vinIndkoebssted = new VinIndkoebssted();

    this.kodelisteItemUpdateSubscription = wineService.kodelisteItemUpdatedAnnounced$.subscribe(data => {
      this.messageService.success(data.type + ' ' + data.value);
      $('#KodeListeModal').modal('hide');
      const switchString = data.type;
      switch (switchString) {
        case 'Land':
          this.getVinLande();
          break;
        case 'Distrikt':
          this.getVinDistrikter(this.wine.landId);
          break;
        case 'VinType':
          this.getVinTyper();
          break;
        case 'DrueType':
          this.getVindrueTyper();
          break;
        case 'Klassifikation':
          this.getVinKlassifikationer(this.wine.landId);
          break;
        case 'Producent':
          this.getVinProducenter(this.wine.landId);
          break;
        case 'Flaskestørrelse':
          this.getVinFlaskestoerrelser();
          break;
        case 'Indkøbssted':
          this.getVinindkoebssteder();
          break;
      }
    });
    this.fileUploadedSubscription = fotoService.fileUploadedAnnounced$.subscribe(data => {
      const url = `${environment.apiUrl}/image/${data.imageId}`;
      this.imageUrl = url;
      this.wine.imageId = data.id;
      this.imageTempplate = false;
      this.imageShow = false;
      this.imageShow = true;
      this.imageUrlOrg = `${environment.apiUrl}/image/ORG-${data}`;
    });

    this.WineGetSubscription = wineService.getWineAnnounced$.subscribe(vin => {
      // tslint:disable-next-line: label-position

      if (vin.imageName == null) {
        this.imageUrl = '../assets/img/UploadImageDefault.png';
        this.imageTempplate = true;
        this.imageShow = false;
      } else {
        this.imageUrl = `${environment.apiUrl}/image/${vin.imageName}`;
        this.imageTempplate = false;
        this.imageShow = true;
        this.imageUrlOrg = `${environment.apiUrl}/image/ORG-${vin.imageName}`;
      }
      this.wine = vin;
    });

    this.WineGetCreateSubscription = wineService.getWineCreateAnnounced$.subscribe(vin => {
      const url = `${environment.apiUrl}/image/${vin.imageName}`;
      this.wine = vin;
      this.imageUrl = url;
      $('#wineModal').modal('show');
    });

    this.wineDeletedSubscription = wineService.wineDeletedAnnounced$.subscribe(data => {
      this.wine = null;
    });
  }


  ngOnInit() {
    // debugger;
    // this.parentShowEvent.subscribe((any) => this.doSomething(any));

    // this.success.subscribe((message) => this.okMessage = message);
    // this.success.pipe(debounceTime(5000)).subscribe(() => this.okMessage = null);

    // this.error.subscribe((message) => this.errorMessage = message);
    // this.error.pipe(debounceTime(5000)).subscribe(() => this.errorMessage = null);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    // debugger;

  }

  showModal() {
    $('#wineModal').modal('show');
  }
  vinLandSelected() {
    this.getVinDistrikter(this.wine.landId);
    this.getVinProducenter(this.wine.landId);
    this.getVinKlassifikationer(this.wine.landId);
  }

  doSomething() {
    const parts = this.wine.koebsDato.substr(0, 10).split('-');
    this.editDate = {
      day: Number(parts[2]),
      month: Number(parts[1]),
      year: Number(parts[0]),
    };
    this.getVinDistrikter(this.wine.landId);
    this.getVinProducenter(this.wine.landId);
    this.getVinKlassifikationer(this.wine.landId);
  }

  editkoebsPris(event)
  {
    console.log('editkoebsPris ' + event )    
    this.wine.KoebsPris = event;
  }

  onDateSelect(event)
  {
    console.log(event )   
    this.editDate = {
      day: event.day,
      month: event.month,
      year: event.year,
    }; 
    this.wine.koebsDato = `${event.year}-${event.month}-${event.day}`; // de små pinger giver mulighed for intelicense
  }
  // opretBillede() {
  //   // https://www.youtube.com/watch?v=YkvqLNcJz3Y
  //   this.fotoService.uploadFoto(this.wine.vinId, this.selectedFile).subscribe(data => {
  //     console.log(data);
  //     this.messageService.success('Billedet blev tilføjet');
  //   },
  //     error => {
  //       this.messageService.error(error.message, false);
  //     }
  //   );

  // }

  handlKodelisteModal(kodelisteType: string) {

    this.kodelisteItem = new KodelisteItem();
    switch (kodelisteType) {
      case 'land': {
        this.kodelisteType = 'land';
        this.labelKodeListeModalTitle = 'Rediger land';
        this.labelKodeListeModalName = 'Land:';
        this.valueKodeListeModalName = this.findVinLandViaId(this.wine.landId);
        this.kodelisteItem.id = this.wine.landId;
        break;
      }
      case 'distrikt': {
        this.kodelisteType = 'distrikt';
        this.labelKodeListeModalTitle = 'Rediger distrikt';
        this.labelKodeListeModalName = 'Distrikt:';
        this.valueKodeListeModalName = this.findDistriktViaId(this.wine.distriktId);
        this.kodelisteItem.id = this.wine.distriktId;
        break;
      }
      case 'vinType': {
        this.kodelisteType = 'vinType';
        this.labelKodeListeModalTitle = 'Rediger vintype';
        this.labelKodeListeModalName = 'VinType:';
        this.valueKodeListeModalName = this.findVinTypeViaId(this.wine.vintypeId);
        this.kodelisteItem.id = this.wine.vintypeId;
        break;
      }
      case 'drueType': {
        this.kodelisteType = 'drueType';
        this.labelKodeListeModalTitle = 'Rediger druetype';
        this.labelKodeListeModalName = 'DrueType:';
        this.valueKodeListeModalName = this.findDrueTypeViaId(this.wine.drueId);
        this.kodelisteItem.id = this.wine.drueId;
        break;
      }
      case 'klassifikation': {
        this.kodelisteType = 'klassifikation';
        this.labelKodeListeModalTitle = 'Rediger klassifikation';
        this.labelKodeListeModalName = 'Klassifikation:';
        this.valueKodeListeModalName = this.findKlassifikationViaId(this.wine.klassifikationId);
        this.kodelisteItem.id = this.wine.klassifikationId;
        break;
      }
      case 'producent': {
        this.kodelisteType = 'producent';
        this.labelKodeListeModalTitle = 'Rediger producent';
        this.labelKodeListeModalName = 'Producent:';
        this.valueKodeListeModalName = this.findProducenterViaId(this.wine.producentId);
        this.kodelisteItem.id = this.wine.producentId;
        break;
      }
      case 'flaskestoerrelse': {
        this.kodelisteType = 'flaskestoerrelse';
        this.labelKodeListeModalTitle = 'Rediger flaskestørrelse';
        this.labelKodeListeModalName = 'Flaskestørrelse:';
        this.valueKodeListeModalName = this.findFlaskestoerrelserViaId(this.wine.flaskeStoerrelseId);
        this.kodelisteItem.id = this.wine.flaskeStoerrelseId;
        break;
      }
      case 'indkoebssted': {
        this.kodelisteType = 'indkoebssted';
        this.labelKodeListeModalTitle = 'Rediger indkøbssted';
        this.labelKodeListeModalName = 'Indkøbssted:';
        this.valueKodeListeModalName = this.findIndkoebsStederViaId(this.wine.indkoebsStedId);
        this.kodelisteItem.id = this.wine.indkoebsStedId;
        break;
      }
      default:
    }
    this.kodelisteItem.type = this.labelKodeListeModalName;
    this.kodelisteItem.value = this.valueKodeListeModalName;
  }

  nyKodeListeVaerdi() {
    // console.log(event);
    switch (this.labelKodeListeModalTitle) {
      case 'Rediger land': this.labelKodeListeModalTitle = 'Opret land'; break;
      case 'Rediger distrikt': this.labelKodeListeModalTitle = 'Opret distrikt'; break;
      case 'Rediger vintype': this.labelKodeListeModalTitle = 'Opret vintype'; break;
      case 'Rediger druetype': this.labelKodeListeModalTitle = 'Opret druetype'; break;
      case 'Rediger klassifikation': this.labelKodeListeModalTitle = 'Opret klassifikation'; break;
      case 'Rediger producent': this.labelKodeListeModalTitle = 'Opret producent'; break;
      case 'Rediger flaskestørrelse': this.labelKodeListeModalTitle = 'Opret flaskestørrelse'; break;
      case 'Rediger indkøbssted': this.labelKodeListeModalTitle = 'Opret indkøbssted'; break;
      default:
    }
    this.kodelisteItem.id = 0;
    this.valueKodeListeModalName = '';
  }

  gemKodeListeItem() {
    console.log('Maincomponent gem kodelisteværdi: ' + this.labelKodeListeModalTitle);
    switch (this.labelKodeListeModalTitle) {
      case 'Rediger land': this.opdaterLand(); break;
      case 'Opret land': this.opretLand(); break;
      case 'Rediger distrikt': this.opdaterDistrikt(); break;
      case 'Opret distrikt': this.opretDistrikt(); break;
      case 'Rediger vintype': this.opdaterVinType(); break;
      case 'Opret vintype': this.opretVinType(); break;
      case 'Rediger druetype': this.opdaterDrueType(); break;
      case 'Opret druetype': this.opretDrueType(); break;
      case 'Rediger klassifikation': this.opdaterKlassifikation(); break;
      case 'Opret klassifikation': this.opretKlassifikation(); break;
      case 'Rediger producent': this.opdaterProducent(); break;
      case 'Opret producent': this.opretProducent(); break;
      case 'Rediger flaskestørrelse': this.opdaterFlaskestoerrelse(); break;
      case 'Opret flaskestørrelse': this.opretVinFlaskestoerrelse(); break;
      case 'Rediger indkøbssted': this.opdaterIndkoebssted(); break;
      case 'Opret indkøbssted': this.opretIndkoebssted(); break;
      default:
    }
  }

  kodelisteModelChanged() {

    this.kodelisteItem.value = this.valueKodeListeModalName;
  }

  opdaterVin() {
    console.log('Maincomponent gem vin: ' + this.wine.vinId + '/' + this.wine.navn);
    if (this.wine.vinId === -1) {
      this.wineService.opretVin(this.wine)
        .subscribe(() => {                        // husk at der skal subscribes for at kaldet til serveren bliver udført
          this.messageService.success('Vinen blev oprettet');
          $('.modal').modal('hide');
        },
          error => {
            this.messageService.error(error.message, false);
          }
        );
    } else {
      this.wineService.opdaterVin(this.wine)
        .subscribe(() => {
          this.messageService.success('Vinen blev opdateret');
          $('.modal').modal('hide');
        },
          error => {
            this.messageService.error(error.message, false);
          }
        );
    }
    // this.error.next(`${new Date()} - ` + info);
  }

  /* #region  Land */

  getVinLande(): any {
    console.log('Maincomponent getVinLande');
    this.wineService.getVinLande().subscribe((data: VinLand[]) => {
      this.vinLande = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  opdaterLand() {
    this.vinLand.id = this.kodelisteItem.id;
    this.vinLand.land = this.kodelisteItem.value;
    this.wineService.updateLand(this.vinLand).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  opretLand() {
    this.vinLand.land = this.kodelisteItem.value;
    this.wineService.insertLand(this.vinLand).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findVinLandViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinLande.length; i++) {
      if (this.vinLande[i].id === idInt) {
        return this.vinLande[i].land;
      }
    }
    return '';
  }

  /* #endregion */
  /* #region  Distrikt */
  getVinDistrikter(landId: number): any {
    console.log('Maincomponent   getVinDistrikter()');
    this.wineService.getVinDistrikter(landId).subscribe((data: VinDistrikt[]) => {
      this.vinDistrikter = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  findDistriktViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinDistrikter.length; i++) {
      if (this.vinDistrikter[i].id === idInt) {
        return this.vinDistrikter[i].distrikt;
      }
    }
    return '';
  }
  opretDistrikt() {
    this.vinDistrikt.distrikt = this.kodelisteItem.value;
    this.vinDistrikt.landId = this.wine.landId;
    this.wineService.insertVinDistrikt(this.vinDistrikt).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  opdaterDistrikt() {
    this.vinDistrikt.id = this.kodelisteItem.id;
    this.vinDistrikt.distrikt = this.kodelisteItem.value;
    this.vinDistrikt.landId = this.wine.landId;
    this.wineService.updateVinDistrikt(this.vinDistrikt).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
  /* #region  Indkøbssted */
  opdaterIndkoebssted() {
    this.vinIndkoebssted.id = this.kodelisteItem.id;
    this.vinIndkoebssted.indkoebssted = this.kodelisteItem.value;
    this.wineService.updateVinindkoebssted(this.vinIndkoebssted).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  opretIndkoebssted() {
    this.vinIndkoebssted.indkoebssted = this.kodelisteItem.value;
    this.wineService.insertVinindkoebssted(this.vinIndkoebssted).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  getVinindkoebssteder(): any {
    console.log('Maincomponent getVinindkoebssteder');
    this.wineService.getVinindkoebssteder().subscribe((data: VinIndkoebssted[]) => {
      this.vinIndkoebsSteder = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findIndkoebsStederViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinIndkoebsSteder.length; i++) {
      if (this.vinIndkoebsSteder[i].id === idInt) {
        return this.vinIndkoebsSteder[i].indkoebssted;
      }
    }
    return '';
  }
  /* #endregion */
  /* #region  Flaskestørelse */
  getVinFlaskestoerrelser(): any {
    console.log('Maincomponent getVinFlaskestoerrelser');
    this.wineService.getVinFlaskestoerrelser().subscribe((data: VinFlaskestoerrelse[]) => {
      this.vinFlaskestoerrelser = data;
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findFlaskestoerrelserViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinFlaskestoerrelser.length; i++) {
      if (this.vinFlaskestoerrelser[i].id === idInt) {
        return this.vinFlaskestoerrelser[i].flaskestoerrelse;
      }
    }
    return '';
  }

  opdaterFlaskestoerrelse() {
    this.vinFlaskestoerrelse.id = this.kodelisteItem.id;
    this.vinFlaskestoerrelse.flaskestoerrelse = this.kodelisteItem.value;
    this.wineService.updateVinFlaskestoerrelse(this.vinFlaskestoerrelse).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  opretVinFlaskestoerrelse() {
    this.vinFlaskestoerrelse.flaskestoerrelse = this.kodelisteItem.value;
    this.wineService.insertVinFlaskestoerrelse(this.vinFlaskestoerrelse).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
  /* #region  Producent */
  getVinProducenter(landid: number): any {
    console.log('Maincomponent getVinProducenter');
    this.wineService.getVinProducenter(landid).subscribe((data: VinProducent[]) => {
      this.vinProducenter = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findProducenterViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinProducenter.length; i++) {
      if (this.vinProducenter[i].id === idInt) {
        return this.vinProducenter[i].producent;
      }
    }
    return '';
  }

  opdaterProducent() {
    this.vinProducent.id = this.kodelisteItem.id;
    this.vinProducent.producent = this.kodelisteItem.value;
    this.wineService.updateProducent(this.vinProducent).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  opretProducent() {
    this.vinProducent.producent = this.kodelisteItem.value;
    this.vinProducent.landId = this.wine.landId;
    this.wineService.insertProducent(this.vinProducent).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
  /* #region  Klassifikation */
  getVinKlassifikationer(landid: number): any {
    console.log('Maincomponent getVinKlassifikationer');
    this.wineService.getVinKlassifikationer(landid).subscribe((data: VinKlassifikation[]) => {
      this.vinKlassifikationer = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findKlassifikationViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinKlassifikationer.length; i++) {
      if (this.vinKlassifikationer[i].id === idInt) {
        return this.vinKlassifikationer[i].klassifikation;
      }
    }
    return '';
  }

  opdaterKlassifikation() {
    this.vinKlassifikation.id = this.kodelisteItem.id;
    this.vinKlassifikation.klassifikation = this.kodelisteItem.value;
    this.wineService.updateVinKlassifikation(this.vinKlassifikation).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  opretKlassifikation() {
    this.vinKlassifikation.klassifikation = this.kodelisteItem.value;
    this.vinKlassifikation.landId = this.wine.landId;
    this.wineService.insertVinKlassifikation(this.vinKlassifikation).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
  /* #region  VindrueType */
  getVindrueTyper(): any {
    console.log('Maincomponent getVindrueTyper');
    this.wineService.getVindrueTyper().subscribe((data: VindrueType[]) => {
      this.vindrueTyper = data;
      console.log(data);
      // https://stackoverflow.com/questions/43355334/how-to-bind-data-to-bootstrap-select
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findDrueTypeViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vindrueTyper.length; i++) {
      if (this.vindrueTyper[i].id === idInt) {
        return this.vindrueTyper[i].drue;
      }
    }
    return '';
  }

  opdaterDrueType() {
    this.vindrueType.id = this.kodelisteItem.id;
    this.vindrueType.drue = this.kodelisteItem.value;
    this.wineService.updateVindrueType(this.vindrueType).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  opretDrueType() {
    this.vindrueType.drue = this.kodelisteItem.value;
    this.wineService.insertVindrueType(this.vindrueType).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
  /* #region  VinType */
  getVinTyper(): any {
    console.log('Maincomponent getVinTyper');
    this.wineService.getVinTyper().subscribe((data: VinType[]) => {
      this.vinTyper = data;
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  findVinTypeViaId(id) {
    const idInt = parseInt(id, 10);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.vinTyper.length; i++) {
      if (this.vinTyper[i].id === idInt) {
        return this.vinTyper[i].type;
      }
    }
    return '';
  }

  opretVinType() {
    this.vinType.type = this.kodelisteItem.value;
    this.wineService.insertVinType(this.vinType).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  opdaterVinType() {
    this.vinType.id = this.kodelisteItem.id;
    this.vinType.type = this.kodelisteItem.value;
    this.wineService.updateVinType(this.vinType).subscribe(data => {
      console.log(data);
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  /* #endregion */
}
