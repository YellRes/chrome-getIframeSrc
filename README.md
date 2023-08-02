# chrome-getInfameSrc
谷歌插件来获取页面中所有iframe的src，插件使用原生的html,js开发，基于rollup打包。


> [chrome插件的基础知识](https://juejin.cn/post/7021072232461893639#heading-10)
## 开发步骤

### 1. 创建项目

创建一个 chrome-getInfameSrc 目录
```bash
mkdir chrome-getInfameSrc
cd chrome-getInfameSrc && npm init -y
```

### 2. 安装依赖

```bash
npm i rollup -D
npm i rollup-plugin-copy -D
npm i rollup-plugin-zip -D
npm i rimraf -D
npm i @rollup/plugin-html -D
```

### 3. 创建文件
本插件只会用到`popup`，`content-script`属性，我们来创建下对应的文件。
在当前目录下创建`src`文件夹，在`src`文件夹下创建`popup.js`、`content.js`文件
```javascript
// popup.js
console.log('this is popup')

// content.js
console.log('this is content')
```
> `popup.js`和`content.js`将会是`rollup`打包的入口文件

在根目录中创建public目录，里面新建`manifest.json`和`popup.html`文件。
> 这两个文件在rollup打包过程中会被直接复制到打包后的`dist`目录中

```json
// manifest.json
{
  "name": "all-iframe-src",
  "description": "get iframe src in special page",
  "version": "0.1",
  "manifest_version": 3,

  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*", "<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

```html
<!-- popup.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <h5>当前页面中的iframe</h5>
    <button id="refreshDom">刷新</button>

    <div id="container"></div>
    <script src="./popup.js" type="module"></script>
</body>
</html>

<style>
    body{
        width: 300px;
        height: 400px;
    }
</style>
```



### 4. 配置rollup
在当前目录下创建`rollup.config.js`文件
```javascript
// rollup.config.js
const fs = require("fs");
const copy = require("rollup-plugin-copy");
const zip = require("rollup-plugin-zip");

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
  ],
};
```
rollup配置文件很简单，这其中我们有两个插件，第一个是拷贝`public`目录下的文件到`dist`目录下，第二个是把dist目录打包成zip压缩包。








