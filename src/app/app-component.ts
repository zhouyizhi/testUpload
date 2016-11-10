import { Component } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app',
    template: require('./app.html'),
    styleUrls: [
        './app.scss'
    ],
    providers: [
        Title
    ]
})
export class AppComponent {
    constructor(public router: Router, public titleService: Title) {
    }

    setTitle() {
        this.titleService.setTitle('Angular2');
    }

    ngOnInit() {
        this.setTitle();
        this.redirectToLogin();
    }

    redirectToLogin() {
        this.router.navigate(['/login']);
    }
}
