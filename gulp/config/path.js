import * as nodePath from "path"
const rootFolder = nodePath.basename(nodePath.resolve())

const buildFolder = "./dist" // создается автоматически, в процессе работы gulp
const srcFolder = "./src"

const path = {
    build: {
        files: `${buildFolder}/files/`,
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        css_libs: `${buildFolder}/css/libs`,
        js: `${buildFolder}/js/`,
        js_libs: `${buildFolder}/js/libs/`,
        fonts: `${buildFolder}/fonts/`,
        images: `${buildFolder}/images/`,
        json: `${buildFolder}/json/`
    },
    src: {
        files: `${srcFolder}/files/**/*.*`,
        html: `${srcFolder}/*.html`,
        pug: `${srcFolder}/pug/*.pug`,
        njk: `${srcFolder}/nunjucks/*.njk`,
        scss: `${srcFolder}/scss/*.scss`,
        css_libs: `${srcFolder}/scss/libs/*.css`,
        js: `${srcFolder}/js/app.js`,
        js_libs: `${srcFolder}/js/libs/*.js`,
        fonts: `${srcFolder}/fonts`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/images/**/*.svg`,
        json: `${srcFolder}/json/*`
    },
    watch: {
        files: `${srcFolder}/files/**/*.*`,
        html: `${srcFolder}/**/*.html`,
        pug: `${srcFolder}/pug/**/*.pug`,
        njk: `${srcFolder}/nunjucks/**/*.njk`,
        scss: `${srcFolder}/scss/**/*.scss`,
        js: `${srcFolder}/js/**/*.js`,
        images: `${srcFolder}/images/**/*.{jpg,jpeg,png,gif,svg,ico,webp}`
    },
    clean: buildFolder,
    buildFolder: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ""
}

export { path }