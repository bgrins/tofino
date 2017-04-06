/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;
const { console } = Cu.import('resource://gre/modules/Console.jsm', {});
const { Runtime } = Cu.import('resource://qbrt/modules/Runtime.jsm', {});
const { Services } = Cu.import('resource://gre/modules/Services.jsm', {});

// const WINDOW_URL = 'chrome://app/content/index.html';
const WINDOW_URL = 'http://localhost:9000/v1/chrome?runnerConnId=%2Fv1%2Frunner%23AQW6SjiNrTXnQMUqAAAA&winId=d6022933-863d-4829-9a32-0de67d6b09dd&os=darwin&platform=dummy';

const WINDOW_FEATURES = [
  'chrome',
  'dialog=no',
  'all',
  'width=640',
  'height=480',
].join(',');

// On startup, activate ourselves, since starting up from Node doesn't do this.
// TODO: do this by default for all apps started via Node.
if (Services.appinfo.OS === 'Darwin') {
  Cc['@mozilla.org/widget/macdocksupport;1'].getService(Ci.nsIMacDockSupport).activateApplication(true);
}

console.log('Hello, Worlder!');

const window = Services.ww.openWindow(null, WINDOW_URL, '_blank', WINDOW_FEATURES, null);
Runtime.openDevTools(window);
