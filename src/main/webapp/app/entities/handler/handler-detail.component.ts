import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Handler } from './handler.model';
import { HandlerService } from './handler.service';

@Component({
    selector: 'equoid-handler-detail',
    templateUrl: './handler-detail.component.html'
})
export class HandlerDetailComponent implements OnInit, OnDestroy {

    handler: Handler;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private handlerService: HandlerService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInHandlers();
    }

    load(id) {
        this.handlerService.find(id).subscribe((handler) => {
            this.handler = handler;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInHandlers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'handlerListModification',
            (response) => this.load(this.handler.id)
        );
    }
}
