---
title: 被摒弃的jQuery
tags: [jQuery]
categories: Web相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/jq01.png
banner_img: https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/banner/b039.jpg
date: 2018-09-26 19:40:00
---

# 被摒弃的 jQuery

## 前言

---

今年 IT 界发生了很多大事，无意间看到`jQ`的信息后，我决定码了这篇文章

首先回顾一下今年的大事(-\_-)

十岁的 GitHub 作为全球最大开源代码托管网站，可谓是全球程序员的一片圣地，但是，今年 6 月，微软以 75 亿美元（折合人民币 480 亿 ）的价格收购了 Github

根据 cnBeta 新闻，在 GitHub 新闻发布之后，GitLab 收到了超过 14300 个独立访问者，这些开发者在 GitLab.com 上开设了超过 10 万个新的存储库

很多人因为 GitHub 被微软收购从而转去 GitLab，但是大家都没有想过 GitHub 的这种状况和 Google 投资了竞争对手的 GitLab 没有关系吗

想着也真是搞笑！

全球最大的闭源软件公司微软(Mircosoft)对于全球最大的开源软件社区 GitHub 的贡献最多

手握最大开源数据库 MySQL 和开源编程语言 Java 的 Oracle 是开源死敌

时代性的开源编程语言 Java 的老大 Oracle 在向非付费用户开枪了

全球最大源代码托管网站 Github 也被微软帝国收购

Google 也投资了 GitLab

开源缔造了 IT 时代，如果开源被把控。。。

目前，GitHub 一切正常，不知未来如何。。。

---

喷了一下(~ \_ ~)，以上不是本文主体，进入正题，在微软收购 GitHub 后，表示不打算在 GitHub 上做太多改变，且以开发者为中心的初心不会改变，会积极地拥抱开源 ，52 天后，也就是 7 月份，Github 做出一些微软特色的改变，这之中最重要的是 GitHub 网站**重构过程中放弃了 jQuery**，没有再次使用其他任何框架去代替它，而是使用了原生的 JS ，本文是我个人针对此事的看法:

## jQuery 简介

jQuery 诞生于 2006 年 8 月，作者 John Resig ，jQuery 倡导写更少的代码，做更多的事情。它封装了 JavaScript 常用的功能代码，提供一种简便的 JavaScript 设计模式，优化 HTML 文档操作、事件处理、动画设计和 Ajax 交互

jQuery 凭借着 跨浏览器、 简单高效 、稳定可靠 、 插件丰富 这些特性迅速风靡全球

jQuery 使得操作 DOM、定义动画和实现“AJAX”请求，变得十分简单。简单来说，它使得 Web 开发者可以创建更现代、更动态的效果 ，最重要的是，通过 jQuery 在一种浏览器上实现的功能，基本上也能在其他浏览器上运行

时至今日，jQuery 仍然在支撑着数以千万计各种规模网站的运作

但是 jQuery 为什么会被摒弃呢？综合网上以及我自己的看法我认为有以下几点：

## 摒弃原因

- 原生 Js 的发展，使得原生 API 足够的强大
- jQuery 中的经典`$(selector)` 可以简单地用`querySelectorAll()`替换
- CSS 类名切换，可以通过`Element.classList`实现
- CSS 现在支持在样式表中定义视觉动画，无需使用 JavaScript
- \$.ajax 请求可以用 Fetch 标准实现（在不支持的浏览器上可以使用 XHR）
- `addEventListener()`接口已经十分稳定，足以跨平台使用
- jQuery 提供的一些语法糖，已随着 JavaScript 语言的发展，而变得多余
- 链式语法并不能满足我们直观地书写代码的需要
- 自定义元素技术让用户无需下载、解析或编译任何框架
- 原生作为标准，更方便以后维持代码的灵活性
- jQuery 大量 DOM 操作虽然方便，但是会牺牲很多页面的性能
- 浏览器兼容问题越来越少 ，如今浏览器 API 及其 polyfill 已经有足够标准化的 Web 应用程序开发
- React、Vue 和 Angularjs 等主流前端框架并不依赖 jQuery，都可以独立使用
- 以 DOM 为中心的开发模式过于传统 ，目前复杂页面开发流行的是以数据/状态为中心的开发模式
- 前端服务化的趋势，**同构**渲染的问题，也是一个要移除 jQuery 的迫切原因

同构

同构指前后端运行同一份代码，后端也可以渲染出页面。React 等流行框架天然支持，已经具有可行性。把现有应用改成同构时，因为代码要运行在服务端，但服务端没有 DOM，所以引用 jQuery 就会报错，在很多场合也要避免直接操作 DOM。

## 个人感言

曾经辉煌的 jQuery 终于走到了可以华丽谢幕的时刻，当然，John Resig 是一个伟大的开发者，jQuery 也是一个伟大的工具，`一个伟大的工具是指，它解决的问题不再存在，那么可以功成身退了`，这句话我觉得非常好，jQuery 引领了一个前端时代，这是不可否认的

作为一个前端原生爱好者，个人觉得，随着时代的变迁、技术的进步，jQuery 赖以存在的环境正逐渐消失。jQuery 提供了非常易用的 DOM 操作 API，屏蔽了浏览器差异，虽然极大地提高了开发效率，但这也导致很多前端只懂 jQuery ，而忽略了 js，特别是对于那些对前端深感兴趣的初学者，很多都把重心放在了 jQuery 之类的库上，偏离了本质，等回过头来再研究 js 时，费时不说，还会很不习惯，甚至很难转变，长此以往，不利于 js 语言的蓬勃发展，在我心中，js 和 css 是真正的前端核心，这两样技术，js 主导着核心编程，css 引导我们探索与创造，对我来说，这两样水都很深，很难吃透，在工作中考虑开发效率的话，三大框架精一足以，简洁方便，一些简单的操作，原生即可

> 本文参考
>
> [使用了 23 年的 Java 不再免费！](https://blog.csdn.net/csdnnews/article/details/83189938)
>
> [收购 GitHub 滔天争议后，微软回应一切](https://mp.weixin.qq.com/s?__biz=MjM5MjAwODM4MA==&mid=2650698992&idx=1&sn=76bd487d3f044851aaa8da9fc914351d&chksm=bea6052389d18c3523e8024545a81d673c3220c2f21b16f80581fe5bea1d9c44afc849cf8b03&scene=21#wechat_redirect)
>
> [GitHub 改版并放弃了 jQuery](http://mp.weixin.qq.com/s?__biz=MjM5MjAwODM4MA==&mid=2650701571&idx=1&sn=61b9cf057317fe00b7bcab4a5a00f034&chksm=bea60ed089d187c67557636b61b73f877ddcce5cf4c946cdf7f27278e8dc3c4b60221c67145c&scene=21#wechat_redirect)
>
> [从 GitHub.com 前端删除 jQuery--英文原文](https://githubengineering.com/removing-jquery-from-github-frontend/)
