import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class BarDataService {
  addData = (num: number, data: Array<any>) => {
    const newData: Array<any> = data.slice(0)
    const items = ['Black Velvet', 'Jim Beam', 'Jagermeister', 'Tullamore Dew', 'Pearl Gin', 'Arrow Gin', 'Wolfschmidt', 'Captain Morgan', 'Becherovka', 'Slivovitz'];
    const probabilities = [0.4, 0.2, 0.12, 0.1, 0.08, 0.02, 0.02, 0.02, 0.02];
    for (let i = 0; i < num; i++) {
      const index = Math.floor(Math.random() * items.length);
      const existing = _.findWhere(newData, {id: index});
      if (existing) {
        existing.counter++;
      } else {
        newData.push({
          id: index,
          item: items[index],
          counter: 1
        });
      }
    }

    return newData;
  }
}
