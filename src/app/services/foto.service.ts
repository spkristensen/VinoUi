import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/message.service';

@Injectable()
export class FotoService {
    constructor(private httpClient: HttpClient, private messageService: MessageService) {
    }

    private fileUploadedAnnounced = new Subject<any>();
    fileUploadedAnnounced$ = this.fileUploadedAnnounced.asObservable();

    uploadFoto(caption: string, fileToUpload: File): Observable<any> {
        const obs = new Observable(observer => {
            observer.next(true);
            observer.complete();
        });
        console.log('FotoService upload foto');
        const formData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        formData.append('ImageCaption', caption);

        this.httpClient.post(`${environment.apiUrl}/api/foto`, formData).subscribe((data: any) => {
            this.fileUploadedAnnounced.next();
        },
            error => {
                this.messageService.error(error.title, false);
            });
        return obs;
    }
}
