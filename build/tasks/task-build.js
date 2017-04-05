// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import gulp from 'gulp';
import debug from 'gulp-debug';
import file from 'gulp-file';

import * as Paths from '../../src/shared/paths';

gulp.task('build:write-build-type', () =>
  file(Paths.BUILD_TYPE_FILENAME, '"local"', { src: true })
    .pipe(debug({ title: 'Creating' }))
    .pipe(gulp.dest(Paths.BUILD_TARGET_DIR)));

gulp.task('build', gulp.series(
  'build:write-build-type',
  'browser-shared:build',
  'browser-runner:build',
  'browser-server:build',
  'browser-frontend:build',
));

gulp.task('build+start', gulp.series(
  'build',
  'start',
));

gulp.task('build+serve', gulp.series(
  'build',
  'serve',
));
