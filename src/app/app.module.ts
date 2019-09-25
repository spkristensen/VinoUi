import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UiModule } from './ui/ui.module';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { WineService } from './services/wine.service';
import { DatePipe } from '@angular/common';
import { DanishDateFormatter } from './formater/danish-date.formatter.component';
import { AlertComponent } from './components/alert/alert.component';
import { WineComponent } from './wine/wine.component';
import { ListComponent } from './list/list.component';
import { jqxExpanderComponent } from 'jqwidgets-ng/jqxexpander'
import { jqxSplitterComponent } from 'jqwidgets-ng/jqxsplitter';
import { jqxTreeComponent } from 'jqwidgets-ng/jqxtree';
import { jqxPanelComponent } from 'jqwidgets-ng/jqxpanel';
import { jqxListBoxComponent } from 'jqwidgets-ng/jqxlistbox';
import { jqxMenuComponent } from 'jqwidgets-ng/jqxmenu';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,    
    AlertComponent,  
    HeaderComponent,
    FooterComponent,     
    WineComponent,
    ListComponent,
    jqxExpanderComponent,
    jqxSplitterComponent,
    jqxTreeComponent,
    jqxPanelComponent,
    jqxMenuComponent,
    jqxListBoxComponent,
    RegisterComponent,    
    LoginComponent   
  ],
  imports: [  
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiModule,
    HttpClientModule
  ],
  providers: [
    WineService,
    DatePipe,
    { provide: NgbDateParserFormatter, useClass: DanishDateFormatter},    
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
