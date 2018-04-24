import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import * as _ from 'underscore';
import { Account, LoginService, Principal } from '../shared';
// Services
import { PieDataService } from '../piechart/piechart.service';
import { JdgFakeDataService } from './jdg-fake-data.service';
import { ItemRestDataService } from './item-rest-data.service';
import { NotificationService } from 'patternfly-ng/notification/notification-service/notification.service';

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
    isDummyData = false;
    account: Account;
    data: T.DataPoint[] = [];
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
    getStackedDataPrototype(): T.StackedChartData {
        return {
            historyLength: 50,
            ticks: ['x'],
            colors: _.clone(this.colors),
            data: []
        };
    }
    stackedData: T.StackedChartData = this.getStackedDataPrototype();
    allDataBySec = {};
    allData = [];
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

    notifications = [];

    constructor(
        private principal: Principal,
        private loginService: LoginService,
        private eventManager: JhiEventManager,
        private pieDataService: PieDataService,
        private jdgFakeDataService: JdgFakeDataService,
        private itemRestDataService: ItemRestDataService,
        private notificationService: NotificationService
    ) {
    }

    handleClose($event): void {
        const index = this.notifications.indexOf($event.notification);
        if (index !== -1) {
          this.notifications.splice(index, 1);
        }
    }

    handleViewingChange($event): void {
        this.notificationService.setViewing($event.notification, $event.isViewing);
    }

    addItem(item: string) {
        if (!item || item.length < 2) {
            this.notifications.push({
                header: 'Validation failed',
                isPersistent: false,
                isViewing: false,
                message: 'Enter some sensible data.',
                showClose: true,
                type: 'warning',
                visible: true
            });
            return;
        }
        this.itemRestDataService.newItem(item).subscribe(
            (data) => {
                this.data = data.json;
                this.notifications.push({
                    header: 'REST call performed',
                    isPersistent: false,
                    isViewing: false,
                    message: 'New frequent item has been added to publisher.',
                    showClose: true,
                    type: 'success',
                    visible: true
                });
            },
            (err) => {
                console.error(err);
                const body = JSON.parse(err._body);
                const details = `${body.title} with status code: ${body.status} and detail message ${body.detail}`;
                this.notifications.push({
                    header: 'REST call failed',
                    isPersistent: false,
                    isViewing: false,
                    message: err.statusText + ' when calling POST on ' + err.url + '   Details: ' + details,
                    showClose: true,
                    type: 'danger',
                    visible: true
                });
            }
        );
    }

    updateStackedData(oldStackedData: T.StackedChartData, newData: T.DataPoint[]) {
        if (newData === undefined || newData === null || newData.length === 0) {
            return null;
        }

        if (oldStackedData === undefined)

        // console.log('new data = ' + JSON.stringify(newData));
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

        // align the array lengths
        const toAlign = _.filter(oldStackedData.data, (a) => a.length < oldStackedData.ticks.length);
        // _.each(toAlign, (a) => a.push(a[a.length - 1]));
        _.each(toAlign, (a) => a.push(0));

        if (oldStackedData.ticks.length > oldStackedData.historyLength + 1) {
            // forget the oldest data point
            _.each(oldStackedData.data, (a) => a.splice(1, 1));
            oldStackedData.ticks.splice(1, 1);
        }

        return oldStackedData;
    }

    toggleDummy() {
        this.isDummyData = !this.isDummyData;
    }

    refresh() {
        if (this.isDummyData) { // dummy data for testing (showing 2 graphs)
            this.data = this.jdgFakeDataService.getData(15);
            if (this.allData.length !== 2) {
                this.allData = [[this.data, this.stackedData, 30], [this.data, this.stackedData, 60]];
            }
            this.allData[0][0] = this.data;
            this.allData[1][0] = this.data;
            this.updateStackedData(this.stackedData, this.data);
        } else {
            this.itemRestDataService.getData(0).subscribe(
                (data) => {
                    const res = _.map(data.json, (dataPoint: T.DataPoint[], key) => {
                        const chunks = key.split(' ')[0];
                        const seconds = (chunks.length > 1) ? chunks[0] : key;
                        const stackedBySeconds = this.allDataBySec[''+seconds];
                        const stacked = this.updateStackedData(stackedBySeconds || this.getStackedDataPrototype(), dataPoint);
                        this.allDataBySec[''+seconds] = stacked;
                        return [dataPoint, stacked, seconds];
                    });
                    this.allData = res;
                    // this.data = data.json[Object.keys(data.json)[0]];
                    // this.updateStackedData(this.stackedData, this.data);
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
