import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class PieDataService {
  addData = (num: number, data: Array<any>) => {
    const newData: Array<any> = data.slice(0)
    const items = ['Black Velvet', 'Jim Beam', 'Jagermeister', 'Tullamore Dew', 'Pearl Gin', 'Arrow Gin', 'Wolfschmidt', 'Captain Morgan', 'Becherovka', 'Slivovitz'];
    for (let i = 0; i < num; i++) {
      const index = Math.floor(Math.random() * items.length);
      const existing = _.findWhere(newData, {id: index});
      if (existing) {
        existing.count++;
      } else {
        newData.push({
          id: index,
          name: items[index],
          count: 1
        });
      }
    }

    return newData;
  }
}
