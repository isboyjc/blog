---
title: Vue打包后index.html中无引号
tags: [Vue, Bug]
categories: Vue相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
date: 2018-08-26 21:20:00
---


嗯，历经了千山万水，踩过了无数个坑，终于打包成功了

点击`index.html`，报错了，打开代码一看，`index.html`中路径都不带引号，如下。。。

`<link href=/static/css/app.262f48fe370f0ecbe3bd043450d7d62e.css rel=stylesheet>`

手动加吧，可行，但是一次又一次打包都手动有点浪费时间

嗯，聪明人有办法

找打包配置吧，在`build`目录下有一个`webpack.prod.conf.js`文件

这个文件中搜索`minify`，这个对象是压缩配置

在这个对象中有一个叫`removeAttributeQuotes`的属性，就是删除属性引用的意思

它的值默认为`true`，那就直接把他改成`false`就好了

现在可以再次`build`一下试试看了

如果`index.html`中还是没有引号，就把`minify`对象都注释再`build`

完美解决，perfect！！！
