// Third party library.
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login-service';

@Component({
    template: require('./login.html'),
    styleUrls: [
        './login.scss'
    ],
    providers: [
        LoginService
    ]
})
export class LoginComponent implements OnInit {

    public model: any;

    constructor(public router: Router, public loginService: LoginService) {
    }

    ngOnInit() {
        this.model = {
            email: '',
            password: ''
        };
    }

    loggedOn(): boolean {
        return true;
    }

    login(): void {
        this.loginService.login(this.model.email, this.model.password).then(data => {
            if (data.result === true) {
                this.router.navigate(['/portal']);
            }
        });
    }
}
