import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginService, Principal } from '../shared';
// Services
import { PieDataService } from '../piechart/piechart.service';
import { ItemRestDataService } from '../piechart/item-rest-data.service';

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
        ['Slivovitz', 2],
        ['Jim Beam', 1],
        ['Captain Morgan', 3],
        ['Becherovka', 2]
    ];

    largeConfig = {
        chartId: 'exampleDonut',
        colors: {
            Slivovitz: '#0088ce',        // blue
            'Jim Beam': '#3f9c35',       // green
            'Captain Morgan': '#ec7a08', // orange
            Becherovka: '#cc0000'        // red
        },
        data: {
            onclick: (data: any, element: any) => {
                alert('You clicked on donut arc: ' + data.id);
            }
        },
        donut: {
            title: 'Liquors'
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
        private pieDataService: PieDataService,
        private itemRestDataService: ItemRestDataService
    ) {
    }

    // ngOnInit() {
    //     this.principal.identity().then((account) => {
    //         this.account = account;
    //     });
    //     this.registerAuthenticationSuccess();

    //     this.data = this.pieDataService.addData(3, []);
    //     setInterval(() => {
    //         this.data = this.pieDataService.addData(1, this.data);
    //     }, 3000);
    // }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.itemRestDataService.getData(0).subscribe(
            (data) => {
                console.log(data.json);
                this.data = data.json;
             },
            (err) => console.error(err),
            () => console.log('done loading data')
        )
        setInterval(() => {
            this.itemRestDataService.getData(0).subscribe(
                (data) => { this.data = data.json },
                (err) => console.error(err),
                () => console.log('done loading data')
            )
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
