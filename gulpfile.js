'use strict';

/**
 * Module dependencies.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var runSequence = require('run-sequence');


gulp.task('minify', function(){
  return gulp.src(['replace-youtube-koemei.js'])
    .pipe(uglify())
    .pipe(rename('replace-youtube-koemei.min.js'))
    .pipe(gulp.dest(''));
});

gulp.task('build', function (done) {
  runSequence('minify', done);
});

// Run the project in development mode
gulp.task('default', function (done) {
  console.log('Run gulp build to minify js');

});

