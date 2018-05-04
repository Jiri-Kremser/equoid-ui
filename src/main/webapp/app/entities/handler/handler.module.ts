import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EquoidSharedModule } from '../../shared';
import {
    HandlerService,
    HandlerPopupService,
    HandlerComponent,
    HandlerDetailComponent,
    HandlerDialogComponent,
    HandlerPopupComponent,
    HandlerDeletePopupComponent,
    HandlerDeleteDialogComponent,
    handlerRoute,
    handlerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...handlerRoute,
    ...handlerPopupRoute,
];

@NgModule({
    imports: [
        EquoidSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        HandlerComponent,
        HandlerDetailComponent,
        HandlerDialogComponent,
        HandlerDeleteDialogComponent,
        HandlerPopupComponent,
        HandlerDeletePopupComponent,
    ],
    entryComponents: [
        HandlerComponent,
        HandlerDialogComponent,
        HandlerPopupComponent,
        HandlerDeleteDialogComponent,
        HandlerDeletePopupComponent,
    ],
    providers: [
        HandlerService,
        HandlerPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidHandlerModule {}
