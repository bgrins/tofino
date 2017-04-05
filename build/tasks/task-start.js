// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import gulp from 'gulp';
import portastic from 'portastic';

import logger from '../logger';

import { spawn } from '../../src/shared/util/spawn';
import * as Paths from '../../src/shared/paths';

const PORT_RANGE = {
  min: 9000,
  max: 9999,
};

gulp.task('start', async () => {
  const ports = await portastic.find(PORT_RANGE);
  if (ports.length === 0) {
    throw new Error('Couldn\'t find any open ports.');
  }

  const args = [
    '--use-external-server',
    '--version', 'v1',
    '--hostname', 'localhost',
    '--port', ports[0],
  ];

  return Promise.all([
    spawn('node', Paths.BROWSER_RUNNER_DST_MAIN, args, { logger }),
    spawn('node', Paths.BROWSER_SERVER_DST_MAIN, args, { logger }),
  ]);
});
