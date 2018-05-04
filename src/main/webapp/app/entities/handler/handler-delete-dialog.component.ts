import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Handler } from './handler.model';
import { HandlerPopupService } from './handler-popup.service';
import { HandlerService } from './handler.service';

@Component({
    selector: 'equoid-handler-delete-dialog',
    templateUrl: './handler-delete-dialog.component.html'
})
export class HandlerDeleteDialogComponent {

    handler: Handler;

    constructor(
        private handlerService: HandlerService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.handlerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'handlerListModification',
                content: 'Deleted an handler'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'equoid-handler-delete-popup',
    template: ''
})
export class HandlerDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private handlerPopupService: HandlerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.handlerPopupService
                .open(HandlerDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
