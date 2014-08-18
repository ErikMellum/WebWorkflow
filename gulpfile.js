var gulp = require ('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass'),
    coffee = require('gulp-coffee'),
    lr = require('tiny-lr'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    server = lr();

var jsSources = [
  'components/scripts/*'
];

var styleSources = [
  'components/sass/main.scss'
];

var coffeeSources = [
  'components/coffee/*.coffee'
];

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname));
  app.listen(4000);
});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(uglify())
  .pipe(jshint())
  .pipe(concat('script.js'))
  .pipe(livereload())
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
  .pipe(coffee({bare: true}))
    .on('error', gutil.log)
  .pipe(gulp.dest('components/scripts'));
});

gulp.task('watch', function(){
  var server = livereload();
  gulp.watch(jsSources, ['js']);
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(styleSources, ['styles']);
  gulp.watch('public/stylesheets/*.css', notifyLiveReload);
  gulp.watch('public/javascripts/*.js', notifyLiveReload);
  gulp.watch('*.html', notifyLiveReload);
});

gulp.task('default', ['styles', 'js', 'express', 'livereload', 'watch', 'coffee']);

gulp.task('styles', function(){
  gulp.src(styleSources)
  .pipe(sass({style: 'expanded', lineNumbers: true}))
    .on('error', gutil.log)
  .pipe(concat('style.css'))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
  .pipe(gulp.dest('public/stylesheets'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(livereload())
  .pipe(gulp.dest('public/stylesheets'));
});
