import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { FotoService } from 'src/app/services/foto.service';
import { Vin } from '../../model/vin.model';
import { WineService } from '../../services/wine.service';
import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  imageUrl = '../assets/img/UploadImageDefault.png';
  selectedFile: File = null;
  vin: Vin;
  messageServiceSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private wineService: WineService,
    private fotoService: FotoService) {

    // Her under har  vi abonnement på meddelelser der bliver sendt fra MessageService
    this.messageServiceSubscription = messageService.getMessage().subscribe(message => {
      if (message.type === 'info') {
        this.imageUrl = message.url;
      }
    })
  }

  onFileSelected(file: FileList) {
    console.log(file);
    this.selectedFile = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadFoto() {
    // https://www.youtube.com/watch?v=YkvqLNcJz3Y
    this.fotoService.uploadFoto(this.wineService.vin.vinId, this.selectedFile).subscribe(data => {
      console.log(data);
      this.messageService.success('Fotoet blev uploaded');
      $('#FileUploadModal').modal('hide');
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
  clearImage() {
    this.imageUrl = '../assets/img/UploadImageDefault.png';
  }
}
