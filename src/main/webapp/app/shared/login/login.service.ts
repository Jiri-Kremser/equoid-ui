import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-session.service';
import { DEBUG_INFO_ENABLED } from '../../app.constants';
// import { JhiTrackerService } from '../tracker/tracker.service';

@Injectable()
export class LoginService {

    constructor(
        private principal: Principal,
        // private trackerService: JhiTrackerService,
        private authServerProvider: AuthServerProvider
    ) {}

    login() {
        const port = (location.port ? ':' + location.port : '');
        if (port === ':9000' || DEBUG_INFO_ENABLED === 'true') {
            location.href = '//localhost:8080/login';
        } else {
            location.href = location.origin + '/login';
        }
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
