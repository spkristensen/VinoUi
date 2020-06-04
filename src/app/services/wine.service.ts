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
import { Vin } from '../model/vin.model';
import { DatePipe } from '@angular/common';
import { SearchItem } from '../model/SearchItem.models';

@Injectable()
export class WineService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private datepipe: DatePipe)  {
    this.kodelisteItem = new KodelisteItem();
    this.searchItem = new SearchItem();
  }
  vinUpdate: VinUpdateReturn;
  kodelisteItem: KodelisteItem;
  searchItem: SearchItem;
  vin: Vin;

  // vinLand: vinLand;

  // Observable string sources
  private searchClickedAnnounced = new Subject<SearchItem>();
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

  private getWineAnnounced = new Subject<any>();
  getWineAnnounced$ = this.getWineAnnounced.asObservable();

  private getWineCreateAnnounced = new Subject<any>();
  getWineCreateAnnounced$ = this.getWineCreateAnnounced.asObservable();

  // Service message commands
  /* #region Vin Methods */
  search(mission: string, searchHistory: boolean) {
    this.searchItem.searchValue = mission;
    this.searchItem.searchHistory = searchHistory;
    this.searchClickedAnnounced.next(this.searchItem);
  }

  searchVin(searchItem): Observable<any> {
    console.log('WineService searchVin: ' + searchItem);
    const res = this.httpClient.get(`${environment.apiUrl}/api/wineList?searchText=` + searchItem.searchValue + `&searchHistory=` + searchItem.searchHistory);

    console.log(res);
    this.updateFooterInfoAnnounced.next('');
    return res;
  }

  exportVine(): Observable<any> {
    console.log('WineService ExportVin');    
    const res = this.httpClient.get(`${environment.apiUrl}/api/wineExport`);
    console.log(res);    
    return res;    
  }

  listVine(showHistory): Observable<any> {
    console.log('WineService ListVine');    
    const res = this.httpClient.get(`${environment.apiUrl}/api/wineList?showHistory=` + showHistory);
    console.log(res);    
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

    const res = this.httpClient.put(`${environment.apiUrl}/api/wine`, vin).subscribe((data: any) => {
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

  getAllWines(searchItem): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/wineList?searchText=` + '' + searchItem.searchValue + `&searchHistory=` + searchItem.searchHistory);
  }

  getVin(id): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService getVin: ' + id);
    this.httpClient.get(`${environment.apiUrl}/api/wineList/` + id).subscribe((vin: Vin) => {
      this.vin = vin;
      this.getWineAnnounced.next(vin);
      return vin;
    });
    return obs;
  }

  /// Hent vin der skal bruges ved oprettelse
  getVinOpret(id): Observable<any> {
    const obs = new Observable(observer => {
      observer.next(true);
      observer.complete();
    });

    console.log('WineService getVinOpret: ' + id);
    this.httpClient.get(`${environment.apiUrl}/api/wineList/` + id).subscribe((vin: Vin) => {
      const date = new Date();
      vin.koebsDato = this.datepipe.transform(date, 'yyyy-MM-dd');
      vin.vinId = -1; // ny vin
      this.vin = vin;
      this.getWineCreateAnnounced.next(vin);
      return vin;
    });
    return obs;
  }

    /* #endregion */

    /* #region VindrueType methods */
    getVindrueTyper(): Observable < any > {
      console.log('Maincomponent getVindrueTyper');
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/vindruetype`);
      // https://stackoverflow.com/questions/43355334/how-to-bind-data-to-bootstrap-select
    }

    // tslint:disable-next-line: no-shadowed-variable
    insertVindrueType(vindrueType: VindrueType): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });

      console.log('WineService insert vindrueType');
      this.httpClient.post(`${environment.apiUrl}/api/kodeliste/druetype`, vindrueType).subscribe((data: any) => {
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
    updateVindrueType(vindrueType: VindrueType): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });

      console.log('WineService update vindrueType');
      this.httpClient.put(`${environment.apiUrl}/api/kodeliste/druetype`, vindrueType).subscribe((data: any) => {
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
    getVinTyper(): Observable < any > {
      console.log('Maincomponent getVinTyper');
      // debugger;
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/vintype`);
    }
    // tslint:disable-next-line: no-shadowed-variable
    insertVinType(vinType: VinType): Observable < any > {
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
    updateVinType(vinType: VinType): Observable < any > {
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
    getVinDistrikter(landid: number): Observable < any > {
      console.log('Maincomponent   getVinDistrikter()');
      // debugger;
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/vindistrikt/` + landid);
    }
    // tslint:disable-next-line: no-shadowed-variable
    insertVinDistrikt(vinDistrikt: VinDistrikt): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });

      console.log('WineService insert VinDistrikt');
      this.httpClient.post(`${environment.apiUrl}/api/kodeliste/distrikt`, vinDistrikt).subscribe((data: any) => {
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

    updateVinDistrikt(vinDistrikt: VinDistrikt): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });

      console.log('WineService update VinDistrikt');
      this.httpClient.put(`${environment.apiUrl}/api/kodeliste/distrikt`, vinDistrikt).subscribe((data: any) => {
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
    getVinFlaskestoerrelser(): Observable < any > {
      console.log('Maincomponent getVinFlaskestoerrelser');
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/flaskestoerrelse`);
    }
    // tslint:disable-next-line: no-shadowed-variable
    insertVinFlaskestoerrelse(vinFlaskestoerrelse: VinFlaskestoerrelse): Observable < any > {
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
    updateVinFlaskestoerrelse(vinFlaskestoerrelse: VinFlaskestoerrelse): Observable < any > {
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
    getVinindkoebssteder(): Observable < any > {
      console.log('Maincomponent getVinindkoebssteder');
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/indkoebssted`);
    }

    insertVinindkoebssted(vinindkoebssted: VinIndkoebssted): Observable < any > {
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

    updateVinindkoebssted(vinindkoebssted: VinIndkoebssted): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
      console.log('WineService update VinIndkøbssted');
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
    getVinKlassifikationer(landid: number): Observable < any > {
      console.log('Maincomponent getVinKlassifikationer');
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/klassifikation/` + landid);
    }

    // tslint:disable-next-line: no-shadowed-variable
    insertVinKlassifikation(vinKlassifikation: VinKlassifikation): Observable < any > {
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
    updateVinKlassifikation(vinKlassifikation: VinKlassifikation): Observable < any > {
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
    getVinLande(): Observable <any> {
      // const obs = new Observable(observer => {
      //   observer.next(true);
      //   observer.complete();
      // });
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/land`);
      // console.log('Maincomponent getVinLande');
      // const key = 'Vinlande';
      // localStorage.removeItem(key);
      // const localVinlande = localStorage.getItem(key);
      // if (localVinlande == null) {
      //   // const lande = this.httpClient.get(`${environment.apiUrl}/api/kodeliste/land`);
      //   // localStorage.setItem(key, JSON.stringify(lande));
      //   //     // tslint:disable-next-line: align
      //   //     const getlocalVinlande = JSON.parse(localStorage.getItem(key) || '[]');
      //   // return getlocalVinlande as Observable<[]>;
      //      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/land`).subscribe((vinLande: any) => {
      //       localStorage.setItem(key, JSON.stringify(vinLande));
      //       const getlocalVinlande = JSON.parse(localStorage.getItem(key) || '[]');
      //       return getlocalVinlande as Observable<[]>;
      //       // return vinLande;
      //     });
      // } else {
      //   const getlocalVinlande = JSON.parse(localStorage.getItem(key) || '[]');
      //   return getlocalVinlande;
      // }
      // return obs;
      // if (localVinlande == null) {
      //   this.httpClient.get(`${environment.apiUrl}/api/kodeliste/land`).subscribe((vinLande: any) => {
      //     localStorage.setItem(key, JSON.stringify(vinLande));
      //     let getlocalVinlande = JSON.parse(localStorage.getItem(key));
      //     return getlocalVinlande;

      //     return vinLande;
      // });
      //   return JSON.parse(localStorage.getItem(key));
  }

    insertLand(vinland: VinLand): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
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

    updateLand(vinland: VinLand): Observable < any > {
      const obs = new Observable(observer => {
        observer.next(true);
        observer.complete();
      });

      console.log('WineService update vinland');
      this.httpClient.put(`${environment.apiUrl}/api/kodeliste/land`, vinland).subscribe((data: any) => {
        this.kodelisteItem.value = ' med id ' + data + ' blev gemt';
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
    getVinProducenter(landid: number): Observable < any > {
      console.log('Maincomponent getVinProducenter');
      // debugger;
      return this.httpClient.get(`${environment.apiUrl}/api/kodeliste/producent/` + landid);
    }

    // tslint:disable-next-line: no-shadowed-variable
    insertProducent(vinProducent: VinProducent): Observable < any > {
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
    updateProducent(vinProducent: VinProducent): Observable < any > {
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
