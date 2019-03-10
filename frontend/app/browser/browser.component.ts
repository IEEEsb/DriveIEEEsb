import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService, WindowRef } from 'angular-ieeesb-lib';
import { UserService } from '../user.service';
import { FileService } from '../file.service';

const config = require('../../../config.json');

@Component({
	selector: 'app-browser',
	templateUrl: './browser.component.html',
	styleUrls: ['./browser.component.less']
})
export class BrowserComponent implements OnInit {

	type = 'all';
	user;
	ckeditor;
	files = [];
	admin = false;
	selected = -1;

	@ViewChild('fileUploadQueue') fileUploadQueue: ElementRef<HTMLInputElement>;

	constructor(private utilsService: UtilsService, private userService: UserService, private fileService: FileService, private router: Router, private winRef: WindowRef) { }

	ngOnInit() {
		console.log('drive')
		this.utilsService.getParams().subscribe((params) => {
			if(!params) return;

			if(params.type) {
				this.type = params.type;
				(this.type === 'image' ? this.fileService.getAllImageFilesData() : this.fileService.getAllFilesData()).subscribe((data) => {
					this.files = data.files;
				});
			}

			if(params.CKEditor && params.CKEditorFuncNum && params.langCode) {
				this.ckeditor = {
					instance: params.CKEditor,
					refNumber: params.CKEditorFuncNum,
					langCode: params.langCode,
				};
			}

		});

		this.userService.getLoggedUser().subscribe((user) => {
			if(!user) return;
			this.user = user;
			this.admin = this.user.roles.includes(config.adminRole);
		});
	}

	sendFile(file) {
		let url = this.type === 'image' ? `${config.host}/api/file/${file._id}` : `${config.host}/api/file/${file._id}/download`
		if (this.ckeditor && window.opener.CKEDITOR) {
			window.opener.CKEDITOR.tools.callFunction(this.ckeditor.refNumber, url);
		} else if (window.opener) {
			window.opener.postMessage({
				file,
				url,
			}, "*");
		}

		window.close();
		return;
	}

	removeFile(file) {
		this.fileService.removeFile(file._id).subscribe(
			(data) => {

			},
			(error) => {

			}
		);
	}

	isImage(file){
		return /image.*/.test(file.mimeType);
	}

	getFileExtension(file) {
		const nameParts = file.name.split('.');
		return nameParts[nameParts.length - 1];

	}

	getPrevImage(file) {
		if (this.isImage(file)) {
			return '/api/file/' + file._id;
		}

		return 'assets/file-icons/' + this.getFileExtension(file) + '.png';
	}

}
