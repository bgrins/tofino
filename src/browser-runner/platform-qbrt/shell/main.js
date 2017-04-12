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
const { console } = Cu.import('resource://gre/modules/Console.jsm', {});
const { XPCOMUtils } = Cu.import('resource://gre/modules/XPCOMUtils.jsm', {});

// new temp1({endpoint: 'foo', store: { dispatch: () => {} }, logger: { log: () => {} }})
// console.log(window, window.location.toString());
// window.requestAnimationFrame(() => {
//     console.log("ANIM");
// });
// window.setTimeout(() => {
// dump("Timeout done!");
// }, 100);
// console.log(Services, WebSocket, window);
// window.open("https://google.com");
// this.open("https://google.com");
// XPCOMUtils.defineLazyGetter(this, "WebSocket", () => {
//   return "hi";
// });
// XPCOMUtils.defineLazyGetter(this, "WebSocket", function () {
//   return Services.appShell.hiddenDOMWindow.WebSocket;
// });
// this.Services = Services;
// this.WebSocket = Services.appShell.hiddenDOMWindow.WebSocket;
// this.Object = Services.appShell.hiddenDOMWindow.Object;
// console.log(WebSocket);
// import * as Endpoints from '../../constants/endpoints';
import Client from '../../../shared/util/client';
import logger from '../../logger';
import SharedActions from '../../../shared/actions/shared-actions';

const store = { dispatch: () => {} };
const endpoint = new Promise(resolve => {
  resolve('ws://localhost:9000/v1/runner');
});
const client = new Client({ endpoint, store, logger });

console.log(Client, client);

client.send(`{"type":"EVENTS/FROM_RUNNER/TO_SERVER/CLIENT/HELLO","payload":{"clientMetaData":{"os":"darwin","platform":"electron"}}}`);

async function start() {
  console.log("Starting listening", client)
  await client.listen();
  await client.send(SharedActions.events.fromRunner.toServer.client.hello({
    clientMetaData: {
      os: Meta.OS,
      platform: 'qbrt',
    },
  }));
  logger.log(colors.green('Browser runner (qbrt) ready.'));
}

start();


// const SERVER_WS_ROUTE_PROMISE = 'ws://localhost:9000/v1/runner';
// const ws = new WebSocket(SERVER_WS_ROUTE_PROMISE);

// console.log(JSON.stringify({foo: 'bar'}));
//
// const WebSocket = Services.appShell.hiddenDOMWindow.WebSocket;
// const SERVER_WS_ROUTE_PROMISE = 'ws://localhost:9000/v1/runner';
// const ws = new WebSocket(SERVER_WS_ROUTE_PROMISE);
//
// console.log("Created websocket");
// // Connection opened
// ws.addEventListener('open', function (event) {
//     console.log('OPEN!');
//     socket.send(`{"type":"EVENTS/FROM_RUNNER/TO_SERVER/CLIENT/HELLO","payload":{"clientMetaData":{"os":"darwin","platform":"electron"}}}`);
// });
// // Listen for messages
// ws.addEventListener('message', function (event) {
//     console.log('Message from server', event.data);
// });
//
// const client = new Client({ endpoint: Endpoints.SERVER_WS_ROUTE_PROMISE, store, logger });

// // This is taken from https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIProcess#Example
// function spawnServer() {
//   // TODO: Get rid of all hardcoded paths
//   var file = Components.classes["@mozilla.org/file/local;1"]
//                        .createInstance(Components.interfaces.nsIFile);
//   file.initWithPath("/Users/bgrinstead/Code/victor-tofino/lib/qbrt-package/node");
//   var server = "/Users/bgrinstead/Code/victor-tofino/lib/qbrt-package/browser-server/index.js";
//   var process = Components.classes["@mozilla.org/process/util;1"]
//                           .createInstance(Components.interfaces.nsIProcess);
//   process.init(file);
//
//   // TODO: Handle errors
//   var args = [server, "--hostname", "localhost", "--port", "9000"];
//   process.run(false, args, args.length);
// }

// // TODO: Only spawn server in packaged builds?
// const IS_PACKAGED_BUILD = false;
// if (IS_PACKAGED_BUILD) {
//   spawnServer();
// }
// // node lib/qbrt-package/browser-server/index.js --hostname localhost --port 9000
// // node node_modules/qbrt/bin/cli.js run src/browser-runner/platform-qbrt/shell/
//
//
//
// Slurp up command line args passed into qbrt and convert them to GET params
// for the frontend.

let width = 640;
let height = 480;
let searchParams = '';
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

// TODO: Find a way to pass the correct browser-frontend URL down to this process
const url = Runtime.commandLineArgs[0] || Runtime.packageJSON.mainURL || 'index.html';
const argument = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
argument.data = url;

// TODO: Set up 'hot reload' by using incremental builds and taking over ctrl+r

const win = Services.ww.openWindow(null, SHELL_URL, '_blank', WINDOW_FEATURES, argument);
const win2 = win.open(SHELL_URL);
Runtime.openDevTools(win);

// On startup, activate ourselves, since starting up from Node doesn't do this.
// TODO: do this by default for all apps started via Node.
if (Services.appinfo.OS === 'Darwin') {
  Cc['@mozilla.org/widget/macdocksupport;1'].getService(Ci.nsIMacDockSupport).activateApplication(true);
}
