/// <reference path="./typings/index.d.ts" />

let gulp = require('gulp-param')(require('gulp'), process.argv);
let sourcemaps = require('gulp-sourcemaps');
let glob = require('glob');
let babel = require('gulp-babel');
let del = require('del');
let vinylPaths = require('vinyl-paths');

import { join } from 'path';
import { readFileSync } from 'fs';

let babelrc = JSON.parse(readFileSync(join(__dirname, '.babelrc'), 'utf-8'));

let files = glob.sync('./src/**/*.js');

gulp.task('build', (build) => {
	return gulp.src(files)
		.pipe(babel(babelrc))
		.pipe(gulp.dest(build));
});

gulp.task('copy-index', (index) => {
	return gulp.src('./index.js')
			.pipe(vinylPaths(del))
			.pipe(gulp.dest(index));
});

gulp.task('compile-index',  (compile) => {
	return gulp.src('./.temp/index.js')
			.pipe(babel(babelrc))
			.pipe(gulp.dest(compile));
});

gulp.task('copy', (dest) => {
	return gulp.src(files)
		.pipe(gulp.dest(dest));
});


