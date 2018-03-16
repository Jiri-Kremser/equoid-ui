import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import * as _ from 'underscore';
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
    dummyData = true;
    account: Account;
    data: Array<any> = [];
    chartData: Array<any> = [];

    stackedData = [['Arrow Gin', 0],
                   ['Becherovka', 0],
                   ['Black Velvet', 0],
                   ['Captain Morgan', 0],
                   ['Jagermeister', 0],
                   ['Jim Beam', 0],
                   ['Pearl Gin', 0],
                   ['Slivovitz', 0],
                   ['Tullamore Dew', 0],
                   ['Wolfschmidt', 0]
                  ];

    colours = ['#57A1C6', '#4FC3F7', '#36D7B7', '#46d736', '#6957c6', '#c69857', '#c66057', '#d73646', '#b3c657', '#f7db4f'];
    largeConfig = {
        chartId: 'exampleDonut',
        colors: {
            Slivovitz: '#0088ce',        // blue
            'Jim Beam': '#3f9c35',       // green
            'Captain Morgan': '#ec7a08', // orange
            Becherovka: '#cc0000',       // red
            Jagermeister: this.colours[0],
            'Tullamore Dew': this.colours[1],
            'Black Velvet': this.colours[2],
            'Pearl Gin': this.colours[3],
            'Arrow Gin': this.colours[4],
            'Wolfschmidt': this.colours[5]
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

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private eventManager: JhiEventManager,
        private pieDataService: PieDataService,
        private itemRestDataService: ItemRestDataService
    ) {
    }

    increment() {
        const inc = Math.floor(Math.random() * this.stackedData.length);
        for (let i = 0; i < this.stackedData.length; i += 1) {
            const last = this.stackedData[i][this.stackedData[i].length - 1];
            if (i === inc) {
                this.stackedData[i].push(+last + 1);
            } else {
                this.stackedData[i].push(+last);
            }
        }
    }

    refresh() {
        if (this.dummyData) {
            this.data = this.pieDataService.addData(1, this.data);
            this.chartData = _.map(this.data, (item) => [item.name, item.count]);
            this.increment();
        } else {
            this.itemRestDataService.getData(0).subscribe(
                (data) => {
                    this.data = data.json;
                    this.chartData = _.map(this.data, (item) => [item.name, item.count]);
                    this.increment();
                },
                (err) => console.error(err)
            );
        }
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.refresh();
        setInterval(() => {
            this.refresh();
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
