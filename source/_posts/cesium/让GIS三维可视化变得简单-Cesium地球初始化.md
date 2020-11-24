---
title: 让GIS三维可视化变得简单-Cesium地球初始化
tags: [Cesium, 数据可视化, WebGIS]
categories: Cesium系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200715235121472.png
banner_img: https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/banner/b021.jpg
date: 2020-08-31 14:00:00
---

# 让GIS三维可视化变得简单-Cesium地球初始化

## 前言

开发中我们通常会需要一个干净的三维地球实例，本文将介绍 `Cesium` 如何初始化一个地球，包括地图控件的显示隐藏以及一些常用影像和标注的加载

[预览Demo](https://isboyjc.top/cesiumdemo/cesium-init/index.html) 

Cesium 是一款面向三维地球和地图的，世界级的 `JavaScript` 开源产品，它提供了基于 `JavaScript` 语言的开发包，方便用户快速搭建一款零插件的虚拟地球 Web 应用，并在性能，精度，渲染质量以及多平台，易用性上都有高质量的保证

想了解更多 Cesium 的介绍请看 👉 [让GIS三维可视化变得简单-初识Cesium](https://juejin.im/post/6854573221191090189) 



## 环境搭建

本文及后续文章启动环境皆是基于 `Vue-CLI3.X+` 

使用我自己写的 `CLI` 插件 `vue-cli-plugin-cesium` 零配置搭建 `Cesium` 环境

具体环境搭建可看 👉 [让GIS三维可视化变得简单-Vue项目中集成Cesium](https://juejin.im/post/6854899697661394951) 



## 地球初始化

### 申请Token

在正式开发之前，我们首先需要去注册一个免费的 `Cesium ion` 账户

步骤如下

首先，打开 https://cesium.com/ion/ 然后注册一个新的账户

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200901115736912.jpeg)

注册成功后登录，点击 `Access Token`，跳转到 ***Access Tokens page*** 页面

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/Xnip2020-09-01_11-59-41.jpeg)

如上所示，选择 ***Default*** 默认的 `access token` 拷贝到内容中

```js
Cesium.Ion.defaultAccessToken = '<YOUR ACCESS TOKEN HERE>'
```

当然，如果你只是写写demo，那不写 `Token` 也行



### 默认初始化

环境准备就绪之后，我们就可以初始化Cesium实例了，也就是加载地球

```vue
<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
var viewer = null
export default {
  name: "No01Init",
  data() {
    return {}
  },
  mounted() {
    Cesium.Ion.defaultAccessToken = '<YOUR ACCESS TOKEN HERE>'
    // viewer = new Cesium.CesiumWidget('cesiumContainer')
    viewer = new Cesium.Viewer("cesiumContainer")

    console.log(viewer)
  },
}
</script>
<style scoped>
.map-box {
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>

```

如上所示，我们可以使用 `new Cesium.CesiumWidget` 或者 `new Cesium.Viewer` 的方式进行初始化，都可以，给一个容器挂载即可，运行项目后效果如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200827232433642.jpeg)

可能细心的小伙伴注意到了我们初始化的 `viewer` 实例并没有写在 `data` 里，这是因为Vue中会为 `data` 中的属性做数据劫持，如果属性是一个对象，将会递归进行数据劫持，`viewer` 这个实例中的属性数量非常多，如果将它放置 `data` 中。。。只有一个下场，浏览器崩溃

我们可以在组件上放直接声明一个 `viewer` 变量，也可以使用 `window.viewer` 把 `viewer` 挂载到 `window` 上面，都可以避免这个问题

在 `Vue + Cesium` 开发中和实例有关的数据都不要放在data中，这点一定需要注意



### 控件隐藏

上面我们可以看到，在默认初始化里，页面上有很多控件，开发时我们基本用不到，但是还是先来介绍下这些控件的作用

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200830164028938.jpeg)

在创建 `Cesium` 实例时，`new Cesium.Viewer` 构造函数有两个参数

- 实例挂载的元素 必选项
- options 初始化配置对象 可选项

在 `options` 对象中，我们可以配置初始化的一些控件显示隐藏以及一些渲染配置，这里列举出一些常用的配置

