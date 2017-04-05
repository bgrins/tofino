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

import { takeEvery, call, cps } from 'redux-saga/effects';
import electron from 'electron';

import SharedActions from '../../shared/actions/shared-actions';

const BROWSER_WINDOWS = new Map();

function* createWindow({ meta: client, payload: { winId, url, width, height, style } }) {

  // The runner was only used to initiate a connection and get a valid URL so that the
  // chrome frontend can be opened in a browser tab. In this case we don't need to do
  // anything except for printing out the url.
  if (!electron.BrowserWindow) {
    console.log("Serving frontend at: " + url);
    return;
  }

  const win = new electron.BrowserWindow({
    width,
    height,
    ...{
      chromeless: { frame: false },
      onlyTitleBarHidden: { titleBarStyle: 'hidden' },
      onlyTitleBarHiddenAndWindowControlsInset: { titleBarStyle: 'hidden-inset' },
    }[style],
  });

  BROWSER_WINDOWS.set(winId, win);

  yield call([win, win.loadURL], url);
  yield call([client, client.send], SharedActions.events.fromRunner.toServer.app.window.created({ winId }));

  yield cps(cb => win.once('closed', () => cb()));
  BROWSER_WINDOWS.delete(winId);

  yield call([client, client.send], SharedActions.events.fromRunner.toServer.app.window.closed({ winId }));
}

function* closeWindow({ payload: { winId } }) {
  const win = BROWSER_WINDOWS.get(winId);
  if (!win) {
    throw new Error(`Unknown browser window: ${winId}.`);
  }
  yield call([win, win.close]);
}

function* minimizeWindow({ payload: { winId } }) {
  const win = BROWSER_WINDOWS.get(winId);
  if (!win) {
    throw new Error(`Unknown browser window: ${winId}.`);
  }
  yield call([win, win.minimize]);
}

function* maximizeWindow({ payload: { winId } }) {
  const win = BROWSER_WINDOWS.get(winId);
  if (!win) {
    throw new Error(`Unknown browser window: ${winId}.`);
  }
  yield call([win, win.maximize]);
}

function* openDevTools({ meta: client, payload: { winId, detach } }) {
  const win = BROWSER_WINDOWS.get(winId);
  if (!win) {
    throw new Error(`Unknown browser window: ${winId}.`);
  }

  yield call([win.webContents, win.webContents.openDevTools], { detach });

  yield cps(cb => win.webContents.once('devtools-opened', () => cb()));
  yield call([client, client.send], SharedActions.events.fromRunner.toServer.app.window.devtools.opened({ winId }));

  yield cps(cb => win.webContents.once('devtools-closed', () => cb()));
  yield call([client, client.send], SharedActions.events.fromRunner.toServer.app.window.devtools.closed({ winId }));
}

function* quit() {
  yield call([electron.app, electron.app.quit]);
}

export default function* () {
  yield [
    takeEvery(SharedActions.commands.fromServer.toRunner.app.window.create, createWindow),
    takeEvery(SharedActions.commands.fromServer.toRunner.app.window.close, closeWindow),
    takeEvery(SharedActions.commands.fromServer.toRunner.app.window.minimize, minimizeWindow),
    takeEvery(SharedActions.commands.fromServer.toRunner.app.window.maximize, maximizeWindow),
    takeEvery(SharedActions.commands.fromServer.toRunner.app.window.devtools.open, openDevTools),
    takeEvery(SharedActions.commands.fromServer.toRunner.platform.quit, quit),
  ];
}
