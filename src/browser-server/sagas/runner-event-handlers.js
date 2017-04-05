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

import querystring from 'querystring';

import { takeEvery, call, put, select } from 'redux-saga/effects';
import uuid from 'uuid/v4';

import { CHROME_URL } from '../constants/endpoints';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../constants/browser-window-defaults';
import SharedActions from '../../shared/actions/shared-actions';
import RunnerConnectionsModelActions from '../actions/runner-connections-model-actions';
import WindowsModelActions from '../actions/windows-model-actions';
import * as RunnerConnectionsSelectors from '../selectors/runner-connections-selectors';
import * as WindowsSelectors from '../selectors/windows-selectors';

function* createWindow({ meta: runnerConn }) {
  const runnerConnId = runnerConn.id;
  const { os, platform } = yield select(RunnerConnectionsSelectors.getRunnerClientMetaData, runnerConnId);

  const winId = uuid();
  const frontendParams = querystring.stringify({ runnerConnId, winId, os, platform });

  console.trace();
  yield call([runnerConn, runnerConn.send], SharedActions.commands.fromServer.toRunner.app.window.create({
    winId,
    url: `${CHROME_URL}?${frontendParams}`,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    style: os === 'darwin' ? 'onlyTitleBarHiddenAndWindowControlsInset' : 'chromeless',
  }));
}

function* onClientHello({ meta: runnerConn, payload: { clientMetaData } }) {
  const runnerConnId = runnerConn.id;
  yield put(RunnerConnectionsModelActions.addRunnerConnection({ runnerConnId, clientMetaData }));

  yield* createWindow({ meta: runnerConn });
}

function* onAppActivated({ meta: runnerConn }) {
  const runnerConnId = runnerConn.id;
  const count = (yield select(WindowsSelectors.getAllWindows, runnerConnId)).count();

  if (count === 0) {
    yield* createWindow({ meta: runnerConn });
  }
}

function* onWindowCreated({ meta: runnerConn, payload: { winId } }) {
  const runnerConnId = runnerConn.id;
  yield put(WindowsModelActions.addWindow({ runnerConnId, winId }));

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  yield call([runnerConn, runnerConn.send], SharedActions.commands.fromServer.toRunner.app.window.devtools.open({
    winId,
    detach: true,
  }));
}

function* onWindowClosed({ meta: runnerConn, payload: { winId } }) {
  const runnerConnId = runnerConn.id;
  yield put(WindowsModelActions.removeWindow({ runnerConnId, winId }));

  const count = (yield select(WindowsSelectors.getAllWindows, runnerConnId)).count();
  const { os } = yield select(RunnerConnectionsSelectors.getRunnerClientMetaData, runnerConnId);

  if (count === 0 && os !== 'darwin') {
    yield call([runnerConn, runnerConn.send], SharedActions.commands.fromServer.toRunner.platform.quit());
  }
}

function* onDevToolsOpened({ meta: runnerConn, payload: { winId } }) {
  const runnerConnId = runnerConn.id;
  yield put(WindowsModelActions.window.setDevToolsOpen({ runnerConnId, winId }));
}

function* onDevToolsClosed({ meta: runnerConn, payload: { winId } }) {
  const runnerConnId = runnerConn.id;
  yield put(WindowsModelActions.window.setDevToolsClosed({ runnerConnId, winId }));
}

export default function* () {
  yield [
    takeEvery(SharedActions.events.fromRunner.toServer.client.hello, onClientHello),
    takeEvery(SharedActions.events.fromRunner.toServer.app.activated, onAppActivated),
    takeEvery(SharedActions.events.fromRunner.toServer.app.window.created, onWindowCreated),
    takeEvery(SharedActions.events.fromRunner.toServer.app.window.closed, onWindowClosed),
    takeEvery(SharedActions.events.fromRunner.toServer.app.window.devtools.opened, onDevToolsOpened),
    takeEvery(SharedActions.events.fromRunner.toServer.app.window.devtools.closed, onDevToolsClosed),
  ];
}
