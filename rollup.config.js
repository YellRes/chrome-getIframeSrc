import fs from "fs";
import copy from "rollup-plugin-copy";
import zip from "rollup-plugin-zip";
import clear from "rollup-plugin-clear";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import html from "@rollup/plugin-html";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import jsx from "acorn-jsx";
// import dev from "rollup-plugin-dev";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { generateHtmlPlugin } from "./plugin/html.js";
import tailwindcss from "tailwindcss";

// const { makeHtmlAttributes } = html;
// const { getBabelOutputPlugin } = babel;
// TODO: antd 打包出来过大 有2MB 能否优化
// TODO: options.html 每次要手动刷新才能加载页面 能否自动刷新

/** @type {import('rollup').RollupOptions} */
export default {
  input: [
    "src/popup/popup.tsx",
    "src/content/content.js",
    "src/options/options.tsx",
  ],
  acornInjectPlugins: [jsx()],
  // content.js 里面不能使用es模块 iife
  output: {
    dir: "dist",
    entryFileNames: "[name].js",
    format: "es",
    // 手动拆包 react react-dom
    manualChunks: {
      react: ["react"],
      "react-dom": ["react-dom"],
      antd: ["antd"],
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
      plugins: [],
    }),
    html({ ...generateHtmlPlugin("popup"), title: "allIframe" }),
    html({ ...generateHtmlPlugin("options"), title: "allIframe配置页面" }),
    // 替换掉react源码中的 process.env
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    copy({
      targets: [{ src: "public/**", dest: "dist/" }],
    }),
    // TODO: 能否提取出js中的css内容
    postcss({
      extract: "bundle.css",
      // inject: true,
      plugins: [tailwindcss],
    }),
    // serve({
    //   contentBase: "dist",
    //   host: "localhost",
    // }),
    // // Q: 插入的文件 在chrome 报错
    // livereload({
    //   watch: "dist",
    //   port: "",
    //   // host: "localhost",
    //   clientUrl: "http://localhost:35729/livereload.js?snipver=1",
    // }),
    // dev(),
    // zip({
    //   dir: "./",
    // }),
    clear({
      targets: ["./dist"],
      watch: true,
    }),
    process.env.NODE_ENV === "production" ? terser() : "",
  ],
  onwarn(warning, warn) {
    if (
      warning.code === "MODULE_LEVEL_DIRECTIVE" ||
      warning.message.includes(`'use client'`)
    ) {
      return;
    }
    warn(warning);
  },
  // external: ["react"],
};
