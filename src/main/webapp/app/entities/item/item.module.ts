import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EquoidSharedModule } from '../../shared';
import {
    ItemService,
    ItemPopupService,
    ItemComponent,
    ItemDetailComponent,
    ItemDialogComponent,
    ItemPopupComponent,
    ItemDeletePopupComponent,
    ItemDeleteDialogComponent,
    itemRoute,
    itemPopupRoute,
} from './';

const ENTITY_STATES = [
    ...itemRoute,
    ...itemPopupRoute,
];

@NgModule({
    imports: [
        EquoidSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ItemComponent,
        ItemDetailComponent,
        ItemDialogComponent,
        ItemDeleteDialogComponent,
        ItemPopupComponent,
        ItemDeletePopupComponent,
    ],
    entryComponents: [
        ItemComponent,
        ItemDialogComponent,
        ItemPopupComponent,
        ItemDeleteDialogComponent,
        ItemDeletePopupComponent,
    ],
    providers: [
        ItemService,
        ItemPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidItemModule {}
