var gulp = require('gulp'),
  del = require('del'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  notify = require('gulp-notify'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano');

//build
const buildMarkup = () => {
  return gulp.src('*.html').pipe(gulp.dest('docs'));
};

const buildScript = () => {
  return gulp.src(['js/scripts.min.js']).pipe(gulp.dest('docs/js'));
};

const buildStyle = () => {
  return gulp.src(['css/style.min.css']).pipe(gulp.dest('docs/css'));
};

const buildFonts = () => {
  return gulp.src(['fonts/**/*']).pipe(gulp.dest('docs/fonts'));
};

const buildImage = () => {
  return gulp.src(['img/**/*']).pipe(gulp.dest('docs/img'));
};

const removeDocs = () => {
  return del('docs');
};

//compile
// const compileScript = () => {
//   return gulp
//     .src([
//       // here add js libs
//     ])
//     .pipe(concat('scripts.min.js'))
//     .pipe(
//       babel({
//         presets: [
//           [
//             '@babel/preset-env',
//             {
//               targets: {
//                 ie: '9',
//               },
//             },
//           ],
//         ],
//       })
//     )
//     .pipe(gulp.dest('./js'))
//     .pipe(browserSync.stream());
// };

const compileStyle = () => {
  var plugins = [autoprefixer(), cssnano()];
  return gulp
    .src([
      'css/normalize.css',
      'less/style.less',
      'less/tablet-query.less',
      'less/mobile-query.less',
    ])
    .pipe(
      less({
        outputStyle: 'expand',
      }).on('error', notify.onError())
    )
    .pipe(concat('style.min.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
};

const compile = gulp.parallel(compileStyle);

const build = gulp.series(
  removeDocs,
  compile,
  gulp.parallel(buildMarkup, buildScript, buildStyle, buildFonts, buildImage)
);

//serve
const startServer = (done) => {
  browserSync.init({
    server: {
      baseDir: './',
    },

    port: 3000,
  });
  done();
};

const reload = (done) => {
  browserSync.reload();
  done();
};

const serve = gulp.series(compile, startServer);

//watch
const watchMarkup = (done) => {
  gulp.watch('*.html', gulp.series(reload));
  done();
};

// const watchScript = (done) => {
//   gulp.watch(['js/*.js', '!js/scripts.min.js'], gulp.series(compileScript));
//   done();
// };

const watchStyle = (done) => {
  gulp.watch(
    ['css/*.css', 'less/*.less', '!css/style.min.css'],
    gulp.series(compileStyle)
  ); //последовательно
  done();
};

const watch = gulp.parallel(watchMarkup, watchStyle);

const defaultTasks = gulp.parallel(serve, watch); //одновременно

gulp.task('build', build);
gulp.task('default', defaultTasks);
