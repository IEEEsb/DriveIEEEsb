import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './guards.guard'

import { LoginComponent } from './login/login.component'
import { MainComponent } from './main/main.component'
import { HomeComponent } from './home/home.component'
import { AdminComponent } from './admin/admin.component'
import { UsersEditorComponent } from './users-editor/users-editor.component'
import { UserEditorComponent } from './user-editor/user-editor.component'
import { BrowserComponent } from './browser/browser.component'

const routes: Routes = [
	{ path: 'browser', component: BrowserComponent },
	{
		path: '', component: MainComponent, children: [
			{ path: '', component: HomeComponent },
			{ path: 'login', component: LoginComponent },
		]
	},
	{
		path: 'admin', component: AdminComponent, canActivate:[LoggedInGuard], children: [
			{ path: '', component: HomeComponent },
			{ path: 'browser', component: BrowserComponent },
			{ path: 'users', component: UsersEditorComponent },
			{ path: 'users/:userId', component: UserEditorComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
