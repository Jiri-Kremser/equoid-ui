import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { SERVER_API_URL } from '../app.constants';
import { Http, Response } from '@angular/http';
import { ResponseWrapper } from '../shared/model/response-wrapper.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemRestDataService {
  private resourceUrl = SERVER_API_URL + 'api/items?cached=true';
//private resourceUrl = 'http://localhost:9000/js/json';
  constructor(private http: Http) { }

  getData = (num: number): Observable<ResponseWrapper> => {
    const result: Observable<ResponseWrapper> = this.http.get(this.resourceUrl)
      .map((res: Response) => this.convertResponse(res));

    return result;
  }

  newItem = (item: string): Observable<ResponseWrapper> => {
    const newItem = {
      name: item,
      count: 0
    };
    const result: Observable<ResponseWrapper> = this.http.post(this.resourceUrl, newItem);
    return result;
  }

  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    // console.log(res.json());
    return new ResponseWrapper(res.headers, jsonResponse, res.status);
  }
}
