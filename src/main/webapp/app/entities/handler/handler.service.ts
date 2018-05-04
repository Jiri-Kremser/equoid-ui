import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Handler } from './handler.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class HandlerService {

    private resourceUrl =  SERVER_API_URL + 'api/handlers';

    constructor(private http: Http) { }

    create(handler: Handler): Observable<Handler> {
        const copy = this.convert(handler);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(handler: Handler): Observable<Handler> {
        const copy = this.convert(handler);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Handler> {
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
     * Convert a returned JSON object to Handler.
     */
    private convertItemFromServer(json: any): Handler {
        const entity: Handler = Object.assign(new Handler(), json);
        return entity;
    }

    /**
     * Convert a Handler to a JSON which can be sent to the server.
     */
    private convert(handler: Handler): Handler {
        const copy: Handler = Object.assign({}, handler);
        return copy;
    }
}
