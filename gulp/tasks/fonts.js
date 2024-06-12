import fonter from "gulp-fonter"
import ttf2woff2 from "gulp-ttf2woff2"
// import fontfacegen from "gulp-fontfacegen"

const fonts = () => {
    return app.gulp.src(`${app.path.src.fonts}/*.*`)
            .pipe(fonter({
                formats: ['woff']
            }))
            .pipe(app.gulp.dest(app.path.build.fonts))
            .pipe(app.gulp.src(`${app.path.src.fonts}/*.ttf`))
            .pipe(ttf2woff2())
            .pipe(app.gulp.dest(app.path.build.fonts))
            // .pipe(fontfacegen({
            //         filepath: "./dist/css",
            //         filename: "fonts.css"
            // }))
}

export { fonts }

// import fs from "fs"
// import fonter from "gulp-fonter"
// import ttf2woff2 from "gulp-ttf2woff2"

// const convertFonts = () => {
//     return app.gulp.src(`${app.path.src.fonts}/*.*`)
//             .pipe(fonter({
//                 formats: ['woff']
//             }))
//             .pipe(app.gulp.dest(app.path.build.fonts))
//             .pipe(app.gulp.src(`${app.path.src.fonts}/*.ttf`))
//             .pipe(ttf2woff2())
//             .pipe(app.gulp.dest(app.path.build.fonts))
// }

// const insertFonts = () => {
//     let fontsFile = `${app.path.srcFolder}/scss/base/_fonts.scss`
//     fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
//         if (fontsFiles) {
//             if (!fs.existsSync(fontsFile)) {
//                 fs.writeFile(fontsFile, "", () => {})
//                 var newFileOnly, fontFileName, fontName, fontWeight, fontWeightValue;
//                 for (var i = 0; i < fontsFiles.length; i++) {
//                     fontFileName = fontsFiles[i].split(".")[0];
//                     if (newFileOnly !== fontFileName && fontFileName !== "icons") {
//                         fontName = fontFileName.split("-")[0]
//                         fontWeight = fontFileName.split("-")[1]
//                         console.log(fontName, fontWeight)
//                         switch (fontWeight.toLowerCase()) {
//                             case "thin":
//                                 fontWeightValue = 100
//                                 break;
//                             case "extralight":
//                                 fontWeightValue = 200
//                                 break;
//                             case "light":
//                                 fontWeightValue = 300
//                                 break;
//                             case "regular": 
//                                 fontWeightValue = 400
//                                 break
//                             case "medium":
//                                 fontWeightValue = 500
//                                 break;
//                             case "semibold":
//                                 fontWeightValue = 600
//                                 break;
//                             case "bold": 
//                                 fontWeightValue = 700
//                                 break;
//                             case "extrabold", "heavy":
//                                 fontWeightValue = 800
//                                 break;
//                             case "black": 
//                                 fontWeightValue = 900
//                                 break;
//                             default:
//                                 fontWeightValue = 400
//                                 break;
//                         }
//                         fs.appendFile(fontsFile, `@include font-face("${fontName}", "${fontFileName}", ${fontWeightValue});\r\n`, () => {
//                             console.log("Added new font: " + fontName)
//                         })
//                         newFileOnly = fontFileName
//                     }
//                 }
//             } else {
//                 console.log("File scss/base/_fonts is exist. Remove to update it")
//             }
//         }
//     })
//     return app.gulp.src(`${app.path.srcFolder}`)
// }

// export { convertFonts, insertFonts }

// mixins 
// @mixin font-face($name, $file, $weight: 400, $style: normal) {
// 	@font-face {
// 		font-family: "#{$name}";
// 		font-display: swap;
// 		font-weight: $weight;
// 		font-style: $style;
// 		src: local("#{$file}"),	url("../fonts/#{$file}.woff2") format("woff2"),	url("../fonts/#{$file}.woff") format("woff");
// 	}
// }