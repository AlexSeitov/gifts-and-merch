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
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';
import imageminOptipng from 'imagemin-optipng';
import imageminGifsicle from 'imagemin-gifsicle';
import newer from 'gulp-newer';
import svgmin from 'gulp-svgmin';
import rename from 'gulp-rename';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.prod.js';
import ttf2woff2 from 'gulp-ttf2woff2';
import del from 'del';
import gulpif from 'gulp-if';
import { htmlValidator } from 'gulp-w3c-html-validator';
import replace from 'gulp-replace';

const sass = gulpSass(dartSass);

const isBuild = process.argv.includes('--build');
const isDev = !isBuild;

const sourceFolder = 'src/';
const buildFolder = 'dist/';

const path = {
  src: {
    html: sourceFolder + 'html/*.html',
    css: sourceFolder + 'styles/main.scss',
    js: sourceFolder + 'scripts/index.js',
    gifs: sourceFolder + 'images/**/*.gif',
    imagesToWebp: sourceFolder + 'images/**/*.{jpg,jpeg,png}',
    imagesPng: sourceFolder + 'images/**/*.png',
    favicon: sourceFolder + 'images/favicon.ico',
    svg: sourceFolder + 'images/**/*.svg',
    fonts: sourceFolder + 'fonts',
    woffFonts: sourceFolder + 'fonts/*.woff2',
    video: sourceFolder + 'video/*'
  },
  build: {
    css: buildFolder + 'css',
    js: buildFolder + 'js',
    images: buildFolder + 'images',
    fonts: buildFolder + 'fonts',
    video: buildFolder + 'video'
  },
  watch: {
    html: sourceFolder + '**/*.html',
    css: sourceFolder + 'styles/**/*.scss',
    js: sourceFolder + 'scripts/**/*.js',
    images: sourceFolder + 'images/**/*.{webp,png,gif,ico}',
    video: sourceFolder + 'video/*'
  },
  cleanFolder: buildFolder,
  cleanMap: buildFolder + '**/*.map'
};

export const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(fileinclude({ prefix: '@@' }))
    .pipe(replace(/\.jpg/g, '.webp'))
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(
      htmlmin({
        removeComments: true
      })
    )
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter())
    .pipe(gulp.dest(buildFolder))
    .pipe(browserSync.stream());
};

export const styles = () => {
  return gulp
    .src(path.src.css)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(replace(/\.jpg/g, '.webp'))
    .pipe(gulpif(isBuild, cleanCSS()))
    .pipe(rename('style.min.css'))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
};

export const scripts = () => {
  return gulp
    .src(path.src.js)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
};

export const gifs = () => {
  return gulp
    .src(path.src.gifs)
    .pipe(newer(path.build.images))
    .pipe(
      imagemin([imageminGifsicle({ optimizationLevel: 2 })], {
        verbose: true
      })
    )
    .pipe(gulp.dest(path.build.images));
};

export const imagesToWebp = () => {
  return gulp
    .src(path.src.imagesToWebp)
    .pipe(newer(path.build.images))
    .pipe(
      imagemin({
        plugins: [imageminWebp({ quality: 70 })]
      })
    )
    .pipe(gulp.dest(path.build.images));
};

export const imagesPng = () => {
  return gulp
    .src(path.src.imagesPng)
    .pipe(newer(path.build.images))
    .pipe(
      imagemin({
        plugins: [
          imageminOptipng({
            optimizationLevel: 5
          })
        ]
      })
    )
    .pipe(gulp.dest(path.build.images));
};

export const favicon = () => {
  return gulp
    .src(path.src.favicon)
    .pipe(rename('favicon.ico'))
    .pipe(gulp.dest(path.build.images));
};

export const svg = () => {
  return gulp
    .src(path.src.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(path.build.images));
};

export const ttfToWoff = () => {
  return gulp
    .src(`${path.src.fonts}/*.ttf`)
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.src.fonts));
};

export const ttfRemove = () => {
  return del(`${path.src.fonts}/*.ttf`);
};

export const fonts = () => {
  return gulp.src(path.src.woffFonts).pipe(gulp.dest(path.build.fonts));
};

export const video = () => {
  return gulp.src(path.src.video).pipe(gulp.dest(path.build.video));
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

  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], styles);
  gulp.watch([path.watch.js], scripts);
};

export const removeDist = () => {
  return del(path.cleanFolder);
};

export const removeMap = () => {
  return del(path.cleanMap);
};

export const toWoff2 = gulp.series(ttfToWoff, ttfRemove);

export const build = gulp.series(
  removeDist,
  gulp.parallel(
    html,
    styles,
    scripts,
    favicon,
    gifs,
    imagesToWebp,
    imagesPng,
    svg,
    fonts,
    video
  ),
  removeMap
);

const dev = gulp.series(
  removeDist,
  gulp.parallel(
    html,
    styles,
    scripts,
    favicon,
    gifs,
    imagesToWebp,
    imagesPng,
    svg,
    fonts,
    video,
    watchFiles
  )
);

export default dev;
