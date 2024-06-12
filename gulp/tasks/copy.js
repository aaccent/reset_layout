const copy = (srcPath, distPath) => {
    return app.gulp.src(app.path.srcFolder + srcPath)
        .pipe(app.gulp.dest(app.path.buildFolder + distPath))
}

export { copy }