---
title: Vue打包后静态资源路径错误
tags: [Vue, Bug]
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
banner_img: /blog/img/banner/b047.jpg
date: 2018-09-01 21:20:00
---

# Vue 打包后静态资源路径错误

vue 项目打包完了，dist 文件也生成了，运行一下，又报错了

错误还不少，报了好多资源路径找不到的错误，大概有两种

- 一种是 js 或 css 文件引入路径错误，找不到文件
- 一种是 css 中的图片路径错误，找不到图片

#############################################

- js 或 css 文件引入路径错误解决办法如下：

不知道大家发现没有，所有的路径错误都是少了个点，例如：

`src=/static/js/app.5d7099352641a1a9dd32.js`

知道原因了就找解决办法，手动加也行，不过为了每次打包完即用

在配置文件里改，一劳永逸

找到`config/index.js` 配置文件，找`build`打包对象里的`assetsPublicPath`属性

默认值为`/`，更改为`./`就好了

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/20190401001.png)

- css 中的图片路径错误，找不到图片解决如下

在 css 里引入图片路径打包的时候路径会错

打开`build/utils.js`文件，把打包 css 文件的配置加一个打包路径即可

加一行代码，如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/20190401002.png)
