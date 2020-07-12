---
title: Vue不是内部或外部命令，也不是可执行的程序或批处理文件
tags: [Vue, Bug]
categories: Vue相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
banner_img: /blog/img/banner/b048.jpg
date: 2018-09-09 21:30:00
---

# vue 不是内部或外部命令，也不是可执行的程序或批处理文件

平常我们搭个脚手架，可能分分钟就完事了，但是容易忽略一些细节，比如搭脚手架时 cmd 查 vue 版本号报`vue不是内部或外部命令，也不是可执行的程序或批处理文件`这种错误，明明 vue 下载了，脚手架下载完了怎么也初始化不了，你遇到过吗？

如果你确实已经在全局状态下安装了 vue 和 vue-cli，cmd`vue -V`或`vue init`还是报这个错，嗯，有必要往下看看！

解决办法：

配置 vue 的环境变量

- 搜索 vue.cmd 文件，复制该文件地址，待用
- 注：如果搜索不到，请再下载一遍 vue。。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/000.png)

- windows 下进入`控制面板\系统和安全\系统`点击更改设置

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/001.png)

- 点击高级--环境变量

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/002.png)

- 新建一个系统变量

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/003.png)

- 输入变量名为 Path，变量值为刚复制的 vue.cmd 文件路径

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/004.png)

- 保存重新运行 cmd 输入`vue -V`即可

完美结束！！！
