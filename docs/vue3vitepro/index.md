# 这是一份保姆级Vue3+Vite实战教程

## 起因

首发掘金签约签约专栏，由于不能和之前的专栏重复，外加最近又有很多小伙伴问我 `Vue3` 在实战中的注意事项和技巧，我想了想，决定写一个 `Vue3` 实战专栏，我理解的项目实战，就是大家在看到这篇文章的时候，我刚创建好项目，然后目前码字的我就是在一边写项目一边写文章。

在刚刚开始接触前端的时候就一直想写一个工具大全的网站，一直没闲下来写，正好凑着这个机会搞一下，那这个过程中可以随时会遇到一些问题，我们就以项目开发中最平常的角度去解决这些问题，一个项目从想法到落地，从产生问题再到解决问题，这一切会有太多的不可预知，也正贴合我们实际工作中开发项目。

## 介绍

那我们来介绍下要做的这个项目。

日常工作生活中，总会用到一些小工具，每次想要使用一些工具时，标准流程是百度、谷歌搜索 `免费XXX网站` ，然后在搜索列表中一个一个的点击查看是否免费，遇到好用的可能会收藏一下网站，但是下次再使用此类工具的时候，大家什么样子我不知道，但是我自己通常不会去收藏夹找这个工具网站，而是接着百度、谷歌开启循环，随之而来的就是收藏的工具网站越来越多，五花八门。

那都已经做这么久程序员了，为什么不自己开发一个工具类的聚合网站呢？需求自己决定，想用啥写啥，于是，这个我自己都不知道要未来都会写些什么的工具聚合网站就成了这个专栏的实战项目。

那我们会做一些什么工具呢？

如上所说，我自己都不知道这个项目要未来都会写些什么工具，当然我们还是有些目标的，因为有很多常用工具，像图片处理中压缩、格式转换、合成、裁切、水印、隐式水印？像文件处理中格式转换、预览、编辑？像颜色处理中格式转换、对比色、互补色、中差色、临近色生成？像编码转换、加密解密、正则可视化、在线 `Markdown`？甚至你看完这篇文章在评论区留言我想要一个 `XXX` 工具，然后我看到了，可能就将是下一篇要写的。你也可以自己写工具 `PR` 到项目，采用的话我也会参考实现去出文章教程。

那我们可以在这个项目中学到什么呢？

首先，很多同学还没用过 `Vue3` 以及 `Vite`，这部分同学可以学习一下 `Vue3` 生态在实战中一些使用。

其次，已经在使用 `Vue3` 的同学，也可以学习一下 `Vue3` 生态在实战中的一些技巧。

当然，之后我们写各种各样的工具，一定会触及到很多知识点，你以为写个颜色工具只会讲代码怎么实现？不，预想中应该是要把 `RGB`、`HEX`、`RGBA`、`HSL`、`HSLA`、`HSV`、`HSB`、`对比色`、`互补色`、`中差色`、`临近色`等等等等这些色彩相关理论说一下的，直接卷到设计岗，从此和 `UI` 小姐姐们说话挺直腰板，告别程序员审美。你以为写个正则可视化只是简单写个工具？不，预想中写工具只是幌子，应该是一片大家其乐融融一块学正则的画面，边学边用可 `Copy` 的正则可视化工具才是我们的目标。

既然是工具网站为了方便使用我们肯定是要写浏览器插件的，后续也能学到一个基础的浏览器插件开发的过程。

## 最后

最后，希望我不会太监（断更），那这么随意的项目做下去很大可能是一块见证代码屎山的形成，但这重要吗？不重要，重要的是能从中汲取经验、思路和开发技巧。