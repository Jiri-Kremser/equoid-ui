import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquoidSharedModule } from '../shared';
import { GRAPH_ROUTE, GraphComponent } from './';
import { TopkComponent } from '../topk/topk.component';
import { PiechartComponent } from '../piechart/piechart.component';

@NgModule({
    imports: [
        EquoidSharedModule,
        RouterModule.forChild([ GRAPH_ROUTE ])
    ],
    declarations: [
        GraphComponent,
        TopkComponent,
        PiechartComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidGraphModule {}
