const fs = require("fs");
const copy = require("rollup-plugin-copy");
const zip = require("rollup-plugin-zip");

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: "src/popup.js",
  output: {
    dir: "dist",
    entryFileNames: "[name].js",
    format: "esm",
  },
  plugins: [
    copy({
      targets: [{ src: "public/**", dest: "dist/" }],
    }),
    zip({
      dir: "./",
    }),
  ],
};
