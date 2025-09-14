const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');

const isProd = process.env.NODE_ENV === 'production';
const landings = require('./landings.config');

const paths = {
    src: 'src',
    dist: 'dist',
    assets: {
        images: 'src/images/**/*',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        fonts: 'src/fonts/**/*',
        videos: 'src/videos/**/*'
    }
};

function clean() {
    return del([paths.dist]);
}

function styles() {
    const streams = landings.map(l => {
        return src('src/scss/main.scss', { allowEmpty: true })
            .pipe(gulpIf(!isProd, sourcemaps.init()))
            .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
            .pipe(autoprefixer({ cascade: false }))
            .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
            .pipe(gulpIf(!isProd, sourcemaps.write('.')))
            .pipe(dest(`${paths.dist}/${l.id}/assets/css`))
            .pipe(browserSync.stream());
    });
    return merge(streams);
}

function scripts() {
    const webpack = require('webpack');
    const webpackStream = require('webpack-stream');
    const streams = landings.map(l => {
        return src('src/js/main.js', { allowEmpty: true })
            .pipe(webpackStream({
                mode: isProd ? 'production' : 'development',
                entry: './src/js/main.js',
                output: { filename: 'main.js' },
                devtool: isProd ? false : 'source-map',
                module: {
                    rules: [
                        // add loaders here if needed in future
                    ]
                },
                resolve: { extensions: ['.js'] },
                target: 'web'
            }, webpack))
            .pipe(dest(`${paths.dist}/${l.id}/assets/js`))
            .pipe(browserSync.stream());
    });
    return merge(streams);
}

function images() {
    const streams = landings.map(l => {
        return src(paths.assets.images, { allowEmpty: true })
            .pipe(gulpIf(isProd, imagemin()))
            .pipe(dest(`${paths.dist}/${l.id}/assets/images`));
    });
    return merge(streams);
}

function videos() {
    const streams = landings.map(l => {
        return src(paths.assets.videos, { allowEmpty: true })
            .pipe(gulpIf(isProd, imagemin()))
            .pipe(dest(`${paths.dist}/${l.id}/assets/videos`));
    });
    return merge(streams);
}

function fonts() {
    const streams = landings.map(l => {
        return src(paths.assets.fonts, { allowEmpty: true })
            .pipe(dest(`${paths.dist}/${l.id}/assets/fonts`));
    });
    return merge(streams);
}

function html() {
    const streams = landings.map(l => {
        return src(['src/pages/**/*.html', '!src/pages/**/_*.html'])
            .pipe(fileInclude({
                prefix: '@@',
                basepath: '@file',
                context: {
                    landing: l.id,
                    headerImage: `assets/images/headers/${l.header}`,
                    titleSuffix: l.titleSuffix || '',
                    h1: l.h1,
                    collectionPhoto: `${l.collectionPhoto}`,
                    collectionDescriptor: l.collectionDescriptor,
                }
            }))
            .pipe(dest(`${paths.dist}/${l.id}`));
    });
    return merge(streams).pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: paths.dist
        },
        startPath: `/${landings[0].id}/`,
        open: false,
        notify: false
    });

    watch(paths.assets.scss, styles);
    watch(paths.assets.js, scripts);
    watch(paths.assets.images, images);
    watch(paths.assets.videos, videos);
    watch(['src/pages/**/*.html', 'src/templates/**/*.html', 'src/partials/**/*.html'], html);
}

const build = series(clean, parallel(styles, scripts, images, videos, fonts, html));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.videos = videos;
exports.fonts = fonts;
exports.html = html;
exports.build = build;
exports.serve = series(build, serve);
