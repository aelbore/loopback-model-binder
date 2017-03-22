const gulp = require('gulp');
const glob = require('glob');

const files = glob.sync('./tasks/**/*.js');
files.forEach(file => {
	require(file);
});

gulp.task('build', ['clean', 'transpile']);