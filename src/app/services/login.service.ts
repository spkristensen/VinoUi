import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Register } from '../model/register.model';
import { User } from '../domain/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({  providedIn: 'root' })
export class LoginService {
  Url: string;
  token: string;
  header: any;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    // this.Url = 'http://localhost:4500/api/Login/';
    const headerSettings: {[name: string]: string | string[]; } = {};
    this.header = new HttpHeaders(headerSettings);
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // var loginUrl =this.Url+'userLogin';
    return this.http.post<any>(`${environment.apiUrl}/api/login/userLogin`, { username, password })
    // return this.http.post<any>(`${loginUrl}`, { username, password })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateCurrentUser(user: User): any {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Login1(model: any) {
  //    const a = this.Url + 'UserLogin';
  //    return this.http.post<any>(this.Url + 'UserLogin', model, { headers: this.header});
  // }

  //  CreateUser(register: Register) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.post<Register[]>(this.Url + '/createcontact/', register, httpOptions);
  //  }
}
