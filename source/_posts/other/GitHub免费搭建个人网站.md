---
title: GitHub 免费搭建个人网站
tags: [GitHub, 建站]
categories: Web相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/github01.jpg
banner_img: /blog/img/banner/b042.jpg
date: 2018-09-06 23:30:00
---

# GitHub 免费搭建个人网站

学习前端的人应该知道，开始学习前端时，心里想的肯定是我一定要给自己做一个的非常棒的网站，学完之后网站做好了，但是要怎么上线呢？？？

作为一个前端，拥有有自己的个人网站，算是迈出了前端道路的第一步！

#### 本文目的

通过**GitHub Pages**免费快速的搭建个人网站，文章随长，其实非常简单，写的详细是为了能够让多数人都能够看得懂

#### 目录

#### 建站常识

首先了解常识，建站三部曲：

- 网站项目
- 服务器
- 域名

简单来说，就是我们要有一个域名，然后绑定服务器，再把网站上传到服务器上，这样就可以通过域名访问我们的网站了

**网站项目**就是你写的网站文件，这个如果不会的话请去学习前端 [w3school 传送门](http://www.w3school.com.cn/)

**服务器**就是网络中为用户提供服务的专用设备。分为访问、文件、数据库、通信等不同功能的服务器。那么要怎样拥有一个服务器呢，(用钱就好了！！！)，正规途径是在网上买一个服务器，看图

![图1](https://gitee.com/IsboyJC/PictureBed/raw/master/other//fuwuqi1.png)

刚开始玩的话买一个空间小的相对便宜的就行，当然有钱请随意！！！

**域名**就是访问网站的网址，怎样获取域名，没错还是用钱，看图

![图2](https://gitee.com/IsboyJC/PictureBed/raw/master/other//yuming1.png)

我的域名是在阿里云注册的，域名也是有区别的，后缀不一，长短不一，相对价钱就不一，如我的域名：

[isboyjc.top](https://isboyjc.top)

欢迎访问啊！不要问为什么是`.top`的后缀，因为`.top`的域名最贵了，我最有钱，我最任性

域名注册好之后首先要进行实名认证，然后域名解析、绑定服务器，最后把网站上传服务器，进行网站备案，静候备案成功就可以了（**注**：国内服务器需要备案，国外或香港服务器不用备案，但是相比国内服务器访问速度慢点，因为距离远嘛！）

这是一个网站上线的基本流程，当然以上不是本文重点，这些只是一些必备的常识，重点在下面

#### GitHub Pages 建站

什么是 GitHub Pages？

我就不照抄官方文档了，想了解请走传送门

[GitHub Pages 传送门](https://pages.github.com/)

官方文档比较高大上，简单来说 GitHub Pages 就是一个服务器，但它是免费的！免费的！免费的！重要的事说三遍！它能提供给我们 1G 空间的存储，让你放东西，然后还可以请求到

当然 GitHub Pages 还有一些其他的东西，不过我们的宗旨是建站，其他不用了解

**重点来了：**

登录[GitHub.com](https://github.com)官网(全英的界面，英语不好的朋友请用谷歌翻译！)

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//github.PNG)

登录后点击右上角的加号，进入`new repository`选项新建一个储存库,看到以下界面

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//ku.PNG)

首先输入库名，仓库名字为固定格式

```
你的GitHub名.github.io

// 例：
// 我的GitHub名字为 isboyjc，所以库名为 isboyjc.github.io
```

中间还有个储存库说明，可以不写，储存库说明下有一个自动为你选上的`Public`选项，意思是公开此储存库（就是别人可以看到并下载你库中的内容，当然可以不公开，但是要收费 7 美金/月，这个完全没有必要，因为 IT 的精华就是开源！当然土豪请随意！）

最后点击绿色按钮提交创建，提交后如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//create.PNG)

点击`README`进行初始化 README ，就是用`markdown`语法编写此储存库的具体说明或者说简单的展示，`markdown`语法十分简单，我也写了相应的`markdown`语法教程[markdown 和 Typora--传送门](#)，有兴趣可以了解一下，当然这里不写也是可以的，直接点击下面绿色按钮提交即可

![](../img/anniu.PNG)

再然后是如下界面：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//end.PNG)

上面图片红色框中依次翻译为：创建新文件、上传文件、查找文件、克隆或下载

点击`Upload files`上传文件

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//endd.PNG)

点击`choose your files`选择文件上传，最后绿色按钮提交(**注：**上传的文件为你的网站文件，默认访问`index.html`文件所以你的网站首页一定要是`index.html`，css、js、img 文件同 html 文件一同拖拽进去即可，网速慢的话上传速度较慢请耐心等待，上传失败请重新上传)

这时神奇的一幕就来了，如果你的操作没错，这时你就可以在浏览器输入`你的GitHub名.github.io`访问你的网站了（**注：**如果你的储存库下没有`index.html文件`，访问时会自动显示你的`README.md`文档）！！！如下：

[https://isboyjc.github.io](https://isboyjc.github.io)

这个名字有点长，我想通过自己购买的域名访问怎么办呢？

接着往下看

#### GitHub Pages 域名绑定

首先是域名解析

进入你的域名控制台，我的域名是阿里云注册的，所以本文以阿里云为例，如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//con1.PNG)

点击解析进入解析添加解析，如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//jiexi.PNG)

**记录类型**

记录类型我们选择`CNAME`，别名记录，就是把一个域名完完全全设置为另外一个域名的别名

**主机记录**

主机记录就是域名前缀，常见用法有：

```
www：解析后的域名为www.aliyun.com

@：直接解析主域名 aliyun.com

*：泛解析，匹配其他所有域名 *.aliyun.com

mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器

二级域名：如：abc.aliyun.com，填写abc

手机网站：如：m.aliyun.com，填写m

显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）
```

举个例纸，我购买的域名是`isboyjc.top`我添加了两个域名解析，一个主机记录是`@`，一个主机记录是`www`，意思是让我的网站能够分别通过`isboyjc.top`和`www.isboyjc.top`访问到

**解析路线**

```
如果只有一个IP地址或CNAME域名，请务必选择【默认】

默认：必填！未匹配到智能解析线路时，返回【默认】线路设置结果

境外：向除中国大陆以外的其他国家和地区，返回设置的记录值

搜索引擎：向搜索引擎爬虫的DNS，返回设置的记录值
```

**记录值**

因为我们使用的是`GitHub Pages`服务器，所以记录值填写为之前的仓库名`你的GitHub名字.github.io`，如果是你自己购买的服务器，解析时记录值应该填写为你的服务器主机地址

**TTL**

TTL 指的是域名解析的生命周期，简单来说它表示 DNS 服务器解析域名时记录在 DNS 服务器上的缓存时间

什么意思呢，来点题外话，先说下网站的访问流程，你的网站文件存储在数据服务器上，它会有一个 IP 地址，就像门牌号一样，我们在输入域名访问网站时，数据服务器是不认识你这个域名的，它只认识 IP，你的域名会通过 DNS 服务器解析成 IP 值，通过这个门牌号(IP 值)向数据服务器查找你的网站数据并给你返回到浏览器上

访问网站时，不会每次都到 DNS 服务器域名解析，而是第一次访问时才到 DNS 服务器进行解析，然后解析的结果会缓存到当地的递归 DNS 服务器(缓存服务器)上，当地的第二个用户访问网站时，递归服务器会直接返回解析结果，而不会再向 DNS 服务器请求解析，那多久之后递归服务器才会更新这个解析结果呢？这就是 TTL 来决定的

如果增大 TTL 值，可以节约域名解析时间，给网站访问加速 ，TTL 值大多都是以秒为单位的，很多的默认值都是 3600，也就是默认缓存 1 小时，这个值有点小了，难道会有人一个小时就改一次域名记录吗

如果减小 TTL 值，可以减少更换空间时的不可访问时间 ，如果 TTL 值大了，更换新的域名记录时因为 TTL 缓存的问题，结果可能是有的人可能访问到了新服务器，有的人访问走缓存会访问到了旧的服务器

那么 TTL 值多少才好呢？

总的来说，你要访问速度，TTL 值就大一点，如果你近期想更换服务器或 IP，为了更换后能尽量解析到新的 IP 上，TTL 值就小一点，说的有点多了，好了，跳过这个话题，回到主题，本文介绍的是个人建站，一般个人网站建议设置 TTL 值为 600，也就是 10 分钟是刚好的！

上面的东西弄完之后只剩最后一步啦！！！

**在 GitHub 仓库页添加 CNAME 文件**

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other//cname.PNG)

还是上传文件的这个页面，点击`Create new file`创建一个新文件，文件名为`CNAME`，注意是大写，文件内容写你解析的域名，例：

```
isboyjc.top
```

如果你还解析了`www`的域名,那么你就在文件中写两个域名，例：

```
isboyjc.top
www.isboyjc.top
```

然后点击提交

最后，在浏览器上输入你的域名访问一下吧！！！

累死我了，终于写完了！！！
