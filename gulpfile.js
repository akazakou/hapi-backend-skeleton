'use strict';

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const tslint = require('gulp-tslint');
const shell = require('gulp-shell');

const outDir = 'build';

/**
 * Remove build directory.
 */
gulp.task('clean', () => {
  return gulp.src(`${outDir}`, {read: false})
    .pipe(rimraf());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report({emitError: true}))
});

gulp.task('compile', shell.task([
  'tsc',
]));

/**
 * Build the project.
 */
gulp.task('build', ['tslint', 'compile']);

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
