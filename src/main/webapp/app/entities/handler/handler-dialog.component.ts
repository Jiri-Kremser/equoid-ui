import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Handler } from './handler.model';
import { HandlerPopupService } from './handler-popup.service';
import { HandlerService } from './handler.service';

@Component({
    selector: 'equoid-handler-dialog',
    templateUrl: './handler-dialog.component.html'
})
export class HandlerDialogComponent implements OnInit {

    handler: Handler;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private handlerService: HandlerService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.handler.id !== undefined) {
            this.subscribeToSaveResponse(
                this.handlerService.update(this.handler));
        } else {
            this.subscribeToSaveResponse(
                this.handlerService.create(this.handler));
        }
    }

    private subscribeToSaveResponse(result: Observable<Handler>) {
        result.subscribe((res: Handler) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Handler) {
        this.eventManager.broadcast({ name: 'handlerListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'equoid-handler-popup',
    template: ''
})
export class HandlerPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private handlerPopupService: HandlerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.handlerPopupService
                    .open(HandlerDialogComponent as Component, params['id']);
            } else {
                this.handlerPopupService
                    .open(HandlerDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