```js
viewer = new Cesium.Viewer("cesiumContainer", {
  animation: false, // 隐藏动画控件
  baseLayerPicker: false, // 隐藏图层选择控件
  fullscreenButton: false, // 隐藏全屏按钮
  vrButton: false, // 隐藏VR按钮，默认false
  geocoder: false, // 隐藏地名查找控件
  homeButton: false, // 隐藏Home按钮
  infoBox: false, // 隐藏点击要素之后显示的信息窗口
  sceneModePicker: false, // 隐藏场景模式选择控件
  selectionIndicator: true, // 显示实体对象选择框，默认true
  timeline: false, // 隐藏时间线控件
  navigationHelpButton: false, // 隐藏帮助按钮
  scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
  shouldAnimate: true, // 开启动画自动播放
  sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
  requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
  // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
  maximumRenderTimeChange: Infinity
})
```

我们使用上面 `options` 配置，即可把页面上的控件全部隐藏掉，如下图所示

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/48991-Xnip2020-08-30_18-33-57.jpg)

可以看到，虽然控件已经没有了，但是屏幕下方还有 `Cesium` 的 `logo` 信息，我们需要让它也不显示

```js
// 隐藏下方Cesium logo
viewer.cesiumWidget.creditContainer.style.display = "none"
```

如上所示，只需再来一行额外的配置隐藏 `logo` 信息，即可获得一个干净的地球实例，最终效果图如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/Xnip2020-08-30_18-40-24.jpeg)



### 加载影像

`Cesium` 支持多种服务来源的高精度影像（地图）数据的加载和渲染，图层支持排序和透明混合，每个图层的亮度（brightness），对比度（ contrast），灰度（gamma），色调（hue），饱和度（saturation）都是可以动态修改的

这里我们忽略细节，先简单介绍下影像相关的几个类，然后直接写代码去添加一些不同的常用影像图层

**PS：Cesium是一个构造函数，在这个构造函数上又有无数个静态属性，它们也是不同作用的构造函数，按照OOP的方式理解，Cesium是一个父类，而它又有很多子类用来做不同的事情** 



#### Cesium.ImageryProvider类

说到影像这块儿，首先，我们要了解一下 `imageryProvider` 这个类，`Imagery` 可以翻译为图像、影像，这里就统一称之为影像

`ImageryProvider` 类及其子类封装了加载各种影像图层的方法，其中 `Cesium.ImageryProvider` 类是抽象类、基类或者可将其理解为接口，它不能被直接实例化

可以将 `ImageryProvider` 看作是影像图层的数据源，我们想使用哪种影像图层数据或服务就用对应的 `ImageryProvider` 类型去加载即可

`ImageryProvider` 类包含的类型

- ArcGisMapServerImageryProvider
  - ArcGIS Online和Server的相关服务
- BinaMapsImageryProvider
  - Bing地图影像，可以指定mapStyle，详见BingMapsStyle类
- GoogleEarthEnterpriselmageryProvider
  - 企业级服务
- GridImageryProvider
  - 渲染每一个瓦片内部的格网，了解每个瓦片的精细度
- IonImageryProvider
  - Cesium ion REST API提供的影像服务
- MapboxImageryProvider
  - Mapbox影像服务，根据 mapId 指定地图风格
- MapboxStyleImageryProvider
  - Mapbox影像服务，根据 styleId 指定地图风格
- createOpenStreetMapImageryProvider
  - OpenStreetMap提供的影像服务
- SingleTilelmageryProvider
  - 单张图片的影像服务，适合离线数据或对影像数据要求并不高的场景下
- TileCoordinatesImageryProvider
  - 渲染每一个瓦片的围，方便调试
- TileMapServicelmageryProvider
  - 根据MapTiler规范，可自己下载瓦片，发布服务，类似ArcGIS影像服务的过程
- UrlTemplateImageryProvider
  - 指定url的format模版，方便用户实现自己的Provider，比如国内的高德，腾讯等影像服务，url都是一个固定的规范，都可以通过该Provider轻松实现。而OSM也是通过该类实现的
- WebMapServiceImageryProvider
  - 符合WMS规范的影像服务都可以通过该类封装，指定具体参数实现
- WebMapTileServicelmageryProvider
  - 服务WMTS1.0.0规范的影像服务，都可以通过该类实现，比如国内的天地图



#### Cesium.ImageryLayer类

