import { APP_BASE_HREF } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared-module';
import { LoginModule } from '../login/login-module';
import { PortalModule } from '../portal/portal-module';

import { AppComponent } from './app-component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent
    }
];

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true }),
        SharedModule,
        LoginModule,
        PortalModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: APP_BASE_HREF, useValue: '/'
        }
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {

}

