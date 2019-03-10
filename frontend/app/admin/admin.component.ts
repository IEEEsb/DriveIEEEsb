import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

const config = require('../../../config.json');

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

	activeLink = '';
	user;
	menuItems = {
		left: [
			{
				text: 'Archivos',
				type: 'router', // router, link or callback
				link: '/admin/browser',
				roles: [config.adminRole],
			},
			{
				text: 'Usuarios',
				type: 'router', // router, link or callback
				link: '/admin/users',
				roles: [config.adminRole],
			}
		],
		right: []
	};

	constructor(private userService: UserService, private location: Location, private router: Router) {
		this.router.events.subscribe((val) => {
			this.activeLink = this.location.path() === '' ? '/' : this.location.path();
		});
	}

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			this.user = user;
		});
	}

}