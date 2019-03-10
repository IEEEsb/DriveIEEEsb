import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';

import { LoadingService, UtilsService } from 'angular-ieeesb-lib';

import { User } from '../../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	constructor(private http: HttpClient, private loadingService: LoadingService, private utilsService: UtilsService) {
	}

	getAuthData() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/auth')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getLoggedUser() {
		this.getSelfUser().subscribe();
		return this.userSubject.asObservable();
	}

	getSelfUser() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/user/self/')
		.pipe(
			tap((data) => {
				this.userSubject.next(data.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getUser(userId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/user/${userId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAllUsers() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/user/all/')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	login(token) {
		this.loadingService.setLoading();
		return this.http.post<any>('api/user/login/', { token })
		.pipe(
			tap((data) => {
				this.userSubject.next(data.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	logout() {
		this.loadingService.setLoading();
		return this.http.post<any>('api/user/logout/', {})
		.pipe(
			tap((data) => {
				this.userSubject.next(null);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addRole(userId, role) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/user/${userId}/addRole`, { role })
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}
}
