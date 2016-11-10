import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-ga';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [
        Angulartics2GoogleAnalytics
    ],
    exports: [ Angulartics2GoogleAnalytics ]
})
export class AnalyticsSharedModule { }