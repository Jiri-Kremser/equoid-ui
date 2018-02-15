import { Route } from '@angular/router';

import { JhiMainComponent } from './layouts';

export const navbarRoute: Route = {
    path: '',
    component: JhiMainComponent,
    outlet: 'navbar'
};
