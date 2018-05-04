import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Handler } from './handler.model';
import { HandlerService } from './handler.service';
import { Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'equoid-handler',
    templateUrl: './handler.component.html'
})
export class HandlerComponent implements OnInit, OnDestroy {
handlers: Handler[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private handlerService: HandlerService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.handlerService.query().subscribe(
            (res: ResponseWrapper) => {
                this.handlers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInHandlers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Handler) {
        return item.id;
    }
    registerChangeInHandlers() {
        this.eventSubscriber = this.eventManager.subscribe('handlerListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
