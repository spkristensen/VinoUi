import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({  providedIn: 'root'})
export class AuthenticationService {
  Url: string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

    // constructor(private http: HttpClient) {
    //     this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    //     this.currentUser = this.currentUserSubject.asObservable();
    // }
    constructor(private http: HttpClient) {
        // this.Url = 'http://localhost:4500/api/Login/';
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
      }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // login(mail: string, password: string) { // se hvordan du kalder til webapi de andre steder
    //   var a = 'http://4500/api/Login/UserLogin';
    //   //return this.http.post<any>(`${environment.apiUrl}/auth`, { mail, password })
    //   return this.http.post<any>(`${a}/auth`, { mail, password })
    //         .pipe(map(user => {
    //             //login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 // store user details and jwt token in local storage to keep user logged in between page refreshes
    //                 localStorage.setItem('currentUser', JSON.stringify(user));
    //                 this.currentUserSubject.next(user);
    //             }

    //             return user;
    //         }));
    // }

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
}
