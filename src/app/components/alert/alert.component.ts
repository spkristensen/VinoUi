import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { Subject } from 'rxjs';
import { debounceTime, retry } from 'rxjs/operators';
import { AlertInfo } from 'src/app/model/alertinfo.model';
import { Xtb } from '@angular/compiler';


@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  successMessage: string;
  message: any;
  // obj : MessageInfo;
  private success = new Subject<string>();
  alert: AlertInfo;

  constructor(private messageService: MessageService) {

  }
  ngOnInit() {
    // this.success.pipe(debounceTime(10000)).subscribe(() => this.message = null);
    // this.success.subscribe((message) => this.message = message);
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message !== undefined) {
        const messageObject = {
          type : '',
          text: ''
        };
        if (message.type === 'success') {
          messageObject.text = message.text;
        }
        if (message.type === 'error') {
          // tslint:disable-next-line: triple-equals
          if (message.text.title == undefined) {
            messageObject.text = message.text;
          } else {
            messageObject.text = message.text.title;
          }
        }
        messageObject.type = message.type;
        this.message = messageObject;
      }
    });
  }
  // ngOnInit() {
  //   this.success.pipe(debounceTime(10000)).subscribe(() => this.successMessage = null);
  //   this.success.subscribe((message) => this.successMessage = message);

  //   // abonner på meddelelser fra alertservice
  //   this.subscription = this.messageService.getMessage().subscribe(message => {
  //     if (message !== undefined) {
  //       this.alert = new AlertInfo('', '');
  //       if (message.type === 'success')
  //         this.alert.type = "success";
  //       else
  //       {
  //         this.alert.type = "danger";
  //       }
  //       this.success.next(message);
  //     }
  //   });
  // }
  ngOnDestroy() {
      if (this.subscription === undefined) {
        return;
      }
      this.subscription.unsubscribe();
    }
  }


  // ngOnInit() {
  //   this.success.pipe(debounceTime(2000)).subscribe(() => this.successMessage = null);
  //   this.success.subscribe((message) => this.successMessage = message);

  //   // abonner på meddelelser fra alertservice
  //   this.subscription = this.messageService.getMessage().subscribe(message => {

  //     if (message !== undefined) {
  //       this.alert = new AlertInfo('', '');
  //       if (message.type === 'success')
  //         this.alert.type = "success";
  //       else
  //         this.alert.type = "danger";

  //       this.success.next(message);
  //       this.successMessage = message;
  //     }
  //   });


