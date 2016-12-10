'use strict';
const gulp = require('gulp');
const csslint = require('gulp-csslint');
const htmlhint = require("gulp-htmlhint");
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const jsdoc = require('gulp-jsdoc3');

const paths = {
  src: 'src', dst: './',
  css:   ['demo/*.css', 'demo/**/*.css',
          'test/*.css', 'test/**/*.css',
          'src/*.css',   'src/**/*.css'],
  html:  ['demo/*.html', 'demo/**/*.html',
          'test/*.html', 'test/**/*.html'],
  js:    ['demo/*.js',   'demo/**/*.js',
          'test/*.js',   'test/**/*.js',
          'src/*.js',    'src/**/*.js'],
  csssrc:['src/*.css',   'src/**/*.css'],
  jssrc: ['src/*.js',    'src/**/*.js']
};


gulp.task('doc', function () {
  var config = require('./.jsdoc.json');
  return gulp.src(['./README.md'].concat(paths.jssrc), { read: false })
    .pipe(jsdoc(config));
});

gulp.task('css-lint', function() {
  return gulp.src(paths.css)
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(connect.reload());
});

gulp.task('html-hint', _ => {
  return gulp.src(paths.html)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(connect.reload());
});

gulp.task('js-lint', _ => {
  return gulp.src(paths.jssrc)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs.reporter())
    .pipe(connect.reload());
});

gulp.task('js-copy', _ => {
  return gulp.src(paths.jssrc)
    .pipe(babel())
    .pipe(gulp.dest(paths.dst));
});

gulp.task('css-copy', _ => {
  return gulp.src(paths.csssrc)
    .pipe(gulp.dest(paths.dst));
});

gulp.task('watch', _ => {
  gulp.watch(paths.js, ['js-lint']);
  gulp.watch(paths.css, ['css-lint']);
  gulp.watch(paths.html, ['html-hint']);
  gulp.watch(paths.jssrc, ['js-copy', 'doc']);
  gulp.watch(paths.csssrc, ['css-copy']);
});

gulp.task('connect', function() {
  connect.server({
    root: paths.dst,
    livereload: true,
    port: 9001
  });
});

gulp.task('default', [
  'js-lint',
  'css-lint',
  'html-hint',
  'css-copy',
  'js-copy',
  'doc',
  'watch',
  'connect'
]);

