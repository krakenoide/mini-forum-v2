import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User';

@Injectable()
export class UsersService {
    apiUrl = 'http://localhost:8080/';

    users: User[] = [];
    usersSubject = new Subject<User[]>();

    connectedUser?: User;
    connectedUserSubject = new Subject<User>();

    constructor(private httpClient: HttpClient) {
        this.setConnectedUserFromLocalStorage();
        this.httpClient.get<User[]>(this.apiUrl + 'api/user', { observe: 'body' }).subscribe((users: User[]) => {
            this.users = users.map(user => {
                return user;
            });

            this.emitUsers();
        });
    }

    emitUsers(): void {
        this.usersSubject.next(this.users);
    }

    emitConnectedUser(): void {
        this.connectedUserSubject.next(this.connectedUser);
    }

    setConnectedUserFromLocalStorage(): void {
        if (localStorage.getItem('connectedUser')) {
            this.connectedUser = JSON.parse(localStorage.getItem('connectedUser')!);
            this.emitConnectedUser();
        }
    }

    saveConnectedUserToLocalStorage(user: User): void {
        localStorage.setItem('connectedUser', JSON.stringify(user));
        this.setConnectedUserFromLocalStorage();
    }

    removeConnectedUserFromLocalStorage(): void {
        localStorage.removeItem('connectedUser');

        this.connectedUser = undefined;
        this.emitConnectedUser();
    }

    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.apiUrl + 'api/user', { observe: 'body' });
    }

    createNewUser(user: User): Observable<User> {
        return this.httpClient.post<User>(this.apiUrl + 'api/user', user);
    }

    login(user: User): Observable<User> {
        return this.httpClient.post<User>(this.apiUrl + 'login', user);
    }

    updateUser(user: User): Observable<User> {
        return this.httpClient.patch<User>(this.apiUrl + 'api/user/' + user.id, user);
    }

    updateUserAdmin(user: User, nusername: string, admin: User, droit: boolean): Observable<User> {
        return this.httpClient.patch<User>(this.apiUrl + 'api/user/' + user.id, {username:nusername,connectedUser:admin, isAdmin: droit});
    }

    userToAdmin(user: User, username: string,admin: User, droit: boolean): Observable<User> {
        return this.httpClient.patch<User>(this.apiUrl + 'api/user/' + user.id, {username:username,connectedUser:admin, isAdmin: droit});
    }

    deleteUser(user:User): Observable<User> {
        return this.httpClient.delete<User>(this.apiUrl + 'api/user/' + user.id);
    }
}