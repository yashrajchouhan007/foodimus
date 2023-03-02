const path = require("path");
const webpack = require("webpack");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve("resources/js"),
      "@img": path.resolve("resources/images"),
      ziggy: path.resolve("vendor/tightenco/ziggy/dist"),
    },
  },
};
