import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    updatePersonalInfo(user: User): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/user/personal-info/`, user);
    }

    updatePassword(passwordNew: string, passwordOld: string): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/user/password/`, {
            new: passwordNew,
            old: passwordOld
        });
    }
}