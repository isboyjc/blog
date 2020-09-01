---
title: 让GIS三维可视化变得简单-初识Cesium
tags: [Cesium, 数据可视化,WebGIS]
categories: Cesium系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200715235121472.png
banner_img: /blog/img/banner/b024.jpg
date: 2020-07-27 01:15:00
---

# 让GIS三维可视化变得简单-初识Cesium

## 前言

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200715235121472.png)

从去年开始无脑接触 `Cesium` 三维 GIS 可视化，入坑之后一直到到现在，其实已经写了多个项目了，中间也遇到了很多坑点，很早就想分享其中所获了，只是觉得不太专业而且没有太多时间，拖到现在，从开始接触 `Cesium` ，加了一个QQ交流群，从刚开始的 200 人，到现在的 3000 人，好像使用 Cesium 做可视化方向的人越来越多了，并且其中很多人都是如我一样，从前端半路入坑

记得好像是公众号「Cesium中文网」曾发过一篇文章名叫「Cesium只剩可视化了吗」个人觉得写的很棒，虽然 Cesium 不止是可以做可视化这么简单，但是目前大部分选择投入其中的人是奔着可视化这个方向的，这点从 300 到 3000 足以证明

个人写作习惯篇幅很长，文章产出总是很慢，之所以还想要写这个系列的文章，大概有三点

- Cesium 毕竟是一个世界级 `JavaScript` 开源产品，做 CS 还好，但是做 BS，特别是可视化产品是需要扎实的前端基础的，相比较下专业的 GIS 对前端一些框架了解好像不太多，并不能很好的把自己丰富的 GIS 知识或者说一些很强大的功能在前端炫酷的展现出来，毕竟功能再强大，不经过雕琢和装饰总归还是不能被人推崇的
- 近两年前端同学半路入坑 Cesium 的人太多了，但是由于没有扎实的 GIS 基础，涉及深入一点的 GIS 核心的效果实现并不容易，一路上的磕磕绊绊实在是太多了，这个是亲身经历，且十分惨痛
- 关于 Cesium，一直是自己在摸索，项目也写不少了，但是肯定有很多地方在更为专业的人看来是闹着玩一样，所以水水文章看看进自己脑子的知识有哪些是炸弹，回顾一遍排排雷，查漏补缺

其实我个人对 CS 方面完全没有经验，BS 做可视化有些项目经验，但是说实话，只懂皮毛，不过在前进的道路上爬了太多的坑，所以可以与大家分享些爬坑经验，也充实下自己，涉入 GIS 不会很深，不过一般的还是可以的，算带大家入入门吧，也希望可以和大家一起查漏补缺，正所谓山中无老虎，猴子称大王，没错，我就是那只猴子，谁让现在Cesium相关的技术帖辣么少呢

写的帖子目前想法是除了入门之外会更倾向于各种好玩炫酷的效果制作，所以它也会更倾向于实战系列，你也可以把它当作入门级教程，这个系列我尽量每文简短些，控制在5000字以内，让大家看着舒服 😄

**PS：** 

- **CS** 指 `Client/Server`，客户端/服务器模式，桌面级应用，响应速度快，安全性强，个性化能力强，响应数据较快，兼容性差，不跨平台，开发成本高

- **BS** 指 `Browser/Server`，浏览器/服务器模式，Web应用，可以实现跨平台，客户端零维护，共享性强，但是个性化能力稍低，响应速度稍慢





## 得瑟一下

看到这篇文章时，可能大家对 Cesium 有所了解，也可能一无所知，甚至不知道它能干什么，先给大家看一个我这边刚入坑时做的第一个基于 Cesium 的可视化产品，现在看其实挺一般的，不过当时刚做出来时确实是挺开心挺有成就感的，也让大家对 Cesium 加深下了解，当然这个项目中只是简单的运用了 Cesium，它远不止于此

