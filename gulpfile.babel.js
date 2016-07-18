/// <reference path="./typings/index.d.ts" />

let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let glob = require('glob');
let babel = require('gulp-babel');

import { join } from 'path';
import { readFileSync } from 'fs';

let babelrc = JSON.parse(readFileSync(join(__dirname, '.babelrc'), 'utf-8'));

let files = glob.sync('./src/**/*.js');

gulp.task('build', () => {
	return gulp.src(files)
		.pipe(babel(babelrc))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);