要知道，一份 `GIS` 数据会被组织成图层符号化并渲染，数据相当于内在血液、内脏，信息量丰富，而图层相当于外在皮毛、衣服，用于呈现给外界

`Cesium` 同样将数据源组织成图层符号化并渲染，`Cesium.ImageryLayer` 类就用于表示 `Cesium` 中的影像图层，它就相当于皮毛、衣服，将数据源包裹，它需要数据源为其提供内在丰富的地理空间信息和属性信息



#### Cesium.ImageryLayerCollection类

`Cesium.ImageryLayerCollection` 类是 `ImageryLayer` 实例的容器，它可以装载、放置多个 `ImageryLayer` 实例，而且它内部放置的 `ImageryLayer` 实例是有序的

`Cesium.Viewer` 类对象中包含的 `imageryLayers` 属性就是 `ImageryLayerCollection` 类的实例，它包含了当前 `Cesium` 应用程序所有的 `ImageryLayer` 类对象，即当前地球上加载的所有影像图层

知道了影像图层基础的体系结构，那么影像加载就简单了，上面我们也可以看到 `ImageryProvider` 类种类非常多，列举出来是为了给大家展示下它可以加载什么影像，但是一一演示不现实，所以接下来我们就来看几个常见影像加载



#### 加载影像示例

##### 加载天地图影像

按照上述所说，首先我们要加载影像图层的数据源，Cesium地球默认加载的是 `bing` 地图影像，所以我们要先从容器中删除这个默认影像

```js
viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
```

然后，我们加载影像图层的数据源

```js
let tianditu = new Cesium.WebMapTileServiceImageryProvider({
  url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
  layer: "tdtBasicLayer",
  style: "default",
  format: "image/jpeg",
  tileMatrixSetID: "GoogleMapsCompatible",
  show: false,
})
```

`url` 字段中的 `tk` 为天地图服务token，去天地图官网注册申请一个即可

随后，我们将数据源添加至 `ImageryLayer` 类容器进行符号化并渲染即可

将数据源添加至 `ImageryLayer` 类容器进行符号化并渲染有两种方法，第一种是在初始化 `viewer` 实例时的 `options` 配置中，你可以直接在 `options` 对象的 `imageryProvider` 属性中放置数据源即可

```js
new Cesium.Viewer("cesiumContainer",{
  imageryProvider: tianditu
})
```

第二种方法，使用 `viewer` 实例中 `imageryLayers` 属性的 `addImageryProvider` 方法来添加即可

```js
let imagery = viewer.imageryLayers.addImageryProvider(tianditu)
```

天地图影像预览如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/tianditu.jpeg)



##### 加载谷歌影像

上面步骤已经知悉，我们就不一一叙说了，下面直接看代码就好

```js
viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
let imagery = viewer.imageryLayers.addImageryProvider(
  new Cesium.UrlTemplateImageryProvider({
    url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
    baseLayerPicker : false
  })
)
```

谷歌影像预览如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/guge.jpeg)



##### 加载ArcGIS影像

```js
viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
let imagery = viewer.imageryLayers.addImageryProvider(
  new Cesium.ArcGisMapServerImageryProvider({
    url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
    baseLayerPicker : false
  })
)
```

ArcGIS影像预览如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/arcgis.jpeg)



##### 加载高德影像

```js
viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
let imagery = viewer.imageryLayers.addImageryProvider(
  new Cesium.UrlTemplateImageryProvider({
    maximumLevel:18,//最大缩放级别
    url : 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    style: "default",
    format: "image/png",
    tileMatrixSetID: "GoogleMapsCompatible"
  })
)
```

高德影像预览如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/gaode.jpeg)



##### 加载天地图标注

上述影像的加载，可以看到，地图上是没有标注的，我们需要额外加载标柱，同样的，它也是图层

```js
let label = viewer.imageryLayers.addImageryProvider(
  new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg"+"&tk="+"19b72f6cde5c8b49cf21ea2bb4c5b21e",
    layer: "tdtAnnoLayer",
    style: "default",
    maximumLevel: 18, //天地图的最大缩放级别
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false,
  })
)
```

同样的，和天地图影像一样，不要忘了替换 `tk` 哦

天地图标注预览如下

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/tianditubiaozhu.jpeg)



##### 影像亮度调整

