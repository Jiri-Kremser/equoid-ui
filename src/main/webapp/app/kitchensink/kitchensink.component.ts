import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginService, Principal } from '../shared';

@Component({
    selector: 'jhi-kitchensink',
    templateUrl: './kitchensink.component.html',
    styleUrls: [
        'kitchensink.scss'
    ]

})
export class KitchensinkComponent implements OnInit {
    account: Account;

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.loginService.login();
    }
}
