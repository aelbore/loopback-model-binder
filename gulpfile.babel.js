/// <reference path="./typings/index.d.ts" />

let gulp = require('gulp-param')(require('gulp'), process.argv);
let sourcemaps = require('gulp-sourcemaps');
let glob = require('glob');
let babel = require('gulp-babel');

import { join } from 'path';
import { readFileSync } from 'fs';

let babelrc = JSON.parse(readFileSync(join(__dirname, '.babelrc'), 'utf-8'));

let files = glob.sync('./src/**/*.js');

gulp.task('build', (dist) => {
	return gulp.src(files)
		.pipe(babel(babelrc))
		.pipe(gulp.dest(dist));
});