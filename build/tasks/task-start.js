// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import gulp from 'gulp';
import yargs from 'yargs';
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
    '--hostname', 'localhost',
    '--port', ports[0],
  ];

  if (yargs.argv.platform === 'electron') {
    const electron = process.platform === 'win32'
      ? 'electron.cmd'
      : 'electron';

    return Promise.all([
      spawn(electron, Paths.ELECTRON_RUNNER_DST_MAIN, args, { logger }),
      spawn('node', Paths.BROWSER_SERVER_DST_MAIN, args, { logger }),
    ]);
  }

  if (yargs.argv.platform === 'qbrt') {
    const qbrt = process.platform === 'win32'
      ? 'qbrt.cmd'
      : 'qbrt';

    return Promise.all([
      spawn(qbrt, 'run', [Paths.QBRT_RUNNER_SHELL_DST], { logger }),
      spawn('node', Paths.BROWSER_SERVER_DST_MAIN, args, { logger }),
    ]);
  }

  if (yargs.argv.platform === 'dummy') {
    const runnerArgs = [
      ...args,
      ...(yargs.argv.browser ? ['--browser', yargs.argv.browser] : []),
      ...(yargs.argv.mockOs ? ['--mock-os', yargs.argv.mockOs] : []),
    ];

    return Promise.all([
      spawn('node', Paths.DUMMY_RUNNER_DST_MAIN, runnerArgs, { logger }),
      spawn('node', Paths.BROWSER_SERVER_DST_MAIN, args, { logger }),
    ]);
  }

  throw new Error('Invalid browser runner platform.');
});
