import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../app.constants';
import { ResponseWrapper } from '../shared/model/response-wrapper.model';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';

// Types
import * as T from '../shared/types/common-types'

@Injectable()
export class JdgFakeDataService {
  lastCallTime = 0
  cachedData: T.DataPoint[] = []

  getData = (interval: number): T.DataPoint[] => {
    const now = +new Date();
    if (this.lastCallTime === 0 || now - this.lastCallTime > (interval * 1000)) {
      // console.log('now=' + now);
      // console.log('this.lastCallTime=' + this.lastCallTime);
      this.lastCallTime = now;
      const items = ['Black Velvet', 'Jim Beam', 'Jagermeister', 'Tullamore Dew', 'Pearl Gin', 'Arrow Gin', 'Wolfschmidt', 'Captain Morgan', 'Becherovka', 'Slivovitz'];
      // pick random 3
      const selected = _.sample(items, 3)
      this.cachedData = _.map(selected, (e) => {
        return {
          id: 0,
          name: e,
          count: Math.floor(Math.random() * 4) + 1
        };
      })
    }
    return this.cachedData;
  }
}
