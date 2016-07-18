/// <reference path="./typings/index.d.ts" />

let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let glob = require('glob');
let babel = require('gulp-babel');

import { join } from 'path';
import { readFileSync } from 'fs';

let babelrc = JSON.parse(readFileSync(join(__dirname, '.babelrc'), 'utf-8'));

let files = glob.sync('./src/**/*.js');

gulp.task('build', () => {
	return gulp.src(files)
		.pipe(babel(babelrc))
		.pipe(gulp.dest('../mw-model-binder/dist'));
});

gulp.task('default', ['build']);