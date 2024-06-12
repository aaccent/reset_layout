const server = () => {
    app.plugins.browserSync.init({
        server: {
            baseDir: `${app.path.build.html}`,
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
        notify: false,
        port: 3000,
        ui: { port: 3001 },
        browser: 'chrome'
    })
}

export { server }