---
title: 「Vue源码系列No.2」调试环境搭建 - U
tags: [Vue, 源码]
categories: Vue源码系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue03.png
banner_img: /blog/img/banner/b031.jpg
date: 2019-11-25 19:00:00
---

# 「Vue 源码系列 No.2」调试环境搭建

### 安装依赖

下载好 Vue 源码后使用`npm install`安装依赖

vue 是基于 rollup 构建的 , 所以如果没有安装 rollup , 要先安装 rollup

npm 安装 rollop : `npm i -g rollup`

**注：**rollup 是一个 Js 模块打包器 , rollup 也可以打包项目, 不过这不是它擅长的, 他不支持热模块替换, 它最擅长的是打包 js , rollup 对于代码的 tree-shaking 和 es6 模块有算法优势的支持, 所以一些类库都在使用它(vue , react 等) , 继 grunt、gulp 实现自动化构建之后，webpack 引领了前端打包潮流，vue-cli 的脚手架就是基于 webpack 进行项目打包的。而 webpack 还在上升的势头的时候，又出了一个打包神器 parcel , 市面上常用的一些打包工具都在这里了, 具体差异 , 自行百度吧

### 调试环境搭建

##### 生成 SourceMap(源码映射)

修改`package.json`中 dev 脚本 , 加上`--sourcemap`

```json
"scripts": {
  "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
  . . .
}
```

此命令用于运行时生成 sourcemap 映射文件 , 方便我们进行调试

运行`npm run dev` , dist 目录下如果生成了`vue.js.map` 就 ok 了

**注 : **如果你是 windows 系统 , 在执行`npm run dev`时可能会报错如下

```js
[!](plugin Rollup Core) Error: Could not load e:/work-isboyjc/isboyjc/vue/src/core/config (imported by e:\work-isboyjc\isboyjc\vue\src\platforms\web\entry-runtime-with-compiler.js): ENOENT: no such file or directory, open 'e:\work-isboyjc\isboyjc\vue\src\core\config'
```

1. 确保你的 vue 源码路径无中文
2. `roullp-plugin-alias` 插件对于 windows 的盘符解析忽略了小写的情况

修改方法 :

找到`node_modules/rollup-plugin-alias/dist/rollup-plugin-alias.js`文件在大概 13 行的位置修改如下

```js
const VOLUME = /^([A-Z]:)/i // 加上i , 忽略大小写
const IS_WINDOWS = os.platform() === "win32"
```

重新运行`npm run dev` , 问题解决!

> 此处参考 : [vue.js 2.0 alpha error on start on windows 10 x64](https://github.com/vuejs/vue/issues/2771#issuecomment-446090852)

##### 创建调试文件

创建调试文件`index.html`如下

```html

```
