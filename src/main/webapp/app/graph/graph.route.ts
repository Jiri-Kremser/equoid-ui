import { Route } from '@angular/router';

import { GraphComponent } from './';

export const GRAPH_ROUTE: Route = {
    path: 'graph',
    component: GraphComponent,
    data: {
        authorities: [],
        pageTitle: 'Equoid - graph'
    }
};
