import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-session.service';
// import { JhiTrackerService } from '../tracker/tracker.service';

@Injectable()
export class LoginService {

    constructor(
        private principal: Principal,
        // private trackerService: JhiTrackerService,
        private authServerProvider: AuthServerProvider
    ) {}

    login() {
        console.log(location.href);
        let port = (location.port ? ':' + location.port : '');
        if (port === ':9000') { // dev mode
            port = ':8080';
        } else {
            console.log('Port = 80');
            const target = location.href.replace(/^(.*)equoid-equoid([^\/]*).*/, '$1keycloak-equoid$2/login');
            console.log('Login redirect to ' + target);
            location.href = target;
        }
        location.href = '//' + location.hostname + port + '/login';
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
