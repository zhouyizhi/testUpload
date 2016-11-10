import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UtilService } from './services/util-service';
import { HttpService } from './services/http-service';

import { EmailValidator } from '../shared/validators/email-validator';

@NgModule({
    exports: [
        CommonModule,
        EmailValidator
    ],
    imports: [
        CommonModule
    ],
    declarations: [
        EmailValidator
    ],
    providers: [
        UtilService,
        HttpService
    ]
})
export class SharedModule { }

export { UtilService };
