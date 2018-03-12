/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { EquoidTestModule } from '../../../test.module';
import { ItemDetailComponent } from '../../../../../../main/webapp/app/entities/item/item-detail.component';
import { ItemService } from '../../../../../../main/webapp/app/entities/item/item.service';
import { Item } from '../../../../../../main/webapp/app/entities/item/item.model';

describe('Component Tests', () => {

    describe('Item Management Detail Component', () => {
        let comp: ItemDetailComponent;
        let fixture: ComponentFixture<ItemDetailComponent>;
        let service: ItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EquoidTestModule],
                declarations: [ItemDetailComponent],
                providers: [
                    ItemService
                ]
            })
            .overrideTemplate(ItemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ItemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Item(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.item).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
