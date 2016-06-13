'use strict';

// Include promise polyfill for node 0.10 compatibility
require('es6-promise').polyfill();

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var packageJson = require('./package.json');
var crypto = require('crypto');
var proxy = require('proxy-middleware');
var url = require('url');
var vulcanize = require('gulp-vulcanize');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var jsonminify = require('gulp-json-minify');
var babel = require('gulp-babel');

// Generate config data for the <sw-precache-cache> element.
// This include a list of files that should be precached, as well as a (hopefully unique) cache
// id that ensure that multiple PSK projects don't share the same Cache Storage.
// This task does not run by default, but if you are interested in using service worker caching
// in your project, please enable it within the 'default' task.
// See https://github.com/PolymerElements/polymer-starter-kit#enable-service-worker-support
// for more context.
gulp.task('cache-config', (callback) => {
  var dir = dist();
  var config = {
    cacheId: packageJson.name || path.basename(__dirname),
    disabled: false
  };

  glob([
    'index.html',
    './',
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '{elements,scripts,styles}/**/*.*'],
    { cwd: dir }, (error, files) => {
      if (error) {
        callback(error);
      } else {
        config.precache = files;

        var md5 = crypto.createHash('md5');
        md5.update(JSON.stringify(config.precache));
        config.precacheFingerprint = md5.digest('hex');

        var configPath = path.join(dir, 'cache-config.json');
        fs.writeFile(configPath, JSON.stringify(config), callback);
      }
    });
});


// VASS Polymer Pet Gulp Config starts here
// Clean output directory
gulp.task('clean', () => {
  return del(['.tmp', 'dist']);
});


// Watch files for changes & reload
gulp.task('serve', () => {
  // Proxy to localhost:8080
  var proxyOptions = url.parse('http://localhost:8080/api');
  proxyOptions.route = '/api';
  proxyOptions.preserveHost = true;
  
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'VASS Polymer Test',
    browser: 'google chrome',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: (snippet) => {
          return snippet;
        }
      }
    },
    server: {
      baseDir: ['app'],
      // To serve bower_components from this route
      routes: {
        '/bower_components': 'app/bower_components'
      },
      middleware: [function (req, res, next) {
          // CORS Origin....
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }, proxy(proxyOptions)]
    }
  });

  gulp.watch(['app/**/*.html', '!app/bower_components/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], reload);
  gulp.watch(['app/images/**/*'], reload);
});


// Build and serve the output from the dist build
gulp.task('serve:dist', ['build'], () => {
  // Proxy to localhost:8080
  var proxyOptions = url.parse('http://localhost:8080/api');
  proxyOptions.route = '/api';
  proxyOptions.preserveHost = true;

  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'VASS Polymer Test Dist',
    browser: 'google chrome',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: (snippet) => {
          return snippet;
        }
      }
    },
    server: {
      baseDir: 'dist',
      index: 'index.html',
      middleware: [function (req, res, next) {
          // CORS Origin....
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }, proxy(proxyOptions)]
    }
  });
});


// Build and serve the output from the dist build
gulp.task('serve:cloud', ['build'], () => {
  // Proxy to localhost:8080
  var proxyOptions = url.parse('http://localhost:8080/api');
  proxyOptions.route = '/api';
  proxyOptions.preserveHost = true;

  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'VASS Polymer Test Dist',
    browser: 'google chrome',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: (snippet) => {
          return snippet;
        }
      }
    },
    server: {
      baseDir: 'dist',
      index: 'index.html',
      middleware: [function (req, res, next) {
          // CORS Origin....
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }]
    }
  });
});



// Babel task. Compile ES6 script into ES5
gulp.task('babel-scripts', () => {
	return gulp.src(['app/scripts/**/*.js'])
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('.tmp/scripts'));
});
gulp.task('babel-elements', () => {
	return gulp.src(['app/elements/**/*.js'])
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('.tmp/elements'));
});
gulp.task('babel', ['babel-scripts', 'babel-elements']);

// Minify for JSON files
gulp.task('json-minify', function () {
    return gulp.src(['app/**/*.json', '!app/bower_components/**/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));
});
// Minify for custom Polymer elements
gulp.task('htmlPolymerMinify', () => {
  return gulp.src(['app/elements/**/*.html', '!app/elements/elements.html'])
      .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments:true}))
      .pipe(gulp.dest('dist/elements'));
});
// Minify HTML files containing styles
gulp.task('htmlMinify', () => {
  return gulp.src('app/styles/*.html')
    .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true}))
    .pipe(gulp.dest('dist/styles'));
});

// Minify for the html files on dist
gulp.task('useminMinify', () => {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minifyCSS', () => {
  return gulp.src('app/styles/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'))
});

// Optimize images
gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});

// Copy JavaScript files
gulp.task('copyFiles', () => {
  return gulp.src(['.tmp/**/*.js', '!.tmp/scripts/components/*.js', 'app/*.ico', 'app/*.txt', 'app/Staticfile'], {
      dot: true
    }).pipe(gulp.dest('dist'));
});

// Copy JavaScript Bower files. Vulcanize needs them...
gulp.task('copyBower', () => {
  return gulp.src(['app/bower_components/**/intl-messageformat.min.js', 
                  'app/bower_components/**/web-animations-next-lite.min.js',
                  'app/bower_components/**/Promise.js'], {
      dot: true
    }).pipe(gulp.dest('dist/bower_components'));
});

// Usemin for index and login pages
gulp.task('usemin', function () {
    return gulp.src(['app/index.html', 'app/login.html'])
      .pipe(usemin({
        inlinecss: [cleanCSS(), 'concat']
      }))
      .pipe(gulp.dest('dist'));
});

// Vulcanize Polymer lib elements
gulp.task('vulcanize', function() {
  return gulp.src(['app/elements/elements.html', ])
    .pipe(vulcanize())
    .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments:true}))
    .pipe(gulp.dest('dist/elements'));
}); 
// Vulcanize Polymer lib elements
gulp.task('vulcanizeLogin', function() {
  return gulp.src(['app/elements/login-form/login-form.html'])
    .pipe(vulcanize())
    .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments:true}))
    .pipe(gulp.dest('dist/elements/login-form'));
}); 
gulp.task('build', ['clean'], (done) => {
  runSequence(
      ['babel','htmlPolymerMinify', 'htmlMinify', 'images', 'json-minify', 'minifyCSS'],
      ['usemin', 'vulcanize', 'vulcanizeLogin', 'copyFiles', 'copyBower'], 
      ['useminMinify'], () => {
       done();
     });
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {
  // Do nothing
}
