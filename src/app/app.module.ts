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
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { jqxSplitterModule } from 'jqwidgets-ng/jqxsplitter';
import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
// import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    WineComponent,
    ListComponent,
    // RegisterComponent,
    LoginComponent,
    // SharedModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiModule,
    HttpClientModule,
    jqxTreeModule,
    jqxExpanderModule,
    jqxSplitterModule,
    jqxMenuModule,
    jqxPanelModule,
    jqxListBoxModule
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
