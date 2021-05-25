import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';
import { Image } from '../model/Image.model';
import { ImageInfo } from '../model/ImageInfo';
import { ImageObjectId } from '../model/ImageObjectId';

@Injectable()
export class FotoService {

    constructor(        
        private httpClient: HttpClient,
        private messageService: MessageService) {                
      }

    allImages = [];
    private fileUploadedAnnounced = new Subject<any>();
    fileUploadedAnnounced$ = this.fileUploadedAnnounced.asObservable();
    
    private fileUploadedAnnouncedEcixting = new Subject<any>();
    fileUploadedAnnouncedExcisting$ = this.fileUploadedAnnouncedEcixting.asObservable();
    
    private imageSearchAnnounced = new Subject<any>();
    imageSearchAnnounced$ = this.imageSearchAnnounced.asObservable();

    uploadFoto(wineId: number, file: FormData): Observable<any> {
        const obs = new Observable(observer => {
            observer.next(true);
            observer.complete();
        });
        console.log('FotoService upload foto');
        
        // https://www.remotestack.io/post-multipart-form-data-in-angular-with-httpclient/
        const url = `${environment.apiUrl}/api/image/upload/${wineId}`;
        this.httpClient.post(url, file).subscribe((data: any) => {
            this.fileUploadedAnnounced.next(data);
        },
            error => {
                this.messageService.error(error.title, false);
            });
        return obs;
    }

    uploadFotoExcisting(wineId: number, imageId: string, fotoUrl: string): Observable<any> {
        const obs = new Observable(observer => {
            observer.next(true);
            observer.complete();
        });
        
        // Her skal vi opdatere vinen med id på et eksisterende billede.
        // Id på billede der er gemt i db er navnet  på den fysiske billedeFil
        const imageObjId : ImageObjectId = {
            vinId: wineId,
            imageId: imageId
          };
        
        const url = `${environment.apiUrl}/api/wine/image`;
        this.httpClient.put(url, imageObjId).subscribe((data: any) => {
            this.fileUploadedAnnouncedEcixting.next(data);
        },
            error => {
                this.messageService.error(error.title, false);
            });
        return obs;
    }
       
    getImages(searchText: string): Observable<any> {
        console.log('FotoService getImages ' + searchText);  
        const obs = new Observable(observer => {
            observer.next(true);
            observer.complete();
        });

        const store = 1;
        const url = `${environment.apiUrl}/api/image/getimagelist/${searchText}?subDirEnum=${store}`;        

        this.httpClient.get(url).subscribe((data: any) => {
            this.imageSearchAnnounced.next(data);                                        
        });
        return obs;         
      }

    getImagesOld(searchText: string) {    
        //return this.allImages = Imagesdelatils.slice(0);    
        return this.allImages = ImagesDetails;    
    }   

    getImage(id: number) {    
        return ImagesDetails.slice(0).find(Images => Images.id == id)    
    }  
    
    // DownloadImage(image: Image): Observable<any> {                      
    //        return this.httpClient.post('${environment.apiUrl}/api/image`', image)
    //        { responseType: ResponseContentType.Blob })
    //        .map(
    //          (res) => {
    //                let blob = new Blob([res.blob()], {type: fileExtension} )
    //                return blob;
    //          });
    //      }

}
const ImagesDetails = [    
    { "id": 1, "url": "http://localhost:4500/Image/2015-negroamaro.jpg" },    
    { "id": 2, "url": "http://localhost:4500/Image/2015-negroamaro100x100.jpg" },        
    { "id": 3, "url": "http://localhost:4500/Image/2015-negroamaro150x150.jpg" },        
    { "id": 4, "url": "http://localhost:4500/Image/couveys-bg-auth-pinot-noir.jpg" },        
    { "id": 5, "url": "http://localhost:4500/Image/Grahams1985.jpg" },      
    { "id": 5, "url": "http://localhost:61000/Image/Torsk.jpg" }  
]  
