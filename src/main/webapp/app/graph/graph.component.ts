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
    chartData: any[] = [
        ['Cats', 2],
        ['Hamsters', 1],
        ['Fish', 3],
        ['Dogs', 2]
    ];

    largeConfig = {
        chartId: 'exampleDonut',
        colors: {
            Cats: '#0088ce',     // blue
            Hamsters: '#3f9c35', // green
            Fish: '#ec7a08',     // orange
            Dogs: '#cc0000'      // red
        },
        data: {
            onclick: (data: any, element: any) => {
                alert('You clicked on donut arc: ' + data.id);
            }
        },
        donut: {
            title: 'Animals'
        },
        legend: {
            show: true
        }
    };

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
