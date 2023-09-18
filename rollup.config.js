const fs = require("fs");
const copy = require("rollup-plugin-copy");
const zip = require("rollup-plugin-zip");
const clear = require("rollup-plugin-clear");
const terser = require("@rollup/plugin-terser");
const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const html = require("@rollup/plugin-html");
const replace = require("@rollup/plugin-replace");
const postcss = require("rollup-plugin-postcss");
const { generateHtmlPlugin } = require("./plugin/html.ts");

const jsx = require("acorn-jsx");
const { makeHtmlAttributes } = html;

const { getBabelOutputPlugin } = babel;

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: ["src/popup/popup.tsx", "src/content/content.js"],
  acornInjectPlugins: [jsx()],
  output: {
    dir: "dist",
    entryFileNames: "[name].js",
    format: "es",
    plugins: [
      // getBabelOutputPlugin({
      //   presets: ["@babel/preset-env"],
      // }),
    ],
    // 手动拆包 react react-dom
    manualChunks: {
      react: ["react"],
      "react-dom": ["react-dom"],
    },
  },
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
    babel({
      presets: ["@babel/preset-react"],
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts", ".tsx"],
    }),
    generateHtmlPlugin("popup"),
    generateHtmlPlugin("options"),
    // 替换掉react源码中的 process.env
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    copy({
      targets: [{ src: "public/**", dest: "dist/" }],
    }),
    // TODO: 能否提取出js中的css内容
    postcss({
      // extract: true,
      // inject: true,
      plugins: [require("tailwindcss")],
    }),
    // zip({
    //   dir: "./",
    // }),
    // clear({
    //   targets: ["./dist"],
    //   watch: true,
    // }),
    process.env.NODE_ENV === "production" ? terser() : "",
  ],
  // external: ["react"],
};
