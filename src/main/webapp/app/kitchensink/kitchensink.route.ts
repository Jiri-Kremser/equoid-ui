import { Route } from '@angular/router';

import { KitchensinkComponent } from './';

export const HOME_ROUTE: Route = {
    path: 'components',
    component: KitchensinkComponent,
    data: {
        authorities: [],
        pageTitle: 'Welcome, Java Bla!!'
    }
};
