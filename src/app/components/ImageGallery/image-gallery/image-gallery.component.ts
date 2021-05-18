import { identifierName } from '@angular/compiler';
import { Component, OnChanges, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ImageInfo } from 'src/app/model/ImageInfo';
import { FotoService } from 'src/app/services/foto.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnChanges {

  images:any[];    
  filterBy?: string = 'all'    
  allImages:any[] = []; 
  imageListe: ImageInfo[];   
  //private imageUrl = new Subject<any>();
  public searchText = '';
  imageSearchSubscription: Subscription;

  constructor(private fotoService: FotoService, private messageService: MessageService) {    
    //this.allImages = this.fotoService.getImages(this.searchText); 
    this.imageSearchSubscription = fotoService.imageSearchAnnounced$.subscribe(data => {
      this.allImages = data;
      this.imageListe = data;
    });   
  }   
  
  private imageSelectedAnnounced = new Subject<any>();
  imageSelectedAnnounced$ = this.imageSelectedAnnounced.asObservable() 
  ngOnChanges() {    
    //this.allImages = this.fotoService.getImages(this.searchText);    
  }    

  imageClick(imageObj)
  {      
      this.messageService.setSelectedImage(imageObj.id, imageObj.urlResized, imageObj.imageName)      
  }  

  soeg()
  {
    this.fotoService.getImages(this.searchText)
  }
}


