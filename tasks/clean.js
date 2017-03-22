const gulp = require('gulp');
const rimraf = require('rimraf');

gulp.task('clean', (callback) => {
  return rimraf('dist', callback);
});