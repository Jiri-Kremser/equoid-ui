import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginService, Principal } from '../shared';
// Services
import { PieDataService } from '../piechart/piechart.service';

@Component({
    selector: 'equoid-graph',
    templateUrl: './graph.component.html',
    styleUrls: [
        'graph.scss'
    ]

})
export class GraphComponent implements OnInit {
    account: Account;
    data: Array<any>;
    colours = ['#57A1C6', '#4FC3F7', '#36D7B7', '#46d736', '#6957c6', '#c69857', '#c66057', '#d73646', '#b3c657', '#f7db4f'];

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private eventManager: JhiEventManager,
        private pieDataService: PieDataService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.data = this.pieDataService.addData(3, []);
        setInterval(() => {
          this.data = this.pieDataService.addData(1, this.data);
        }, 3000);
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
