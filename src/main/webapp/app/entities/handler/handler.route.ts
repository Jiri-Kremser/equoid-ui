import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { HandlerComponent } from './handler.component';
import { HandlerDetailComponent } from './handler-detail.component';
import { HandlerPopupComponent } from './handler-dialog.component';
import { HandlerDeletePopupComponent } from './handler-delete-dialog.component';

export const handlerRoute: Routes = [
    {
        path: 'handler',
        component: HandlerComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Handlers'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'handler/:id',
        component: HandlerDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Handlers'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const handlerPopupRoute: Routes = [
    {
        path: 'handler-new',
        component: HandlerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Handlers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'handler/:id/edit',
        component: HandlerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Handlers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'handler/:id/delete',
        component: HandlerDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Handlers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
