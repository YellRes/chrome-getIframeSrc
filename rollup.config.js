const fs = require("fs");
const copy = require("rollup-plugin-copy");
const zip = require("rollup-plugin-zip");
const clear = require("rollup-plugin-clear");
const terser = require("@rollup/plugin-terser");

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: ["src/popup.js", "src/content.js"],
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
    clear({
      targets: ["./dist"],
      watch: true,
    }),
    terser(),
  ],
};
