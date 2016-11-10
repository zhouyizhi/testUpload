import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {HttpService} from '../shared/services/http-service';

@Injectable()
export class LoginService {

    constructor(private http: Http, private httpService: HttpService) { }

    login(email: string, password: string): Promise<any> {
        return this.http.get('shared/assets/mocks/login/login.json')
            .toPromise()
            .then(response => response.json())
            .catch(this.httpService.handleError);
    }
}
