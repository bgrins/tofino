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

import isBrowser from 'is-browser';
import colors from 'colour';
import ansi from 'ansi-webkit';
import df from 'dateformat';
import unzip from 'lodash/unzip';
import compact from 'lodash/compact';

colors.mode = 'console';

export default class Logger {
  constructor(name, writer, options = {}) {
    this._name = name;
    this._writer = writer;
    this._options = options;
  }

  log(...args) {
    // if (!this._options.always && process.env.LOGGING !== 'on') {
    //   return;
    // }
    this._write('log', df(Date.now(), '[HH:MM:ss:l]'), colors.bold(this._name), ...args);
  }

  _write(level, ...args) {
    if (isBrowser) {
      const [str, styles] = unzip(args.map((arg) => {
        const [data, style] = ansi.parse(arg);
        return [data || arg, style];
      }));
      this._writer[level](str.join(' '), ...compact(styles));
    } else {
      this._writer[level](...args);
    }
  }
}
