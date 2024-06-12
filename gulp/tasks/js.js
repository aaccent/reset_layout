import webpack from "webpack-stream"

const js = () => {
    return app.gulp.src(app.path.src.js)
        .pipe(app.plugins.plumber(app.plugins.notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>"
        })))
        .pipe(webpack({
            mode: app.isDev ? "development" : "production",
            optimization: {
                minimize: false
            },
            entry: {
                // script: "./src/js/script.js",
                app: "./src/js/app.js",
                // equipment: "./src/js/equipment.js",
                // product: "./src/js/product.js",
                // service: "./src/js/service.js",
                // case: "./src/js/case.js",
                // projects: "./src/js/projects.js",
                // contacts: "./src/js/contacts.js",
                // about: "./src/js/about.js",
                // typical: "./src/js/typical.js"
            },
            output: {
                filename: "[name].min.js"
            },
            devtool: app.isDev ? "source-map" : false
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browserSync.stream())
}

const js_libs = () => {
    return app.gulp.src(app.path.src.js_libs)
        .pipe(app.gulp.dest(app.path.build.js_libs))
}

export { js, js_libs }

// const concat        = require('gulp-concat');

// function scripts() {
//     return src([
//       'node_modules/jquery/dist/jquery.js',
//       'app/js/main.js'
//     ])
//       .pipe(concat('main.min.js'))
//       .pipe(uglify())
//       .pipe(dest('app/js'))
//       .pipe(browserSync.stream())
// }