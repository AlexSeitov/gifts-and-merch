import gulp from 'gulp';
import browserSync from 'browser-sync';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import htmlbeautify from 'gulp-html-beautify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gcmq from 'gulp-group-css-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import webp from 'gulp-webp';
import imagemin, { mozjpeg, optipng } from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import svgmin from 'gulp-svgmin';
import gulpFavicons from 'gulp-favicons';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.prod.js';
import ttf2woff2 from 'gulp-ttf2woff2';
import del from 'del';
import gulpif from 'gulp-if';
import { htmlValidator } from 'gulp-w3c-html-validator';
import { existsSync } from 'fs';

const sass = gulpSass(dartSass);

const isBuild = process.argv.includes('--build');
const isDev = !isBuild;

const sourceFolder = 'src/';
const buildFolder = 'dist/';

const paths = {
  src: {
    html: sourceFolder + 'html/*.html',
    css: sourceFolder + 'styles/*.scss',
    js: sourceFolder + 'scripts/index.js',
    gifs: sourceFolder + 'images/**/*.gif',
    images: sourceFolder + 'images/**/*.{webp,jpg,jpeg}',
    webp: sourceFolder + 'images/',
    imagesPng: sourceFolder + 'images/**/*.png',
    svg: sourceFolder + 'images/**/*.svg',
    favicon: sourceFolder + 'images/favicon.svg',
    fonts: sourceFolder + 'fonts',
    woffFonts: sourceFolder + 'fonts/*.woff2',
    video: sourceFolder + 'video'
  },
  build: {
    css: buildFolder + 'css',
    js: buildFolder + 'js',
    images: buildFolder + 'images',
    favicons: buildFolder + 'favicons',
    fonts: buildFolder + 'fonts',
    video: buildFolder
  },
  watch: {
    html: sourceFolder + '**/*.html',
    css: sourceFolder + 'styles/**/*.scss',
    js: sourceFolder + 'scripts/**/*.js'
  },
  cleanFolder: buildFolder,
  cleanMap: buildFolder + '**/*.map'
};

export const html = () => {
  return gulp
    .src(paths.src.html)
    .pipe(fileinclude({ prefix: '@@' }))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true
      })
    )
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(gulp.dest(buildFolder))
    .pipe(browserSync.stream());
};

export const htmlValidation = () => {
  return gulp
    .src(buildFolder + '*.html')
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter());
};

export const styles = () => {
  return gulp
    .src(paths.src.css)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(
      rename((path) => {
        const str = path;
        str.basename += '.styles';
      })
    )
    .pipe(gulpif(isBuild, cleanCSS()))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.build.css))
    .pipe(browserSync.stream());
};

export const scripts = () => {
  return gulp
    .src(paths.src.js)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.build.js))
    .pipe(browserSync.stream());
};

export const gifs = () => {
  return gulp
    .src(paths.src.gifs)
    .pipe(newer(paths.build.images))
    .pipe(
      imagemin([imageminGifsicle({ optimizationLevel: 2 })], {
        verbose: true
      })
    )
    .pipe(gulp.dest(paths.build.images));
};

export const imagesToWebp = () => {
  return gulp
    .src(paths.src.images)
    .pipe(newer(paths.src.images))
    .pipe(webp())
    .pipe(gulp.dest(paths.src.webp));
};

export const images = () => {
  return gulp
    .src(paths.src.images)
    .pipe(newer(paths.build.images))
    .pipe(imagemin([mozjpeg({ quality: 75, progressive: true })]))
    .pipe(gulp.dest(paths.build.images));
};

export const imagesPng = () => {
  return gulp
    .src(paths.src.imagesPng)
    .pipe(newer(paths.build.images))
    .pipe(imagemin([optipng({ optimizationLevel: 5 })]))
    .pipe(gulp.dest(paths.build.images));
};

export const svg = () => {
  return gulp
    .src(paths.src.svg)
    .pipe(newer(paths.build.images))
    .pipe(svgmin())
    .pipe(gulp.dest(paths.build.images));
};

export const favicons = () => {
  return gulp
    .src(paths.src.favicon)
    .pipe(newer(paths.build.images))
    .pipe(gulp.dest(paths.build.favicons))
    .pipe(
      gulpFavicons({
        paths: paths.src.favicons,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          favicons: true,
          windows: true,
          yandex: false,
          coast: false,
          firefox: false
        }
      })
    )
    .pipe(gulp.dest(paths.build.favicons));
};
export const ttfToWoff = () => {
  return gulp
    .src(`${paths.src.fonts}/*.ttf`)
    .pipe(ttf2woff2())
    .pipe(gulp.dest(paths.src.fonts));
};

export const ttfRemove = () => {
  return del(`${paths.src.fonts}/*.ttf`);
};

export const fonts = () => {
  return gulp.src(paths.src.woffFonts).pipe(gulp.dest(paths.build.fonts));
};

export const video = (done) => {
  if (existsSync(paths.src.video)) {
    return gulp.src(paths.src.video).pipe(gulp.dest(paths.build.video));
  }
  return done();
};

export const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: buildFolder
    },
    notify: false,
    port: 3000,
    open: true
  });

  gulp.watch([paths.watch.html], html);
  gulp.watch([paths.watch.css], styles);
  gulp.watch([paths.watch.js], scripts);
};

export const removeDist = () => {
  return del(paths.cleanFolder);
};

export const removeMap = () => {
  return del(paths.cleanMap);
};

export const dev = gulp.series(ttfToWoff, ttfRemove, imagesToWebp);

export const build = gulp.series(
  removeDist,
  gulp.parallel(
    html,
    styles,
    scripts,
    favicons,
    gifs,
    imagesToWebp,
    images,
    imagesPng,
    svg,
    fonts,
    video
  ),
  removeMap
);

export const start = gulp.series(
  gulp.parallel(
    html,
    styles,
    scripts,
    favicons,
    gifs,
    imagesToWebp,
    images,
    imagesPng,
    svg,
    fonts,
    video,
    watchFiles
  )
);
