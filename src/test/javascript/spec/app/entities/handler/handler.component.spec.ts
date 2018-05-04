/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { EquoidTestModule } from '../../../test.module';
import { HandlerComponent } from '../../../../../../main/webapp/app/entities/handler/handler.component';
import { HandlerService } from '../../../../../../main/webapp/app/entities/handler/handler.service';
import { Handler } from '../../../../../../main/webapp/app/entities/handler/handler.model';

describe('Component Tests', () => {

    describe('Handler Management Component', () => {
        let comp: HandlerComponent;
        let fixture: ComponentFixture<HandlerComponent>;
        let service: HandlerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EquoidTestModule],
                declarations: [HandlerComponent],
                providers: [
                    HandlerService
                ]
            })
            .overrideTemplate(HandlerComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HandlerComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(HandlerService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Handler(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.handlers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
