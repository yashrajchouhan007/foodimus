const mix = require("laravel-mix");
const path = require("path");
require("laravel-mix-bundle-analyzer");
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix
  .options({
    legacyNodePolyfills: false,
  })
  .ts("resources/js/app.js", "public/js")
  .sourceMaps()
  //    .extract()
  .react()
  .postCss("resources/css/app.css", "public/css", [
    require("postcss-import"),
    require("autoprefixer"),
  ])
  .webpackConfig(require("./webpack.config"));
//.browserSync({
//    proxy: "localhost",
//});
if (mix.inProduction()) {
  mix.version();
} else {
  //mix.bundleAnalyzer({
  //    analyzerMode: "static",
  //});
}
