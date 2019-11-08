import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { FotoService } from 'src/app/services/foto.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent implements OnInit {
  imageUrl = '../assets/img/UploadImageDefault.png';
  selectedFile: File = null;
  constructor(
    private messageService: MessageService,
    private fotoService: FotoService) { }

  ngOnInit() {
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

  opretBillede() {
    // https://www.youtube.com/watch?v=YkvqLNcJz3Y
    this.fotoService.uploadFoto('Test', this.selectedFile).subscribe(data => {
      console.log(data);
      this.messageService.success('Billedet blev tilføjet');
    },
      error => {
        this.messageService.error(error.message, false);
      }
    );

  }
}
