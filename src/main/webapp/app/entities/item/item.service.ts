import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Item } from './item.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ItemService {

    private resourceUrl =  SERVER_API_URL + 'api/items';

    constructor(private http: Http) { }

    create(item: Item): Observable<Item> {
        const copy = this.convert(item);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(item: Item): Observable<Item> {
        const copy = this.convert(item);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Item> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Item.
     */
    private convertItemFromServer(json: any): Item {
        const entity: Item = Object.assign(new Item(), json);
        return entity;
    }

    /**
     * Convert a Item to a JSON which can be sent to the server.
     */
    private convert(item: Item): Item {
        const copy: Item = Object.assign({}, item);
        return copy;
    }
}
