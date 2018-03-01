import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EquoidSharedModule } from '../shared';

import { TopkComponent } from './';

@NgModule({
    imports: [
        EquoidSharedModule
    ],
    declarations: [
        TopkComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidTopkModule {}
