import dartSass from "sass" // препроцессор
import gulpSass from "gulp-sass" // плагин для запуска препроцессора
import rename from "gulp-rename"
import webpCss from "gulp-webp-css"
import cssbeautify from "gulp-cssbeautify"
import sourceMaps from "gulp-sourcemaps"

import cleanCss from "gulp-clean-css"
import autoprefixer from "gulp-autoprefixer"
import groupCssMediaQueries from "gulp-group-css-media-queries"

const sass = gulpSass(dartSass)

const scss = () => {
    return app.gulp.src([app.path.src.scss, `!./src/scss/base.scss`])
        // .pipe(app.plumberNotify("SCSS"))
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
        })))
        .pipe(app.plugins.if(app.isDev, sourceMaps.init()))
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(app.plugins.if(!app.isDev,
            autoprefixer({
                grid: true,
                overrideBrowserslist: ["last 10 versions"],
                cascade: true
            }),
        ))
        .pipe(app.plugins.if(!app.isDev, groupCssMediaQueries()))
        .pipe(app.plugins.if(!app.isDev, cleanCss()))
        .pipe(app.plugins.if(!app.isDev, cssbeautify()))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(app.plugins.if(app.isDev, sourceMaps.write("./maps")))
        // .pipe(webpcss({
        //     webpClass: ".webp",
        //     noWebpClass: ".no-webp"
        // }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browserSync.stream())
}

const css_libs = () => {
    return app.gulp.src(app.path.src.css_libs)
        .pipe(app.gulp.dest(app.path.build.css_libs))
}

export { scss, css_libs }