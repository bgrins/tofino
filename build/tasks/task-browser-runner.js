// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import gulp from 'gulp';
import debug from 'gulp-debug';
import changed from 'gulp-changed';
import babel from 'gulp-babel';
import webpack from 'webpack';
import sourcemaps from 'gulp-sourcemaps';
import fs from 'fs-promise';
import colors from 'colour';

import logger from '../logger';
import * as Paths from '../../src/shared/paths';
import prodConfig from '../webpack/config.qbrt.prod';

const WEBPACK_STATS_OPTIONS = {
  colors: true,
  warnings: false,
};

gulp.task('browser-runner:babel', () =>
  gulp.src(`${Paths.BROWSER_RUNNER_SRC}/**/*.@(js|jsx)`)
    .pipe(changed(Paths.BROWSER_RUNNER_DST, { extension: '.js' }))
    .pipe(debug({ title: `Running ${colors.cyan('babel')}` }))
    .pipe(sourcemaps.init())
    .pipe(babel(fs.readJsonSync('.babelrc')))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Paths.BROWSER_RUNNER_DST)));

gulp.task('qbrt-runner:webpack', () => new Promise((resolve, reject) => {
  webpack(prodConfig, (err, stats) => {
    if (err) { reject(err); return; }
    if (stats) { logger.log(stats.toString(WEBPACK_STATS_OPTIONS)); }
    resolve();
  });
}));

gulp.task('qbrt-runner:copy-shell', () =>
  gulp.src(`${Paths.QBRT_RUNNER_SHELL_SRC}/**/*`)
    .pipe(changed(Paths.QBRT_RUNNER_SHELL_DST))
    .pipe(debug({ title: `Running ${colors.cyan('cp')}` }))
    .pipe(gulp.dest(Paths.QBRT_RUNNER_SHELL_DST)));

gulp.task('browser-runner:build', gulp.series(
  'browser-runner:babel',
  'qbrt-runner:webpack',
  'qbrt-runner:copy-shell',
));
