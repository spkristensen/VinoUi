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
export class FileUploadComponent  {
  imageUrl = '../assets/img/UploadImageDefault.png';
  imageId = 0; // Når der er valgt er eksisterende billede
  imageExcistingId = '';
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
        this.imageExcistingId = message.imageName;
      }      
    })    
  }

  onFileSelected(file: FileList) {
    console.log(file);
    this.selectedFile = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.imageId = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadFoto() {
    if (this.imageExcistingId === null || this.imageExcistingId === '')
    {
      this.uploadFotoNew()    
    }
    else
    {
      this.uploadFotoExcisting();
    }
  }
  clearImage() {
    this.imageUrl = '../assets/img/UploadImageDefault.png';
  }

  uploadFotoNew()
  {    
     // https://www.youtube.com/watch?v=YkvqLNcJz3Y
     const formData = new FormData();
     formData.append('foto', this.selectedFile);
     this.fotoService.uploadFoto(this.wineService.vin.vinId, formData).subscribe(data => {
      console.log(data);
      this.messageService.success('Fotoet blev uploaded');
      $('#FileUploadModal').modal('hide');
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }

  uploadFotoExcisting()
  {
    // https://www.youtube.com/watch?v=YkvqLNcJz3Y
    this.fotoService.uploadFotoExcisting(this.wineService.vin.vinId, this.imageExcistingId,  this.imageUrl).subscribe(data => {
      console.log(data);
      this.messageService.success('Fotoet blev uploaded');
      $('#FileUploadModal').modal('hide');
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );
  }
}
function upload(event: Event): (error: any) => void {
  throw new Error('Function not implemented.');
}

