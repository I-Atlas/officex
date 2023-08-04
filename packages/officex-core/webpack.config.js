const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    puppeteer: {
      commonjs: "puppeteer",
      commonjs2: "puppeteer",
      amd: "puppeteer",
    },
    jsdom: {
      commonjs: "jsdom",
      commonjs2: "jsdom",
      amd: "jsdom",
    },
  },
  resolve: {
    modules: ["node_modules"],
    symlinks: false,
    extensions: [".ts", ".js", ".json"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "@officex/core",
    libraryTarget: "umd",
  },
};
