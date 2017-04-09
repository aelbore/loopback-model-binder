const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('transpile', () => {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest(tsProject.options.outDir));
});