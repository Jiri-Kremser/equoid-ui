import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquoidSharedModule } from '../shared';
import { GRAPH_ROUTE, GraphComponent } from './';
import { EquoidTopkModule } from '../topk/topk.module';
import { ChartModule } from 'patternfly-ng';
import { PiechartComponent } from '../piechart/piechart.component';
import { BarchartComponent } from '../barchart/barchart.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        EquoidSharedModule,
        EquoidTopkModule,
        ChartModule,
        FlexLayoutModule,
        RouterModule.forChild([ GRAPH_ROUTE ])
    ],
    declarations: [
        GraphComponent,
        PiechartComponent,
        BarchartComponent
    ],
    entryComponents: [
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidGraphModule {}
