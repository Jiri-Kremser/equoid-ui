import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { ISPN } from 'infinispan';

@Injectable()
export class JdgDataService {
  getData = (num: number) => {
    // todo: ip visible from browser
    const connected = ISPN.client({ port: 11222, host: '172.17.0.4' });
    connected.then((client) => {
      console.log("Connected");

      const putGetPromise = client.stats().then((value) => {
        console.log('stats = ' + JSON.stringify(value));
      });
      putGetPromise.finally(() => {
        client.disconnect().then(function () { console.log("Disconnected") });
      });
    });

    return null;
  }
}
