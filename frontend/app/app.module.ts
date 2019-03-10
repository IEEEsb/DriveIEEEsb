import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AngularIEEEsbLibModule } from 'angular-ieeesb-lib';

import { UserService } from './user.service';
import { FileService } from './file.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UsersEditorComponent } from './users-editor/users-editor.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { BrowserComponent } from './browser/browser.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		MainComponent,
		HomeComponent,
		AdminComponent,
		UsersEditorComponent,
		UserEditorComponent,
		BrowserComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		AngularIEEEsbLibModule.forRoot(),
		MatFileUploadModule,
	],
	providers: [
		UserService,
		FileService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
