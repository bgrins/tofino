// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';

import yargs from 'yargs';
import { IS_LOCAL_BUILD, IS_PACKAGED_BUILD, NOT_RUNNING_IN_BUILD } from './build-info';

export const ROOT_DIR = path.resolve((() => {
  if (IS_LOCAL_BUILD) {
    return path.join(__dirname, '..', '..', '..');
  }
  if (IS_PACKAGED_BUILD) {
    return path.join(__dirname, '..');
  }
  if (NOT_RUNNING_IN_BUILD) {
    return path.join(__dirname, '..', '..');
  }
  throw new Error('Unknown runtime.');
})());

export const OBJ_DIR_NAME = (() => {
  if (IS_LOCAL_BUILD) {
    return path.basename(path.join(__dirname, '..'));
  }
  if (IS_PACKAGED_BUILD) {
    return '.';
  }
  if (NOT_RUNNING_IN_BUILD) {
    return yargs.argv.objDirName || 'obj';
  }
  throw new Error('Unknown runtime.');
})();

export const SRC_DIR = IS_PACKAGED_BUILD ? undefined : path.join(ROOT_DIR, 'src');
export const LIB_DIR = IS_PACKAGED_BUILD ? undefined : path.join(ROOT_DIR, 'lib');
export const DIST_DIR = IS_PACKAGED_BUILD ? undefined : path.join(ROOT_DIR, 'dist');
export const BUILD_SCRIPTS_DIR = IS_PACKAGED_BUILD ? undefined : path.join(ROOT_DIR, 'build');

export const BUILD_TARGET_DIR = path.join(IS_PACKAGED_BUILD ? ROOT_DIR : LIB_DIR, OBJ_DIR_NAME);

export const BROWSER_SHARED_DIRNAME = 'shared';
export const BROWSER_SHARED_SRC = IS_PACKAGED_BUILD ? undefined : path.join(SRC_DIR, BROWSER_SHARED_DIRNAME);
export const BROWSER_SHARED_DST = path.join(BUILD_TARGET_DIR, BROWSER_SHARED_DIRNAME);

export const BROWSER_FRONTEND_DIRNAME = 'browser-frontend';
export const BROWSER_FRONTEND_SRC = IS_PACKAGED_BUILD ? undefined : path.join(SRC_DIR, BROWSER_FRONTEND_DIRNAME);
export const BROWSER_FRONTEND_DST = path.join(BUILD_TARGET_DIR, BROWSER_FRONTEND_DIRNAME);
export const BROWSER_FRONTEND_ENTRY_FILENAME = 'index.jsx';
export const BROWSER_FRONTEND_BUNDLED_FILENAME = 'index.js';
export const BROWSER_FRONTEND_DST_MAIN = path.join(BROWSER_FRONTEND_DST, BROWSER_FRONTEND_BUNDLED_FILENAME);

export const BROWSER_RUNNER_DIRNAME = 'browser-runner';
export const BROWSER_RUNNER_SRC = IS_PACKAGED_BUILD ? undefined : path.join(SRC_DIR, BROWSER_RUNNER_DIRNAME);
export const BROWSER_RUNNER_DST = path.join(BUILD_TARGET_DIR, BROWSER_RUNNER_DIRNAME);

export const ELECTRON_RUNNER_ENTRY_FILENAME = 'platform-electron/index.js';
export const ELECTRON_RUNNER_POLYFILL_FILENAME = 'browser-runner-electron-polyfill.js';
export const ELECTRON_RUNNER_DST_MAIN = path.join(BROWSER_RUNNER_DST, ELECTRON_RUNNER_POLYFILL_FILENAME);

export const DUMMY_RUNNER_DST = path.join(BROWSER_RUNNER_DST, 'platform-qbrt');
export const DUMMY_RUNNER_ENTRY_FILENAME = 'platform-qbrt/index.js';
export const DUMMY_RUNNER_POLYFILL_FILENAME = 'browser-runner-dummy-polyfill.js';
export const DUMMY_RUNNER_DST_MAIN = path.join(BROWSER_RUNNER_DST, DUMMY_RUNNER_POLYFILL_FILENAME);

export const BROWSER_SERVER_DIRNAME = 'browser-server';
export const BROWSER_SERVER_SRC = IS_PACKAGED_BUILD ? undefined : path.join(SRC_DIR, BROWSER_SERVER_DIRNAME);
export const BROWSER_SERVER_DST = path.join(BUILD_TARGET_DIR, BROWSER_SERVER_DIRNAME);
export const BROWSER_SERVER_ENTRY_FILENAME = 'index.js';
export const BROWSER_SERVER_POLYFILL_FILENAME = 'browser-server-polyfill.js';
export const BROWSER_SERVER_DST_MAIN = path.join(BROWSER_SERVER_DST, BROWSER_SERVER_POLYFILL_FILENAME);
