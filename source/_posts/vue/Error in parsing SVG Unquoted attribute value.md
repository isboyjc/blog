---
title: Vue中npm run build报“Error in parsing SVG Unquoted attribute value”
tags: [Vue, Bug]
categories: Vue相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
banner_img: /blog/img/banner/b045.jpg
date: 2018-09-11 21:30:00
---

# Vue 中 npm run build 报“Error in parsing SVG: Unquoted attribute value”

自己做的一个 Vue 项目，在打包时老是报这个错误

```js
# Error in parsing SVG: Unquoted attribute value
```

查了查网上说的，都说报错原因是压缩和抽离 CSS 的插件中只允许 SVG 使用双引号

就是项目中外部引入的 CSS 文件里的 SVG 只能是双引号

我找了好久，这可把我坑坏了。。。

想想那段时间真是难受。。。

后来找到了，分享一下，让大家快点脱坑。。。

首先，如果你项目中使用了 mui 的话应该在这里改

找到 mui 文件下的 iconfont.css 文件

```js
# mui/css/iconfont.css
```

![001](https://gitee.com/IsboyJC/PictureBed/raw/master/other/one.png)

不要以为完了，还有

找到 mui 文件下的 mui.css 文件

```js
# mui/css/mui.css
```

![002](https://gitee.com/IsboyJC/PictureBed/raw/master/other/two.png)

以上两个文件修改了再次 build

如果还报 SVG 的错误，请查看你所有引入的外部 CSS 文件吧

如果你确定你引入的 CSS 文件中确实没有 SVG 或者是 SVG 确实是双引号，那就没办法了老兄。。。

最后：喜欢前端，欢迎探讨！！！
