import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule }    from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { SharedModule } from '../shared/shared-module';

import { LoginComponent } from './login-component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix', //default
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent,
    }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        LoginComponent
    ]
})
export class LoginModule {

}

