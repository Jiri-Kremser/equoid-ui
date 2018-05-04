/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { EquoidTestModule } from '../../../test.module';
import { HandlerDetailComponent } from '../../../../../../main/webapp/app/entities/handler/handler-detail.component';
import { HandlerService } from '../../../../../../main/webapp/app/entities/handler/handler.service';
import { Handler } from '../../../../../../main/webapp/app/entities/handler/handler.model';

describe('Component Tests', () => {

    describe('Handler Management Detail Component', () => {
        let comp: HandlerDetailComponent;
        let fixture: ComponentFixture<HandlerDetailComponent>;
        let service: HandlerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EquoidTestModule],
                declarations: [HandlerDetailComponent],
                providers: [
                    HandlerService
                ]
            })
            .overrideTemplate(HandlerDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HandlerDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HandlerService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Handler(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.handler).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
