import gulp from "gulp"
import { path } from "./gulp/config/path.js"
import { plugins } from "./gulp/config/plugins.js"

global.app = {
    isDev: true,
    path: path,
    gulp: gulp,
    plugins: plugins,
    plumberNotify: (title) => (
        plumber(notify.onError({
            title,
            message: "Error: <%= error.message %>"
        }))
    )
}

import { reset } from "./gulp/tasks/reset.js"
import { images } from "./gulp/tasks/images.js"
import { svgSprites } from "./gulp/tasks/svgSprite.js"
import { Pug as pug, njk } from "./gulp/tasks/html.js"
import { server } from "./gulp/tasks/server.js"
import { scss, css_libs } from "./gulp/tasks/scss.js"
import { js, js_libs } from "./gulp/tasks/js.js"
import { fonts } from "./gulp/tasks/fonts.js"
import { json } from "./gulp/tasks/json.js"
import { zip } from "./gulp/tasks/zip.js"
import { copy } from "./gulp/tasks/copy.js"

// наблюдение за изменениями в файлах
// 1ый аргумент - путь, 2ой - задача
function watcher() {
    gulp.watch(path.watch.images, images)
    gulp.watch(path.watch.njk, njk)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.js, js)
}

const toProd = () => () => global.app.isDev = false

const copy_videos = () => copy("/videos/*", "/videos/")
const copy_json = () => copy("/json/*", "/json/")

const mainTasks = gulp.parallel(njk, images, css_libs, scss, js_libs, js, fonts, json)

// последовательное выолнение задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const zipping = gulp.series(reset, mainTasks, zip)

//регистрация задачи
gulp.task("fonts", fonts)
gulp.task('default', dev)
gulp.task('build', build)
gulp.task('clear', reset)
gulp.task("images", images)
gulp.task("svg-sprite", svgSprites)
gulp.task("zipping", zipping)