我们加载影像拿到影像实例 `imagery` 后，可以通过其 `brightness` 属性调节亮度，取值 `0～1` ，默认为1

```js
imagery.brightness = 0.9
```



#### 影像小结

上文中我们列举的 `ImageryProvider` 类支持的子类非常多，而上面的示例中

在加载高德影像服务时，我们使用的指定 `url` 的 `format` 模版来实现自己的 `Provider`，所以使用了 `UrlTemplateImageryProvider` 类来加载数据源

在加载 `ArcGIS` 影像用到了 `ArcGIS Server` 的相关服务所以使用了 `ArcGisMapServerImageryProvider` 类来加载数据源

在加载标柱影像时，因为我们加载的是一个Web Map Tile Service也就是 `WMTS` 服务，所以我们使用的是 `WebMapTileServiceImageryProvider` 类

这几个简单的小例子是为了告诉我们我们使用什么样的数据源，就使用对应的 `ImageryProvider` 来加载即可

影像加载这块由于本文重点描述的是初始化，所以只有怎样加载，并没有对应的数据服务相关知识，Get一个新的技能，首先是用起来，下一个阶段是扣一些细节然后用熟它，再接着是扩展，最后是学其原理，后续通过一些使用再来慢慢扩展概念性的东西



## 最后

回顾本文，Cesium实例初始化，围绕着加载一个干净的三维地球实例展开，文中我们主要介绍了 Cesium 控件的现实隐藏以及影像的加载，一般来说为了界面美化，我们都是自己写控件或者直接隐藏掉，当然如果 Cesium 的初始化控件中恰巧有你需要的，但是又觉得默认的空间样式不太好看，其实我们是可以自己改样式的，因为控件只是普通元素节点，完全可以直接在控制台中选中元素，通过类名来修改对应控件的样式来达到自己想要的效果，相信这对于一个前端来说不是什么难事

到此其实就只做了加载出来地球和加载下影像，对于 Cesium 来说它仅仅一个开始，更多好玩的还在后面，其实不止是做Cesium开发的人群，做前端的同学学一学这些还是有些用处的，可以为你的页面或项目增色不少，后续内容请看暂定目录

- [让GIS三维可视化变得简单-初识Cesium](https://juejin.im/post/6854573221191090189) 

- [让GIS三维可视化变得简单-Vue项目中集成Cesium](https://juejin.im/post/6854899697661394951) 

- [让GIS三维可视化变得简单-Cesium地球初始化]() 
- 暂定 - 让GIS三维可视化变得简单-Cesium坐标转换
- 暂定 - 让GIS三维可视化变得简单-Cesium球体自转

- 暂定 - 让GIS三维可视化变得简单-Cesium实体Entity及事件

- 暂定 - 让GIS三维可视化变得简单-Cesium模型数据之3DTiles
- 暂定 - 让GIS三维可视化变得简单-Cesium模型数据之gltf
- 暂定 - 让GIS三维可视化变得简单-Cesium模型数据之geojson
- 暂定 - 让GIS三维可视化变得简单-Cesium模型数据之czml
- 暂定 - 让GIS三维可视化变得简单-Cesium流动线绘制
- 暂定 - 让GIS三维可视化变得简单-Cesium气泡弹窗
- 暂定 - 让GIS三维可视化变得简单-Cesium粒子系统(火灾、雪花、喷水)
- 暂定 - 让GIS三维可视化变得简单-Cesium鹰眼图
- 暂定 - 让GIS三维可视化变得简单-Cesium结合Echarts

Cesium国内教程很少，文档也是英文的，不太好入手，所以此系列只是简单入门以及一些效果制作（说白了就是介绍一些简单使用和一些好玩的例子），每一篇介绍一个点，挺难涉及到Cesium核心原理，因为我也在学习中，看后期个人学习情况，我是觉得什么好玩就想学。。。

没有专业的 GIS 基础知识积累真的好难，此系列不定期更新，暂时先排这么多，不定期插入，不定期更新，敬请期待



## 结束

原创不易，看完点赞、养成习惯，此文收录在 GitHub，更多精彩请看 👉 [isboyjc/blog/issues](https://github.com/isboyjc/blog/issues) 

如有错误请指出，互相学习，先行谢过，一个前端的 `Cesium` 学习过程的积累分享，自知深度不够，不喜勿喷