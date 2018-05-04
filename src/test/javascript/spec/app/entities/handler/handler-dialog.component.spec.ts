/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { EquoidTestModule } from '../../../test.module';
import { HandlerDialogComponent } from '../../../../../../main/webapp/app/entities/handler/handler-dialog.component';
import { HandlerService } from '../../../../../../main/webapp/app/entities/handler/handler.service';
import { Handler } from '../../../../../../main/webapp/app/entities/handler/handler.model';

describe('Component Tests', () => {

    describe('Handler Management Dialog Component', () => {
        let comp: HandlerDialogComponent;
        let fixture: ComponentFixture<HandlerDialogComponent>;
        let service: HandlerService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EquoidTestModule],
                declarations: [HandlerDialogComponent],
                providers: [
                    HandlerService
                ]
            })
            .overrideTemplate(HandlerDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HandlerDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HandlerService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Handler(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.handler = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'handlerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Handler();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.handler = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'handlerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
