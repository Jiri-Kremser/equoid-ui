import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import * as _ from 'underscore';
import { Account, LoginService, Principal } from '../shared';
// Services
import { PieDataService } from '../piechart/piechart.service';
import { ItemRestDataService } from '../piechart/item-rest-data.service';

// Types
import * as T from '../shared/types/common-types'

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
    data: T.DataPoint[] = [];
    chartData: Array<any> = [];
    colors = {
        'Slivovitz': '#0088ce',
        'Jim Beam': '#3f9c35',
        'Captain Morgan': '#ec7a08',
        'Becherovka': '#cc0000',
        'Jagermeister': '#57A1C6',
        'Tullamore Dew': '#4FC3F7',
        'Black Velvet': '#36D7B7',
        'Pearl Gin': '#46d736',
        'Arrow Gin': '#6957c6',
        'Wolfschmidt': '#c69857'
    }
    stackedData: T.StackedChartData = {
        historyLength: 50,
        ticks: ['x'],
        colors: this.colors,
        data: []
    };
    largeConfig = {
        chartId: 'exampleDonut',
        colors: this.colors,
        donut: {
            title: 'Items'
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

    updateStackedData(oldStackedData, newData: T.DataPoint[]) {
        console.log('new data = ' + JSON.stringify(newData));

        // add time tick
        oldStackedData.ticks.push(+new Date())

        // add new data points
        const groups = _.map(oldStackedData.data, (a) => a[0]);
        _.each(newData, (d) => {
            const i = _.indexOf(groups, d.name);
            if (i !== -1) {
                oldStackedData.data[i].push(d.count);
            } else {
                // newly seen data series
                const zeros = _.times(oldStackedData.ticks.length - 2, _.constant(0));
                oldStackedData.data.push([d.name].concat(zeros).concat([d.count]));
            }
        });

        if (oldStackedData.ticks.length > oldStackedData.historyLength + 1) {
            // forget the oldest data point
            _.each(oldStackedData.data, (a) => a.splice(1, 1));
            oldStackedData.ticks.splice(1, 1);
        }

        // todo: remove data series that is no longer frequent
        return oldStackedData;
    }

    refresh() {
        if (this.dummyData) {
            this.data = this.pieDataService.addData(1, this.data);
            this.chartData = _.map(this.data, (item) => [item.name, item.count]);
            this.updateStackedData(this.stackedData, this.data);
        } else {
            this.itemRestDataService.getData(0).subscribe(
                (data) => {
                    this.data = data.json;
                    this.chartData = _.map(this.data, (item) => [item.name, item.count]);
                    this.updateStackedData(this.stackedData, this.data);
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
