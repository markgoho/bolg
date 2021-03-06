const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const writefile = require('./bolg/helpers').writefile;
const browserSync = require('browser-sync');
const fs = require('fs');

function sync(done) {
  return browserSync.init({
    proxy: 'localhost:3000',
    open: true,
    logFileChanges: false,
  }, done);
}

function compileSass() {
  return gulp.src('src/styles/post-index.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules'],
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(sourcemaps.write('/', {
      sourceMappingURLPrefix: '/css',
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
    .on('end', () => {
      const manifest = JSON.parse(fs.readFileSync('./public/config/webpack.manifest.json', 'utf-8'));
      manifest['/bolg.css'] = '/css/post-index.css';
      writefile('public/config/webpack.manifest.json', JSON.stringify(manifest));
    });
}

const watch = (done) => {
  gulp.watch('src/styles/**/*.scss', compileSass);
  sync(done);
};

gulp.task('default', watch);
gulp.task('sass', compileSass);
gulp.task('watch', watch);
gulp.task('server', sync);
