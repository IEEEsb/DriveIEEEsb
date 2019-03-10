import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';

import { LoadingService, UtilsService } from 'angular-ieeesb-lib';

import { File } from '../../models/File';

@Injectable({
	providedIn: 'root'
})
export class FileService {


	constructor(private http: HttpClient, private loadingService: LoadingService, private utilsService: UtilsService) { }

	getFileData(fileId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/file/${fileId}/data`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAllFilesData() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/file/all/data')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAllImageFilesData() {
		this.loadingService.setLoading();
		return this.http.get<any>('api/file/all/image/data')
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	removeFile(fileId) {
		this.loadingService.setLoading();
		return this.http.delete<any>(`api/file/${fileId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}
}
