import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListComponent } from './components/list/list.component';
import { ListeComponent } from './components/liste/liste.component';
import { WineComponent } from './components/wine/wine.component';
import { AuthGuard } from './guards/auth-guard';
import { FooterComponent } from './footer/footer.component';

// https://www.c-sharpcorner.com/article/create-registration-and-login-page-using-angular-7-and-web-api/

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', },
  { path: 'login', component: LoginComponent, data: { title: 'Login Page'}},
  { path: 'list', component: ListComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]},
  { path: 'Wine', component: WineComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]},
  { path: 'VinListe', component: ListeComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]},
  { path: 'Footer', component: FooterComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
