import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ListComponent } from './list/list.component'
import { WineComponent } from './wine/wine.component'
import { AuthGuard } from './guards/auth-guard';
import { FooterComponent } from './footer/footer.component';

//https://www.c-sharpcorner.com/article/create-registration-and-login-page-using-angular-7-and-web-api/

// const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'list', component: ListComponent },
//   { path: 'settings', component: SettingsComponent },
//   //otherwise redirect to home
//   { path: '**', redirectTo: '' }];

export const routes: Routes = [      
  { path: '', redirectTo: 'login', pathMatch: 'full',},    
  { path: 'login',component: LoginComponent, data: { title: 'Login Page'}},      
  { path: 'list',component: ListComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]},      
  { path: 'Wine',component: WineComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]},
  { path: 'Footer',component: FooterComponent, data: { title: 'Vino'}, canActivate: [AuthGuard]}
];    

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
