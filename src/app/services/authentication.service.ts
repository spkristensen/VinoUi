import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../model/user.model';


@Injectable({  providedIn: 'root'})
export class AuthenticationService {
  Url: string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        // this.Url = 'http://localhost:4500/api/Login/';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
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
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
      }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    updateCurrentUser(user: User): any {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
