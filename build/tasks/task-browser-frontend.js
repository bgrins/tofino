// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import gulp from 'gulp';
import debug from 'gulp-debug';
import changed from 'gulp-changed';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import colors from 'colour';

import logger from '../logger';

import * as Paths from '../../src/shared/paths';
import * as Endpoints from '../../src/shared/endpoints';
import prodConfig from '../webpack/config.browser-frontend.prod';
import devConfig from '../webpack/config.browser-frontend.dev';

const WEBPACK_STATS_OPTIONS = {
  colors: true,
  warnings: false,
};

let gWebpackDevServer;

gulp.task('browser-frontend:copy-html', () =>
  gulp.src(`${Paths.BROWSER_FRONTEND_SRC}/**/*.html`)
    .pipe(changed(Paths.BROWSER_FRONTEND_DST))
    .pipe(debug({ title: `Running ${colors.cyan('cp')}` }))
    .pipe(gulp.dest(Paths.BROWSER_FRONTEND_DST)));

gulp.task('browser-frontend:copy-to-qbrt-shell', () =>
  gulp.src(`${Paths.BROWSER_FRONTEND_DST}/**/*`)
    .pipe(changed(Paths.QBRT_RUNNER_SHELL_DST))
    .pipe(gulp.dest(Paths.QBRT_RUNNER_SHELL_DST)));

gulp.task('browser-frontend:webpack', () => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV !== 'development') {
    // In a production environment, webpack directly to disk.
    webpack(prodConfig, (err, stats) => {
      if (err) { reject(err); return; }
      if (stats) { logger.log(stats.toString(WEBPACK_STATS_OPTIONS)); }
      resolve();
    });
  } else {
    // In a development environment, webpack in memory and serve
    // the build with webpack-dev-server.
    const compiler = webpack(devConfig);
    const server = new WebpackDevServer(compiler, {
      ...devConfig.devServer,
      stats: WEBPACK_STATS_OPTIONS,
    });

    // We'll have to close the webpack dev server later, so store it as a global.
    // If we leave the server open, the build process will keep running forever.
    gWebpackDevServer = server;

    server.listen(
      Endpoints.WEBPACK_DEV_SERVER_PORT,
      Endpoints.WEBPACK_DEV_SERVER_HOST, resolve);
  }
}));

gulp.task('browser-frontend:build', gulp.series(
  'browser-frontend:copy-html',
  'browser-frontend:webpack',
  'browser-frontend:copy-to-qbrt-shell',
));

gulp.task('browser-frontend:build:cleanup', (cb) => {
  if (process.env.NODE_ENV === 'development') {
    gWebpackDevServer.close(cb);
  } else {
    cb();
  }
});
