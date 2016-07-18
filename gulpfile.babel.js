/// <reference path="./typings/index.d.ts" />

import * as gulp from 'gulp';
import * as sourcemaps from 'gulp-sourcemaps';
import * as browserify from 'browserify';
import * as babelify from 'babelify';
import * as source from 'vinyl-source-stream';
import * as buffer from 'vinyl-buffer';

import { join } from 'path';
import { readFileSync } from 'fs';

let babelrc = JSON.parse(readFileSync(join(__dirname, '.babelrc'), 'utf-8'));

gulp.task('build', () => {
    return browserify({entries: './src/index.js', debug: true})
        .transform('babelify', babelrc)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['build']);