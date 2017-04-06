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

import colors from 'colors/safe';

import logger from '../logger';

import { configureStore } from '../../shared/store/configure';
import * as Endpoints from '../constants/endpoints';
import * as Meta from '../constants/meta';
import Client from '../../shared/util/client';
import RootSaga from './sagas/root-saga';
import SharedActions from '../../shared/actions/shared-actions';

const store = configureStore({ sagas: RootSaga });
const client = new Client({ endpoint: Endpoints.SERVER_WS_ROUTE_PROMISE, store, logger });

async function start() {
  await client.listen();
  await client.send(SharedActions.events.fromRunner.toServer.client.hello({
    clientMetaData: {
      os: Meta.OS,
      platform: 'dummy',
    },
  }));
  logger.log(colors.green('Browser runner (dummy) ready.'));
}

start();
