import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable({providedIn: 'root'})
export class MessageService {
 //https://jasonwatmore.com/post/2020/07/06/angular-10-communicating-between-components-with-observable-subject
  private subject = new Subject<any>();
    
  success(message: string) {
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.subject.next({ type: 'error', text: message });
  }

  setSelectedImage(imageUrl: string, imageName: string) {    
    this.subject.next({ type: 'info', url: imageUrl, imageName: imageName });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}


