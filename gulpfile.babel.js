const gulp = require('gulp');
const glob = require('glob');
const gulpSequence = require('gulp-sequence');

const files = glob.sync('./tasks/**/*.js');
files.forEach(file => {
	require(file);
});

gulp.task('build', gulpSequence('clean', 'transpile'));