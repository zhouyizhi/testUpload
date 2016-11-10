import { TestBed, ComponentFixture, async, inject} from '@angular/core/testing';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {HttpService} from '../shared/services/http-service';

import { SharedModule } from '../shared/shared-module';

import { LoginComponent } from './login-component';
import { LoginService } from './login-service';

describe('LoginComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                SharedModule
            ],
            providers: [
                Http,
                LoginService
            ]
        });
    });

    it('ログオン済み', async(() => {
        TestBed.compileComponents().then(() => {
            let fixture: ComponentFixture<LoginComponent> = TestBed.createComponent(LoginComponent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let loginComponent: LoginComponent = fixture.componentInstance;
                expect(loginComponent.loggedOn()).toBe(true, 'should be true.');
            });
        });
    }));
    it('ログインサービスが呼び出された', async(() => {
        TestBed.compileComponents().then(() => {
            let fixture: ComponentFixture<LoginComponent> = TestBed.createComponent(LoginComponent);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let loginComponent: LoginComponent = fixture.componentInstance;
                spyOn(loginComponent.loginService, 'login').and.callThrough();
                loginComponent.model.email = 'test';
                loginComponent.model.password = 'test123';
                loginComponent.login();
                expect(loginComponent.loginService.login).toHaveBeenCalledWith(loginComponent.model.email, loginComponent.model.password);
            });
        });
    }));
});

describe('LoginService', () => {
    let loginService: LoginService;

    beforeEach(inject([Http, HttpService], (http: Http, httpService: HttpService) => {
        loginService = new LoginService(http, httpService);
    }));

    it('ログイン失敗', async(() => {
        expect(loginService.login('test@test.com', 'test')).toBeTruthy();
    }));

    it('ログイン失敗', async(() => {
        expect(loginService.login('abc@test.com', '123')).toBeFalsy();
    }));
});
