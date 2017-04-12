/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import io from 'socket.io-client';
import colors from 'colour';
import { createAction } from 'redux-actions';

export default class Client {
  constructor({ endpoint, store, logger }) {
    this._store = store;
    this._logger = logger;
    dump("Client constructed, connecting!\n");
    this._logger.log(colors.green('Client constructed, connecting'));
    this.connect(endpoint);
  }

  connect(endpoint) {
    this._connected = new Promise(async (resolve) => {
      dump("Awaiting endpoint: " + endpoint + "\n");
      endpoint.then((val) => {
        dump("Endpoint gotten: " + val + "\n");
      });
      const ep = await endpoint;
      dump("Endpoint received: " + ep + "\n");
      console.log("Connecting to ", ep);
      const pipe = io(ep);
      pipe.on('error', () => { dump("ERROR\n"); });
      pipe.on('connect', () => { dump("connect\n");resolve(pipe) });
    });
  }

  async listen() {
    this._logger.log(colors.green('Awaiting connection from client'));
    dump("Awaiting connection from client\n");
    this._connected.then(() => {
      dump("Received connection from client (non await)\n");
    });
    const pipe = await this._connected;
    dump("Received connection from client\n");
    pipe.on('message', (msg) => {
      dump("Received message: " + msg + "\n");
      const { type, payload } = JSON.parse(msg);
      this._logger.log(colors.green('⇠'), colors.cyan(msg));
      this._store.dispatch(createAction(type, () => payload, () => this)());
    });
  }

  async send(msg) {
    const str = JSON.stringify(msg);
    dump("Sending from client" + str + "\n");
    const pipe = await this._connected;
    dump("Sent from client" + str + "\n");
    pipe.emit('message', str);
    this._logger.log(colors.green('⇢'), colors.blue(str));
  }
}
