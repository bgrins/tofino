/* Copyright 2017 Mozilla
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

/* global Components, dump */

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
const { Runtime } = Cu.import('resource://qbrt/modules/Runtime.jsm', {});
const { Services } = Cu.import('resource://gre/modules/Services.jsm', {});

// create an nsIFile for the executable
var file = Components.classes["@mozilla.org/file/local;1"]
                     .createInstance(Components.interfaces.nsIFile);
file.initWithPath("/Users/bgrinstead/Code/victor-tofino/lib/qbrt-package/node");

// create an nsIProcess
var process = Components.classes["@mozilla.org/process/util;1"]
                        .createInstance(Components.interfaces.nsIProcess);
process.init(file);

// Run the process.
// If first param is true, calling thread will be blocked until
// called process terminates.
// Second and third params are used to pass command-line arguments
// to the process.
var args = ["argument1", "argument2"];
process.run(false, args, args.length);



// Slurp up command line args passed into qbrt and convert them to GET params
// for the frontend.

let width = 640;
let height = 480;
let searchParams = null;
for (let i = 1; i < Runtime.commandLineArgs.length; i += 2) {
  if (Runtime.commandLineArgs[i].indexOf('-width') !== -1) {
    width = Runtime.commandLineArgs[i + 1];
  } else if (Runtime.commandLineArgs[i].indexOf('-height') !== -1) {
    height = Runtime.commandLineArgs[i + 1];
  } else if (Runtime.commandLineArgs[i].indexOf('-searchParams') !== -1) {
    searchParams = Runtime.commandLineArgs[i + 1];
  }
}

const SHELL_URL = `chrome://app/content/index.html${searchParams}`;

dump(`Loading frontend at: ${SHELL_URL}\n`);

// TODO: Handle `style` argument for window chrome
const WINDOW_FEATURES = [
  `width=${width}`,
  `height=${height}`,
  'resizable',
  'scrollbars',
].join(',');

// On startup, activate ourselves, since starting up from Node doesn't do this.
// TODO: do this by default for all apps started via Node.
if (Services.appinfo.OS === 'Darwin') {
  Cc['@mozilla.org/widget/macdocksupport;1'].getService(Ci.nsIMacDockSupport).activateApplication(true);
}

// TODO: Find a way to pass the correct browser-frontend URL down to this process
const url = Runtime.commandLineArgs[0] || Runtime.packageJSON.mainURL || 'index.html';
const argument = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
argument.data = url;

// TODO: Set up 'hot reload' by using incremental builds and taking over ctrl+r

const win = Services.ww.openWindow(null, SHELL_URL, '_blank', WINDOW_FEATURES, argument);
Runtime.openDevTools(win);
