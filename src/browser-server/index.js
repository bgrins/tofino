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

import http from 'http';

import express from 'express';
import io from 'socket.io';
import morgan from 'morgan';
import colors from 'colour';

import logger from './logger';

import { configureStore } from '../shared/store/configure';
import * as Endpoints from './constants/endpoints';
import RootReducer from './reducers/root-reducer';
import RootSaga from './sagas/root-saga';
import setupChromeRoute from './routes/chrome';
import setupBrowserRunnerWsNamespace from './ws/browser-runner';
import setupBrowserFrontendWsNamespace from './ws/browser-frontend';

const store = configureStore({ reducers: RootReducer, sagas: RootSaga });

const app = express();
const server = http.Server(app);
const wss = io(server);

app.use(morgan('dev', {
  skip: () => process.env.LOGGING !== 'on',
}));

setupChromeRoute({ pathname: Endpoints.CHROME_ROUTE, app });
setupBrowserRunnerWsNamespace({ pathname: Endpoints.ELECTRON_RUNNER_WS_ROUTE, wss, store });
setupBrowserFrontendWsNamespace({ pathname: Endpoints.BROWSER_FRONTEND_WS_ROUTE, wss, store });

server.listen(Endpoints.PORT, Endpoints.HOSTNAME, () => {
  logger.log(
    colors.green('Browser server ready'),
    colors.gray(`hosting at ${Endpoints.HOSTNAME}, listening on port ${Endpoints.PORT}.`));
});
