import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../services/message.service';
import { VinUpdateReturn } from '../model/vin-update-return.model';
import { KodelisteItem } from '../model/kodeliste-item.model';
import { VinLand } from '../model/vin-land.model';
import { VinProducent } from '../model/vin-producent.model';
import { VinKlassifikation } from '../model/vin-klassifikation.model';
import { VinIndkoebssted } from '../model/vin-indkoebssted.model';
import { VinFlaskestoerrelse } from '../model/vin-flaskestoerrelse.model';
import { VinDistrikt } from '../model/vin-distrikt.model';
import { VinType } from '../model/vin-type.model';
import { VindrueType } from '../model/vindrue-type.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class WineService {

  constructor(private httpClient: HttpClient,  private messageService: MessageService) {
    this.kodelisteItem = new KodelisteItem();
  }
  vinUpdate: VinUpdateReturn;
  kodelisteItem: KodelisteItem;
   // vinLand: vinLand;

  // Observable string sources
  private searchClickedAnnounced = new Subject<string>();
  searchClickedAnnounced$ = this.searchClickedAnnounced.asObservable();

  private wineCreatedAnnounced = new Subject<string>(); // Vin oprettet og den der lytter kan gøre et eller andet
  wineCreatedAnnounced$ = this.wineCreatedAnnounced.asObservable();

  private wineDeletedAnnounced = new Subject<string>(); // Vin slettet og den der lytter kan gøre et eller andet
  wineDeletedAnnounced$ = this.wineDeletedAnnounced.asObservable();

  private wineUpdatedAnnounced = new Subject<VinUpdateReturn>(); // Vin ændret og den der lytter kan gøre et eller andet
  wineUpdatedAnnounced$ = this.wineUpdatedAnnounced.asObservable();

  private updateFooterInfoAnnounced = new Subject<string>();
  updateFooterInfoAnnounced$ = this.updateFooterInfoAnnounced.asObservable();

  private kodelisteItemUpdatedAnnounced = new Subject<any>();
  kodelisteItemUpdatedAnnounced$ = this.kodelisteItemUpdatedAnnounced.asObservable();

  // Service message commands
  /* #region Vin Methods */
  search(mission: string) {
    this.searchClickedAnnounced.next(mission);
  }

  searchVin(searchString): Observable<any> {
    console.log('WineService searchVin');
    console.log('WineService searchVin: ' + searchString);
    const res = this.httpClient.get(`${environment.apiUrl}/api/wineList?searchText=` + searchString);

    console.log(res);
    this.updateFooterInfoAnnounced.next('');
    return res;
  }

  getFooterInfo(): Observable<any> {
    console.log('WineService getfooterInfo: ');
    return this.httpClient.get(`${environment.apiUrl}/api/footer`);
  }

  opdaterVin(vin): Observable<any> {
    console.log('WineService UpdateVin');
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
    this.vinUpdate = new VinUpdateReturn(vin.vinId);

    const res = this.httpClient.put(`${environment.apiUrl}/api/wine/` + vin.vinId, vin).subscribe((data: any) => {
      this.vinUpdate.status = data;
      this.vinUpdate.vinId = vin.vinId;
      this.wineUpdatedAnnounced.next(this.vinUpdate);
      this.updateFooterInfoAnnounced.next('');
      return this.vinUpdate;
    },
    error => {
      this.messageService.error(error.message, false);
    });
    return obs;
  }

  opretVin(vin): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService InsertVin');
    this.httpClient.post(`${environment.apiUrl}/api/wine`, vin).subscribe((data: any) => {
      this.wineCreatedAnnounced.next(data);
      this.updateFooterInfoAnnounced.next('');
      return data;
    },
    error => {
      this.messageService.error(error.message, false);
    });
    return obs;
  }

  sletVin(vinId): Observable<any> {
    console.log('WineService DeleteVin');
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    const res = this.httpClient.delete(`${environment.apiUrl}/api/wine/` + vinId).subscribe((data: any) => {
      this.wineDeletedAnnounced.next(data);
      this.updateFooterInfoAnnounced.next('');
      return res;
    },
    error => {
      this.messageService.error(error.message, false);
    });
    return obs;
  }

  getAllWines(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/wineList?searchText=` + '');
  }

  getVin(id): Observable<any> {
    console.log('WineService getVin: ' + id);
    const vin = this.httpClient.get(`${environment.apiUrl}/api/wineList/` + id);
    console.log(vin);
    return vin;
  }
  /* #endregion */

  /* #region VindrueType methods */
  getVindrueTyper(): Observable<any> {
    console.log('Maincomponent getVindrueTyper');
    return this.httpClient.get(`${environment.apiUrl}api/kodeliste/vindruetype`);
    // https://stackoverflow.com/questions/43355334/how-to-bind-data-to-bootstrap-select
  }

  // tslint:disable-next-line: no-shadowed-variable
  insertVindrueType(vindrueType: VindrueType): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert vindrueType');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/vindruetype`, vindrueType).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'DrueType';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vindrueType fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateVindrueType(vindrueType: VindrueType): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vindrueType');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/vindruetype`, vindrueType).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'DrueType';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vindrueType fejlede ' + error.message, false);
      }
    );
    return obs;
  }
