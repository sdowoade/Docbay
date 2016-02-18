'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var jasmine = require('gulp-jasmine');
var less = require('gulp-less');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-cssnano');
var bower = require('gulp-bower');
var browserify = require('browserify');
var karmaServer = require('karma').Server;
var source = require('vinyl-source-stream');
var clean = require('gulp-rimraf');
var paths = {
  scripts: ['./app/**/*.js', './index.js',
    './server/**/*.js', './tests/**/*.js'
  ],
  jade: ['!app/shared/**', 'app/**/*.jade'],
  styles: 'app/styles/*.less',
  public: 'public/**',
  images: 'app/images/**/*',
  staticFiles: [
    '!app/**/*.+(less|css|js|jade)',
    '!app/images/**/*',
    'app/**/*.*'
  ],
  unitTests: [],
  bendTests: ['./tests/bend/**/*.spec.js'],
  libTests: ['lib/tests/**/*.js']
};

var ENV = process.env.NODE_ENV || 'development';
if (ENV === 'development') {
  require('dotenv').load();
}

gulp.task('clean', () => {
  return gulp.src(paths.public)
    .pipe(clean({}));
});

/* Convert less to minified css */
gulp.task('less', () => {
  return gulp.src(paths.styles)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});

/* Convert jade to html */
gulp.task('jade', () => {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'));
});

gulp.task('images', () => {
  return gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('bower', () => {
  return bower()
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('browserify', () => {
  return browserify('./app/scripts/application.js').bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Error: in browserify gulp task'))
    .pipe(source('application.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('static-files', () => {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest('public/'));
});

gulp.task('nodemon', () => {
  nodemon({
      script: 'index',
      ext: 'js',
      ignore: ['public/', 'node_modules/', 'seeders/']
    })
    .on('change', ['lint'])
    .on('restart', () => {
      console.log('>> node restart');
    });
});

gulp.task('test', ['build'], (done) => {
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done()).start();
});

/* Watch for changes */
gulp.task('watch', () => {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.scripts, ['browserify']);
});

gulp.task('build', ['jade', 'less', 'static-files',
  'images', 'browserify', 'bower'
]);

gulp.task('heroku:production', ['build']);
gulp.task('production', ['nodemon', 'build']);
gulp.task('default', ['nodemon', 'watch', 'build']);
