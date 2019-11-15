import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';
import { Image } from '../model/Image.model';

@Injectable()
export class FotoService {
    constructor(private httpClient: HttpClient, private messageService: MessageService) {
    }

    private fileUploadedAnnounced = new Subject<any>();
    fileUploadedAnnounced$ = this.fileUploadedAnnounced.asObservable();

    uploadFoto(wineId: number, fileToUpload: File): Observable<any> {
        const obs = new Observable(observer => {
            observer.next(true);
            observer.complete();
        });
        console.log('FotoService upload foto');
        const formData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        // formData.append('ImageCaption', caption);
        formData.append('WineId', wineId.toString());

        this.httpClient.post(`${environment.apiUrl}/api/image`, formData).subscribe((data: any) => {
            this.fileUploadedAnnounced.next(data);
        },
            error => {
                this.messageService.error(error.title, false);
            });
        return obs;
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
