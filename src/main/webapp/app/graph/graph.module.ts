import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquoidSharedModule } from '../shared';
import { GRAPH_ROUTE, GraphComponent } from './';
import { EquoidTopkModule } from '../topk/topk.module';
import { ChartModule } from 'patternfly-ng';
import { PiechartComponent } from '../piechart/piechart.component';
import { DonutchartComponent } from '../donutchart/donutchart.component';
import { StackchartComponent } from '../stackchart/stackchart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotificationModule } from 'patternfly-ng/notification';
import { NotificationService } from 'patternfly-ng/notification/notification-service/notification.service';

@NgModule({
    imports: [
        EquoidSharedModule,
        EquoidTopkModule,
        ChartModule,
        FlexLayoutModule,
        NotificationModule,
        RouterModule.forChild([ GRAPH_ROUTE ])
    ],
    declarations: [
        GraphComponent,
        PiechartComponent,
        DonutchartComponent,
        StackchartComponent
    ],
    entryComponents: [
    ],
    providers: [NotificationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EquoidGraphModule {}
