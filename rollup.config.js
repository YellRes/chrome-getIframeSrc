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
    html({
      fileName: "popup.html",
      template: ({ attributes, files, publicPath, title }) => {
        let scripts = [
          ...(files.js || []).filter((item) => item.name === "popup"),
        ];
        scripts = scripts
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            return `<script src="${publicPath}${fileName}"${attrs}></script>`;
          })
          .join("\n");
        return `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>${title}</title>
          </head>
          <body>
            <div id="app"></div>
            ${scripts}
          </body>
        </html>`;
      },
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
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
    // terser(),
  ],
  // external: ["react"],
};
