import { Route } from '@angular/router';

import { KitchensinkComponent } from './';

export const HOME_ROUTE: Route = {
    path: 'foo',
    component: KitchensinkComponent,
    data: {
        authorities: [],
        pageTitle: 'Welcome, Java Bla!!'
    }
};
