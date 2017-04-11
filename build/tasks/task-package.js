// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';

import gulp from 'gulp';
import debug from 'gulp-debug';
import file from 'gulp-file';
import packager from 'electron-packager';
import yargs from 'yargs';
import fs from 'fs-promise';
import pick from 'lodash/pick';

import logger from '../logger';

import { spawn } from '../../src/shared/util/spawn';
import * as Paths from '../../src/shared/paths';
import * as BuildInfo from '../../src/shared/build-info';

gulp.task('package:write-build-type', () =>
  file(BuildInfo.BUILD_TYPE_FILENAME, '"packaged"', { src: true })
    .pipe(debug({ title: 'Creating' }))
    .pipe(gulp.dest(Paths.BUILD_TARGET_DIR)));

gulp.task('package:write-manifest', () => {
  const src = path.join(Paths.ROOT_DIR, 'package.json');
  const dst = path.join(Paths.BUILD_TARGET_DIR, 'package.json');
  const config = pick(fs.readJsonSync(src), ['name', 'version', 'dependencies']);
  config.main = path.relative(Paths.BUILD_TARGET_DIR, Paths.ELECTRON_RUNNER_DST_MAIN);
  return fs.writeJson(dst, config);
});

gulp.task('package:install-modules', () => {
  const cwd = Paths.BUILD_TARGET_DIR;
  const npm = process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm';
  return spawn(npm, 'install', ['--production'], { logger }, { cwd });
});

gulp.task('package:copy-node', () => {
  const src = process.execPath;
  const dst = path.join(Paths.BUILD_TARGET_DIR, path.basename(src));
  return fs.copy(src, dst);
});

gulp.task('package:bundle-app', (cb) => {
  if (yargs.argv.platform === 'electron') {
    packager({
      platform: yargs.argv.platform || process.platform,
      dir: Paths.BUILD_TARGET_DIR,
      out: Paths.DIST_DIR,
      overwrite: true,
    }, cb);
  }

  if (yargs.argv.platform === 'qbrt') {
    const qbrt = process.platform === 'win32'
      ? 'qbrt.cmd'
      : 'qbrt';
    console.log("Packaging qbrt", Paths.BUILD_TARGET_DIR);
    return Promise.all([
      spawn(qbrt, Paths.BUILD_TARGET_DIR, [], { logger }),
    ]);
  }
});

gulp.task('package', gulp.series(
  'build',
  'package:write-build-type',
  'package:write-manifest',
  'package:install-modules',
  'package:copy-node',
  'package:bundle-app',
));