- [线上预览](http://villageapi.sdzhujialin.com/zjl_3d/index.html)  电脑配置低的话还是查看GIF吧

- [GIF预览](https://gitee.com/IsboyJC/PictureBed/raw/master/other/20190929_175200.2020-07-2723_56_55.gif)    压缩的比较厉害，高清预览视频可以到公众号「不正经的前端」查看

那么接下来话不多说，赶紧来认识下 Cesium 吧



## Cesium简介

### 什么是Cesium

Cesium 是一款面向三维地球和地图的，世界级的 `JavaScript` 开源产品，它提供了基于 `JavaScript` 语言的开发包，方便用户快速搭建一款零插件的虚拟地球 Web 应用，并在性能，精度，渲染质量以及多平台，易用性上都有高质量的保证

Cesium是基于 `Apache2.0` 许可的开源程序，它可以免费的用于商业和非商业用途，它隶属于 AGI（Analytical Graphics Incorporation）公司，三位创始人曾在通用公司宇航部的供职工程师，提供 STK（System/Satellite Toolkit Kit）和 Cesium两款产品，该公司是航天分析软件的领导者，而 STK 则是该公司的旗舰产品，比如 `马航MH370` 搜救过程就采用了 STK 软件，经过多年来在时空数据的积累，AGI 公司逐渐掌握了大量 3D 可视化技术，也感受到各行各业对海量 3D 数据的强烈需求，因此于2011年创建了 CesiumJS 开源项目，围绕 Cesium 生态圈打造了一套安全可靠易扩展且平台独立的企业级解决方案

而 Chrome 也是在2011年2月份推出了支持 WebGL 的第一个版本，在这点上，Cesium算是第一个敢吃螃蟹的人，Cesium 原意是化学元素铯，铯是制造原子钟的关键元素，通过命名强调了 Cesium 产品专注于基于时空数据的实时可视化应用

至今，CesiumJS 的下载量超过 `1,000,000`，是一个为数百万用户提供了强大的应用程序

作为前端程序员，只是单纯做可视化，其实在我看来， Cesium 与 `Leaflet` 以及 `OpenLayer` 等没有本质的区别，只是Cesium支持三维场景等等，做的更漂亮



### Cesium可以做什么

支持全球级别的高精度的地形和影像服务

支持 `2D、2.5D、3D` 形式的地图展示，真正的二三维一体化

支持矢量、海量模型数据（倾斜，BIM，点云等）

支持基于时间轴的动态数据可视化展示



### Cesium的浏览器兼容性

学习和使用 Cesium 前，首先要检查一下你的浏览器是否支持 `WebGL`，目前，大多数平台和浏览器都支持WebGL，在这些环境下运行 Cesium 并没有太大的问题，但效果和性能是否能够满足不同的需求，就需要考虑很多细节和额外因素

大多数平台和浏览器都支持 `WebGL1.0` 标准，也就是 `OpenGL ES2.0` 规范，2017年年初，`Chrome` 新版本低调的支持 `WebGL2.0`，随着各硬件厂商 GPU 性能的提升和 `WebGL2.0` 规范的成熟，`WebGL` 技术会有更大的提升潜力，不过无论是 PC 还是移动端，`Chrome` 都是 `WebGL` 开发和应用的最佳平台，所以，如果没有特殊的硬性要求，建议大家使用 `Chrome` 学习和开发 Cesium

你可以在浏览器中访问 [WebGL Report](https://webglreport.com/) 来查看你的浏览器支持情况

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200715000329348.png)



如上图红框中显示，这个浏览器支持 `WebGL 1`，你也可以点击 `WebGL 2` 查看自己的浏览器支持情况

清单中除了显示了你的浏览器是否支持 `WebGL` 标准，还有很多，比如

- 是否支持深度纹理
- 顶点着色器的最大属性数
- 是否支持ANGLE 扩展
- 等等



## 一个HelloWorld程序

其实上面的都是废话，但是你又必须要知道，其实对我们写程序是没有一点帮助的，只是提供数据为了给大家了解下 Cesium 的强大

有的人可能认为学习 Cesium 之前应该学习学习 GIS 基础架构、坐标系、投影、存储类型等等等等，其实我觉得如果你有这些常识，那自然是极好的，但是如果没这些知识储备，在刚开始学习 Cesium 的时候，学习这些乱七八糟的，完全没必要

因为这些基础知识学起来很容易打磨积极性，还不如先写几个 demo 程序来的实在，毕竟总得先体会下它的魅力，就像你走在路上，你看到前面有个坑，那肯定会绕过去，但是如果坑上有些草，还有些漂亮的花，那就不一样了

SO，我们先搞个地球出来，后面哪里有需要再穿插说一些常识



### 编译器选择

实力推荐 `VS Code` 一把梭，当然实在用不习惯其他编译器也都行，看个人习惯，实力强用记事本都没得关系



### 下载Cesium包

首先，我们要下载 Cesium 包，官网下载即可，Cesium 每个月都会更新一个版本，一直在迭代，这点就足以证明它的活跃性以及未来，地址如下 👇

- [Cesium Download](https://cesium.com/cesiumjs/)

下载下来解压后你会发现有很多文件，如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200723003350308.png)



我们下载这个包里包括 Cesium API 源代码 Source 文件夹，以及编译后的 Build 文件夹，还有Demo、API文档、沙盒等等，这些都不用管

我们只需要 `Build` 文件夹下面的 `Cesium` 这个文件夹，它是编译后 Cesium 包的正式版本，开发的话只需要这个就完了



### 初始化地球

首先，我们找地方新建一个目录，这里目录名为 `demo` ，我们把上面说的 Cesium 这个文件夹拖进来

接着，我们在 demo 目录下新建一个 `index.html` 文件，初始化一个地球，只需四步

**No.1** 引入 `cesium.js`，该文件定义了 Cesium 对象，它包含了我们需要的一切

```html
<script src="./Cesium/Cesium.js"></script>
```

**No.2** 引入 `widgets.css`，为了能使用Cesium 各个可视化控件 

```css
@import url(./Cesium/Widgets/widgets.css)
```

**No.3** 在 `HTML` 的 `body` 中我们创建一个 `div`，用来作为三维地球的容器

```html
<div id="cesiumContainer"></div>
```

**No.4** 在 JS 中初始化 `CesiumViewer` 实例

```js
let viewer = new Cesium.Viewer('cesiumContainer')
```

完整代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./Cesium/Cesium.js"></script>
    <style>
      @import url(./Cesium/Widgets/widgets.css);
      html,body,#cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
      window.onload = function () {
        let viewer = new Cesium.Viewer("cesiumContainer")
      }
    </script>
  </body>
</html>

```





### 运行环境

平常我们写一个页面，浏览器打开 `html` 文件即可，在写 Cesium 程序的时候，不要本地双击浏览器运行，因为在实际工作中，它是需要运行在Web服务器上的

这里我们使用Node来搭建这个服务，首先你要在电脑装Node，这个不过多赘述，不了解自行百度安装即可

官网包括一般的教程里这个时候就要手写代码用 `express` 或者 `Koa` 简单的搭一个Web服务了，但是这也是没有必要的，这里我们只是写个 demo，没必要再去写后端代码什么的，太麻烦，我们装一个 `live-server` 就行了

`live-server` 是一个具有实时加载功能的小型服务器，简单说，你装了它，直接在当前目录命令行运行命令这个服务就起来了

安装 `live-server` 命令如下

```js
npm install -g live-server
```

再次强调，这只是一个小 demo，一般来说正常项目开发中 `Vue+Cesium` 我觉得是最佳实践了，而使用 Vue 来开发的话  `Vue-CLI` 本身就是一个本地服务，我们如果要原生开发的话 `live-server` 就行了，虽然写个Web服务不难，但终归是浪费时间

当我们 Node 安装好了，也装上了 `live-server` 后，我们在终端  `cd` 到项目根目录下 ，执行下面命令

```js
live-server
```

默认启动的是8080端口，如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200723230404008.png)

紧接着，直接在浏览器输入 `http://127.0.0.1:8080` ，你的第一个 Cesium 程序就 👌 了

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/2020-07-27-cesiuminit-gif.gif)

如上所示，页面上就会呈现一个 3D 的地球了，是不是很简单，有没有勾起你入手的欲望呢？

这次就到这里，下次我们来说一说 Vue 里面使用 Cesium 开发以及一些注意事项，一步一步来，心急吃不了热豆腐，每篇文末会给大家列出我一些相关的学习地址



## 最后

初识 Cesium 一定要知道的几个网站

- [Cesium 官方教程](https://cesium.com/docs/) Cesium出的官方教程，英文的，可以翻译着看看

- [Cesium API英文官方文档](https://cesium.com/docs/cesiumjs-ref-doc/)  Cesium的API太多了，不过有遇到不知道API可以查一查，不过也是英文的
- [Cesium API中文文档](http://cesium.xin/cesium/cn/Documentation1.62/) Cesium中文网翻译的API文档，不太全，不过初步肯定是够用的

- [Cesium Sandcastle 沙盒示例](https://sandcastle.cesium.com/) Cesium官方的一些示例程序，没事可以多逛逛
- [Cesium 中文网](http://cesium.xin/) Cesium中文网，里面有系列教程，部分是免费的，可以学习很多知识

如果是刚接触Cesium，这些网站无论如何都要点进去看一看，先简单过一遍即可，后期会用上的

文章收录在 GitHub，更多精彩请看 [isboyjc/blog/issues](https://github.com/isboyjc/blog/issues) 

是前端，又不只是前端，所以不正经，认真分享干货，公众号「不正经的前端」，欢迎关注