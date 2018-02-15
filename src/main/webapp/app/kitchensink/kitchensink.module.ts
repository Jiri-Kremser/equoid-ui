import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EquoidSharedModule } from '../shared';

import { HOME_ROUTE, KitchensinkComponent } from './';

@NgModule({
    imports: [
        EquoidSharedModule,
        RouterModule.forChild([ HOME_ROUTE ])
    ],
    declarations: [
        KitchensinkComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidKitchensinkModule {}
