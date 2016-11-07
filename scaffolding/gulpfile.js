'use strict';
/* global require, process, __dirname */
var ARGS = require('yargs').argv;
var es = require('event-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var scsslint = require('gulp-scss-lint');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');
var notify = require('gulp-notify');
var ngConstant = require('gulp-ng-constant');
var karma = require('karma').server;
var wiredep = require('gulp-wiredep');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var templateCache = require('gulp-angular-templatecache');
require('gulp-release-it')(gulp);
require('gulp-grunt')(gulp);


var ENV = ARGS.env || 'int';
var CONFIG = require('./www/json/config.' + ENV + '.json');

var paths = {
  sass: ['./scss/**/*.scss', './www/js/modules/**/*.scss'],
  js: ['./www/js/*.js', '!./www/js/app.{const,defaultLang,templates}.js', './gulpfile.js']
};

gulp.task('build', ['ngconstant', 'templates', 'sass', 'bower', 'bower-files', 'inject']);
gulp.task('test', ['lint', 'build', 'karma']);
gulp.task('serve', ['build', 'watch']);
gulp.task('default', ['lint', 'build']);

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return gulp.src([
    'coverage',
    'www/lib',
    'www/css',
    'www/flags',
    'www/js/app.const.js',
    'www/js/app.defaultLang.js',
    'www/js/app.templates.js'
  ]).pipe(clean({
    read: false,
    force: true
  }));
});

gulp.task('templates', function() {
  return gulp.src('www/js/**/*.html')
    .pipe(templateCache('app.templates.js', {
      module: 'app.templates',
      root: 'js/',
      standalone: true,
      moduleSystem: 'IIFE'
    }))
    .pipe(gulp.dest('www/js'));
});

gulp.task('bower', function() {
  // https://github.com/gulpjs/gulp/issues/82
  return es.merge(

    gulp.src(['./www/index.html'])
    .pipe(wiredep({
      ignorePath: '../bower_components/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="lib/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(gulp.dest('./www')),

    gulp.src(['./scss/ionic.app.scss'])
    .pipe(wiredep())
    .pipe(gulp.dest('./scss')),

    gulp.src(['./tests/karma.conf.js'])
    .pipe(wiredep({
      ignorePath: '../bower_components/',
      fileTypes: {
        js: {
          replace: {
            js: '\'www/lib/{{filePath}}\','
          }
        }
      }
    }))
    .pipe(gulp.dest('./tests'))

  );

});

gulp.task('bower-files', function() {
  return es.merge(
    gulp.src(mainBowerFiles(), {
      base: './bower_components'
    })
    .pipe(gulp.dest('./www/lib')),

    // vendor not defined in bower.json
    gulp.src(['./bower_components/openfb/ngopenfb.js'], {
      base: './bower_components'
    })
    .pipe(gulp.dest('./www/lib'))

  );
});

gulp.task('ngconstant', function() {

  return es.merge(

    gulp.src('./www/json/config.' + ENV + '.json')
    .pipe(ngConstant({
      name: 'app.const',
      wrap: '(function() { <%= __ngModule %> })();',
      stream: true,
      constants: {
        CONFIG: require('./www/json/config.' + ENV + '.json')
      }
    }))
    .pipe(rename('app.const.js'))
    .pipe(gulp.dest('./www/js')),

    gulp.src('./www/json/lang/' + CONFIG.lang + '.json')
    .pipe(ngConstant({
      name: 'app.defaultLang',
      wrap: '(function() { <%= __ngModule %> })();',
      stream: true,
      constants: {
        defaultLang: {
          name: CONFIG.lang,
          values: require('./www/json/lang/' + CONFIG.lang + '.json')
        }
      }
    }))
    .pipe(rename('app.defaultLang.js'))
    .pipe(gulp.dest('./www/js/'))

  );

});

gulp.task('sass', function() {
  return gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  // gulp.watch(paths.sass, ['scss-lint', 'sass']);
  gulp.watch('./www/js/**/*.js', ['jscs', 'jshint', 'eslint']);
  gulp.watch('./www/js/modules/**/*.html', ['templates']);
  gulp.watch(['./www/json/config.*.json', './www/json/lang/*.json'], ['ngconstant', 'inject']);
  gulp.watch('./bower.json', ['bower']);
});

gulp.task('inject', ['ngconstant', 'templates'], function() {

  var target = gulp.src('./www/index.html');
  var sources = gulp.src(['./js/*.js', './js/modules/**/*.module.js', './js/modules/**/*.js', './js/**/*.js'], {
    read: false,
    cwd: './www'
  });

  return target.pipe(inject(sources, {
      relative: true
    }))
    .pipe(gulp.dest('./www'));

});


gulp.task('scss-lint', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(scsslint({
      'config': 'scss-lint.yml'
    }))
    .pipe(notify({
      title: 'SCSS-LINT',
      message: 'SCSS-LINT Passed. Let it fly!'
    }));
});

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('eslint', function() {
  return gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('jscs', function() {
  return gulp.src(paths.js)
    .pipe(jscs());
});

gulp.task('lint', ['jscs', 'jshint', 'eslint'], function() {
  // gulp.task('lint', ['jscs', 'jshint', 'eslint', 'scss-lint'], function() {
  return gulp.src('/')
    .pipe(notify({
      title: 'LINT',
      message: 'LINT Passed. Let it fly!'
    }));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(cb) {
  if (!sh.which('git')) {
    gutil.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  cb();
});

/**
 * Test task, run test once and exit
 */
gulp.task('karma', ['build'], function(cb) {
  karma.start({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, function() {
    cb();
  });
});

gulp.task('locales', ['grunt-locales']);
