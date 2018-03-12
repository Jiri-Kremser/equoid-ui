/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EquoidTestModule } from '../../../test.module';
import { ItemDialogComponent } from '../../../../../../main/webapp/app/entities/item/item-dialog.component';
import { ItemService } from '../../../../../../main/webapp/app/entities/item/item.service';
import { Item } from '../../../../../../main/webapp/app/entities/item/item.model';

describe('Component Tests', () => {

    describe('Item Management Dialog Component', () => {
        let comp: ItemDialogComponent;
        let fixture: ComponentFixture<ItemDialogComponent>;
        let service: ItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EquoidTestModule],
                declarations: [ItemDialogComponent],
                providers: [
                    ItemService
                ]
            })
            .overrideTemplate(ItemDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ItemDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ItemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Item(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.item = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'itemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Item();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.item = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'itemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
