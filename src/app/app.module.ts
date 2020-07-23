import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { WineService } from './services/wine.service';
import { DatePipe } from '@angular/common';
import { DanishDateFormatter } from './formater/danish-date.formatter.component';
import { AlertComponent } from './components/alert/alert.component';
import { WineComponent } from './components/wine/wine.component';
import { ListComponent } from './components/list/list.component';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { jqxSplitterModule } from 'jqwidgets-ng/jqxsplitter';
import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FotoService } from './services/foto.service';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ListeComponent } from './components/liste/liste.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    WineComponent,
    ListComponent,
    LoginComponent,
    FileUploadComponent,
    ListeComponent        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Ingen data er hentet.',
        totalMessage: 'I alt',
        selectedMessage: 'Valgt(e)'
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    jqxTreeModule,
    jqxExpanderModule,
    jqxSplitterModule,
    jqxMenuModule,
    jqxPanelModule, 
    jqxGridModule,   
    NgxSpinnerModule,
    FontAwesomeModule
  ],
  providers: [
    WineService,
    FotoService,
    DatePipe,
    { provide: NgbDateParserFormatter, useClass: DanishDateFormatter},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
