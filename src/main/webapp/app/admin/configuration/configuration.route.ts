import { Route } from '@angular/router';

import { JhiConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
    path: 'equoid-configuration',
    component: JhiConfigurationComponent,
    data: {
        pageTitle: 'Configuration'
    }
};