/* #endregion */

  /* #region VinType methods */
  getVinTyper(): Observable<any> {
    console.log('Maincomponent getVinTyper');
    // debugger;
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/vintype`);
  }
  // tslint:disable-next-line: no-shadowed-variable
  insertVinType(vinType: VinType): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert vinType');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/vintype`, vinType).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'VinType';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vinType fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateVinType(vinType: VinType): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinType');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/vintype`, vinType).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'VinType';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinType fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

  /* #region VinDistrikt methods */
  getVinDistrikter(): Observable<any> {
    console.log('Maincomponent   getVinDistrikter()');
    // debugger;
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/vindistrikt`);
  }
  // tslint:disable-next-line: no-shadowed-variable
  insertVinDistrikt(vinDistrikt: VinDistrikt): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert VinDistrikt');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/vindistrikt`, vinDistrikt).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Distrikt';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af VinDistrikt fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  updateVinDistrikt(vinDistrikt: VinDistrikt): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update VinDistrikt');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/vindistrikt`, vinDistrikt).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Distrikt';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af VinDistrikt fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

  /* #region VinFlaskestoerrelse methods */
  getVinFlaskestoerrelser(): Observable<any> {
    console.log('Maincomponent getVinFlaskestoerrelser');
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/flaskestoerrelse`);
  }
  // tslint:disable-next-line: no-shadowed-variable
  insertVinFlaskestoerrelse(vinFlaskestoerrelse: VinFlaskestoerrelse): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert vinFlaskestoerrelse');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/flaskestoerrelse`, vinFlaskestoerrelse).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Flaskestørrelse';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vinFlaskestoerrelse fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateVinFlaskestoerrelse(vinFlaskestoerrelse: VinFlaskestoerrelse): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinFlaskestoerrelse');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/flaskestoerrelse`, vinFlaskestoerrelse).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Flaskestørrelse';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinFlaskestoerrelse fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  /* #endregion */

  /* #region Vinindkoebssted methods  */
  getVinindkoebssteder(): Observable<any> {
    console.log('Maincomponent getVinindkoebssteder');
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/indkoebssted`);
  }

  insertVinindkoebssted(vinindkoebssted: VinIndkoebssted): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert Vinindkoebssted');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/indkoebssted`, vinindkoebssted).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Indkøbssted';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vinindkoebssted fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  updateVinindkoebssted(vinindkoebssted: VinIndkoebssted): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinKlassifikation');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/indkoebssted`, vinindkoebssted).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Indkøbssted';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinindkoebssted fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

  /* #region VinKlassifikation methods */
  getVinKlassifikationer(): Observable<any> {
    console.log('Maincomponent getVinKlassifikationer');
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/klassifikation`);
  }

  // tslint:disable-next-line: no-shadowed-variable
  insertVinKlassifikation(vinKlassifikation: VinKlassifikation): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert vinKlassifikation');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/klassifikation`, vinKlassifikation).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Klassifikation';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vinKlassifikation fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateVinKlassifikation(vinKlassifikation: VinKlassifikation): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinKlassifikation');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/klassifikation`, vinKlassifikation).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Klassifikation';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinKlassifikation fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

  /* #region Vinland Methods */
  getVinLande(): Observable<any> {
    console.log('Maincomponent getVinLande');
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/land`);
  }

  insertLand(vinland: VinLand): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert vinland');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/land`, vinland).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Land';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      // data skal  være et object med en text og en type der fortæller hvilken kodeliste der blev opdateret.
      // Det skal bruges til at styre hvilken kodeliste der skal refreshes efter opdatering
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af vinland fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  updateLand(vinland: VinLand): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinland');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/land`, vinland).subscribe((data: any) => {
      this.kodelisteItem.value = 'Land med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Land';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinland fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

  /* #region VinProducent methods */
  getVinProducenter(): Observable<any> {
    console.log('Maincomponent getVinProducenter');
    // debugger;
    return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/producent`);
  }

  // tslint:disable-next-line: no-shadowed-variable
  insertProducent(vinProducent: VinProducent): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService insert VinProducent');
    this.httpClient.post(`${environment.apiUrl}/api/kodeliste/producent`, vinProducent).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev oprettet';
      this.kodelisteItem.type = 'Producent';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      // data skal  være et object med en text og en type der fortæller hvilken kodeliste der blev opdateret.
      // Det skal bruges til at styre hvilken kodeliste der skal refreshes efter opdatering
      return data;
    },
      error => {
        this.messageService.error('Oprettelse af VinProducent fejlede ' + error.message, false);
      }
    );
    return obs;
  }

  // tslint:disable-next-line: no-shadowed-variable
  updateProducent(vinProducent: VinProducent): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService update vinProducent');
    this.httpClient.put(`${environment.apiUrl}/api/kodeliste/producent`, vinProducent).subscribe((data: any) => {
      this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
      this.kodelisteItem.type = 'Producent';
      this.kodelisteItemUpdatedAnnounced.next(this.kodelisteItem);
      return data;
    },
      error => {
        this.messageService.error('Ændring af vinProducent fejlede ' + error.message, false);
      }
    );
    return obs;
  }
  /* #endregion */

}
// https://stackoverflow.com/questions/30067767/how-do-i-collapse-sections-of-code-in-visual-studio-code-for-windows
// https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder ctrl M+R
