import plumber from "gulp-plumber";
import notify from "gulp-notify"
import gulpif from "gulp-if";
import browserSync from "browser-sync"
import newer from "gulp-newer";

const plugins = {
    plumber: plumber,
    notify: notify,
    browserSync: browserSync,
    newer: newer,
    if: gulpif
}

export { plugins }