---
title: GIT常用命令
tags: [Git]
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/github03.jpeg
banner_img: /blog/img/banner/b044.jpg
date: 2019-04-12 21:30:00
---

# GIT 常用命令

### SSH 公钥

##### 查看本机 ssh 公钥

```js
1. 打开git bash窗口

2. 进入.ssh目录： cd ~/.ssh

3. 查看.ssh文件下有无id_rsa.pub文件：ls

4. 查看公钥：cat id_rsa.pub  或者  vim id_rsa.pub

上述步骤合为一步: cat ~/.ssh/id_rsa.pub
```

##### 生成本机 ssh 公钥

```js
1. 命令行下输入: ssh-keygen

2. 确认存放公钥的地址，默认就是上面说的路径，直接enter键确认

3. 输入密码和确认密码，如果不想设置密码直接不输入内容 按enter键

4. 重复上面查看公钥步骤
```

##### git 中字母代表

```js
A     	# 增加的文件
C       # 文件的一个新拷贝
D       # 删除的一个文件
M       # 文件的内容或者mode被修改了
R       # 文件名被修改了
T       # 文件类型被修改了
U       # 文件没有被合并(需要完成合并才能进行提交)
X       # 未知状态(git的bug , 可以向git提交bug report)
```

### 签名

##### 查询本机已配置参数

```js
git config --list
```

##### 签名级别

```js
system // 所有用户(本系统)
global // 全局
local // 本地(默认)
```

##### 配置签名--用户名和邮箱

Git 提交前，必须配置签名, 即用户名和邮箱 信息会永久保存到历史记录

```js
项目级别
git config user.name [AAA]
git config user.email [邮箱地址]

系统级别
git config --global user.name "aaa"
git config --global user.email 111@qq.com
```

##### 签名信息位置

```js
cat.git / config
```

### 基础操作

##### 创建目录

```js
mkdir 新目录名     // 创建一个新目录
cd 新目录名        // 进入新目录下
pwd               // 显示当前路径
```

##### 初始化版本库

```js
git init
```

##### 查看.git 文件

```js
ls - ah
```

##### 添加到仓库暂存区

```js
git add a.txt index.html
```

##### 提交到本地仓库

```js
git commit -m "提交说明"
```

##### 查看当前仓库工作区的状态

```js
git status
```

##### 比较修改的差异

```js
git diff
```

##### 查看提交日志

16 进制字符串代表 commit id

```js
git log                                         // 按提交时间列出所有的更新,显示完整信息
git log --pretty=oneline					  // 将每个提交放在一行显示,显示完整commit id
git log --oneline							 // 将每个提交放在一行显示,显示不完整commit id
git reflog (HEAD@{移动到当前版本})      		 // 查看之前版本的log,包括删除的,可查找历史commitID
```

##### 版本回滚

上一版本`HEAD^`，上上一版本`HEAD^^` ，上 100`HEAD~100`

```js
git reset --hard HEAD^
```

##### 撤回回滚

没关闭命令行,a8543 为回退前文件 commitID,只需要前几位就行

```js
git reset --hard a8543
```

### 远程仓库

##### 克隆项目

```js
git clone '仓库地址'
```

##### 关联远程仓库

```js
git remote add '仓库地址'
```

##### 查看关联远程库

```js
git remote -v
```

##### 修改关联远程库

```js
git remote set-url origin '仓库地址'
```

##### 推送远程仓库

```js
git push -u origin master   // 第一次推送
git push origin master      // 再次推送
```
