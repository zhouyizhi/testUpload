import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule }    from '@angular/http';

import { SharedModule } from '../shared/shared-module';

import { PortalComponent } from './portal-component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix', //default
        redirectTo: 'login'
    },
    {
        path: 'portal',
        component: PortalComponent,
    }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [PortalComponent]
})
export class PortalModule {

}

