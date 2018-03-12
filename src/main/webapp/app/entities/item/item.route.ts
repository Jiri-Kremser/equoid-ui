import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ItemComponent } from './item.component';
import { ItemDetailComponent } from './item-detail.component';
import { ItemPopupComponent } from './item-dialog.component';
import { ItemDeletePopupComponent } from './item-delete-dialog.component';

export const itemRoute: Routes = [
    {
        path: 'item',
        component: ItemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Items'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'item/:id',
        component: ItemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Items'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const itemPopupRoute: Routes = [
    {
        path: 'item-new',
        component: ItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Items'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'item/:id/edit',
        component: ItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Items'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'item/:id/delete',
        component: ItemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Items'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
