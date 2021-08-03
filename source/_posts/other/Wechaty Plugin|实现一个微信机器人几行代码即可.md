---
title: Wechaty Plugin|实现一个微信机器人几行代码即可
tags: [Wechaty, NodeJS, 微信机器人]
categories: Web相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/wechaty.png
date: 2020-07-14 00:30:00
---


## 写在前面

晚到几个月的帖子，这几个月有些忙，没顾上，关于为什么要开发微信机器人、技术选型、Token申请、一期简单的开发可以看我4个月之前在掘金发布的文章

[Wechaty|NodeJS基于iPad协议手撸一个简单的微信机器人助手](https://juejin.im/post/5e5b2aeff265da5710438a1e) 

开发一个微信机器人难吗？真的很简单，看之前那篇文章就知道了，5月30号的「Wechaty Plugin conference」，`wechaty` 正式推出了 `plugin` 系统，`wechaty` 的作者 [Huan (李卓桓)](https://github.com/huan) 以及 `wechaty plugin` 系统的开发者同时也是开源项目 `Wepy` 作者 [Gcaufy](https://github.com/Gcaufy) 的一番演讲挺让人很兴奋的，因为在开发上一版机器人时，虽然简单，但是会感觉有些功能写着不难，就是比较琐碎，并且所有的业务逻辑代码都堆积在一块，很难受

但是 `wechaty plugin` 系统的上线，完美解决了这个问题，一个插件一个功能，基于配置，简洁明了，并且后期`plugin` 生态足够强大了，可以随时随地的为我们的机器人配置各种想要的功能，开发起来也会更加顺滑和简单



## 申请免费Token？

了解 `wechaty` 或者看了之前那篇帖子的朋友可能知道，`wechaty` 使用 `pad` 协议是需要申请 `token` 的，可能有很多人看到需要 `token` 直接就撤了，这没办法，毕竟句子团队的研发也是需要成本的，没有必要吐槽，不过你也可以参与开源激励计划来获取长期 `token`，这个世界上大佬占有量总是少数，可能更多的人看到开源激励计划这几个字就觉得和自己没关系，事实上没有想象的那么难

这么说吧， `wechaty plugin` 推出前，你只需拿着试用的 `token` 开发一个产品（不要会错意，官方也说了是MVP产品，最小可行化产品，按照我的理解来说，最小可行产品就是刚好具备能够帮助你表达产品的核心概念的部分功能的产品，简单来说，你想用它做什么东西，你把这个东西核心功能做出来，并且放到 `github` 中开源即可，没有简单复杂之分，可行的产品就ok，就比如我做的产品核心就是为了管理微信群组和自动加好友，我就简单实现了这样一个东西，仅此而已），开发出产品后把代码开源到 `github` 并且写一篇帖子就行了

那么 `wechaty plugin` 推出后，你只需要开发一个插件就可以了，你可能会说开发一个插件很难吧，其实并不是，插件有很多种类，取决于开发者的奇思妙想，像我这种比较笨的，开发了几个常规插件，自动邀人、入群欢迎、自动踢人、群签到等等，每一个插件最少的可能只需要十几行代码，一般来说，只要有点开发基础就能开发出来，不管插件简单还是并不是太实用，句子团队肯定是来者不拒的，因为这有利于 `wechaty` 生态的发展，毕竟对于一个项目来说，有更多的开发者愿意参与进来，相信对这个项目的发展只会有利无害，对项目的发起团队来说，肯定也是非常值得开心的

可能还会有人怕代码写的烂被人吐槽，我觉得这也没什么，我就不是一个大佬，代码写的也挺烂的，个人觉得对一个程序员来说，脸皮厚很重要，就像写一篇帖子，如果有人吐槽，吐槽的对，我改了就是还能汲取一波知识，吐槽的不对技不如人那就要原谅我直接回怼了，怎么想都是对我百利无一害的，程序员，简简单单，挺好

看到这你可能我像个推销产品的人，当然你怎么想对我来说都只是陌生人的遐想罢了，不痛不痒，站在我的立场上，我只是对微信机器人比较感兴趣，觉得好玩实用，对 `wechaty plugin` 也很关注，奈何目前开发插件的人和插件数量实在不多，所以给大家打一波鸡血，好玩的插件多了，那机器人会越来越好玩

另外，我觉得微信机器人对一些知名博主或者公众号的作者会很有用，毕竟可以有效管理群聊提升群聊的活跃性，当然很多公众号大 V 们都有自己的机器人，也是各种渠道吧，但是能够免费接入的应该不多吧，免费的也会有各种各样的限制，`wechaty` 就不一样了，身为程序员嘛，自己开发适合自己的机器人岂不是更好



## 开发需求

还是来简单介绍下我的需求，我这边因为在做公众号嘛，也有一些微信交流群，有兴趣的朋友也可以关注下「不正经的前端」，有人加交流群什么的这一套流程人为操作真的是很痛苦，我需要一个机器人来自动通过好友，关键字自动邀请入群，便捷的一些群管理以及活跃下群氛围什么的，都是一些很普通的需求

上一版的开发其实已经足够我日常的需求了，不过后期扩展都需要我自己开发，还是比较麻烦的，所以我就把上一版的一些需要用到的功能封装成插件发包了，这样的话使用简单，代码简洁，如果别人有这个模块需求也可以直接安装使用插件，除了使用我自己开发的一些插件外，还使用了几个官方的插件来丰富我的机器人，总之，不算插件配置项的话，整体的代码量也就10来行吧



## 项目介绍

其实没什么好介绍的了，因为改用了插件体制，每个功能都是一个插件，插件即功能，我就直接把用到的所有插件给大家一一介绍下吧，有自己开发的、官方开发的、其他人开发的，也期待可以用到大家开发的插件

当然如果你不想看这些插件介绍，也可以直接点开项目地址，直接看代码，跑一下即可，抛开配置也没几行代码

➡️  [isboyjc/wechaty-plugin-robot  - GitHub传送门](https://github.com/isboyjc/wechaty-plugin-robot) 



### 项目搭建 & 插件使用

#### 初始化项目实例

```js
const { Wechaty } = require("wechaty") // Wechaty核心包
const { PuppetPadplus } = require("wechaty-puppet-padplus") // padplus协议包

// 初始化
const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: PUPPET_PADPLUS_TOKEN, // 你的token
  }),
  name: ROBOT_NAME, // 你的机器人名字
})
```



#### 使用插件并启动

```js
const pluginTest = require("wechaty-plugin-test") // 引入插件

// 使用插件 options为插件配置对象
bot.use(pluginTest(options))

// 启动机器人
bot.start()
```



### wechaty-plugin-contrib

#### 重点介绍

当您发现自己在编写重复的代码时，就应该将其提取到插件中，通过调用 `Wechaty.use(WechatyPlugin())` ，我们可以很好地支持使用插件，微信插件是一个 `JavaScript` 函数，它返回一个接受微信实例的函数，第一个微信插件系统是由核心团队开发人员 `@gcaufy` 设计的，这个包是用来发布核心开发团队常用的微信插件的

上面这段话是官方对这个包的解释，简单来说，这个官方发布的包里有一些好玩的插件供我们大家使用，它是一个插件集合，我们直接安装这个包，就可以使用里面的所有插件，现在里面有十来个插件吧，大家也可以给这个包PR一些插件，但是要求每个功能插件代码量不超过100行代码，超过100行的插件官方是建议自己发包的

如果大家想要了解更多这个插件集合中的插件👇👇👇

[wechaty/wechaty-plugin-contrib - GitHub传送门](https://github.com/wechaty/wechaty-plugin-contrib) 

我使用了其中几个插件，给大家分别阐述下具体功能，当然我们要先安装这个包

```js
npm install wechaty-plugin-contrib

// or

yarn add wechaty-plugin-contrib
```



#### QRCodeTerminal

在机器人登录的时候，终端显示扫描二维码，之前我们需要自己安装 `qrcode-terminal` 插件，然后监听 `scan` 事件，现在使用插件，除了引用依赖，一行代码即可

```js
const { QRCodeTerminal } = require("wechaty-plugin-contrib")

bot.use( QRCodeTerminal({ small: false }))
```

诺，使用之后启动项目的时候就可以在终端打印二维码了，然后我们微信扫码登录即可



#### EventLogger

官方解释是记录 “扫描”|“登录”|“消息”的微信事件…等，其实简单来说就是一个日志输出，登录之后的所有操作会在控制台打印日志，使用也很简单

提供事件日志："dong" | "message" | "error" | "friendship" | "heartbeat" | "login" | "logout" | "ready" | "reset" | "room-invite" | "room-join" | "room-leave" | "room-topic" | "scan"

有一个参数 `options` ，数组类型，可自由选择打印事件日志，我没有填写此参数，默认就打印所有事件

```js
const { EventLogger } = require("wechaty-plugin-contrib")

bot.use(EventLogger())
```



#### RoomConnector

这个插件比较有意思，连接房间，把任何房间的信息广播到所有其他房间，因为微信群的上限是500人，为此可能很多公众号大大会创建多个群聊，但是它们的消息是不互通的，该插件就是为此而生的

它支持三种模式

- OneToManyRoomConnector    可以广播消息在一个房间到其他房间
- ManyToOneRoomConnector    可以将各个房间的信息汇总到一个房间
- ManyToManyRoomConnector  将把任何房间的所有信息广播到所有其他房间

我这里使用了它的 `ManyToManyRoomConnector`  模式，把任何房间的所有信息广播到所有其他房间

具体配置如下，当然，想要了解更多可以点击上文这个插件集合包的 `github` 地址查看官方文档

```js
bot.use(
  ManyToManyRoomConnector({
    // 黑名单
    blacklist: [async () => true],
    // 多个群聊列表
    many: [
      "10614174865@chatroom", // Web圈0x01
      "22825376327@chatroom", // Web圈0x02
      "24661539197@chatroom", // 微信机器人
    ],
    // 遍历并发送出的消息
    map: async (message) => {
      let roomName = await message.room().topic()
      let name = await message.room().alias(message.from())
      name ? null : (name = message.from().name())
      return `来自群聊【${roomName}】的【${name}】说 \n\n ${message.text()}`
    },
    // 白名单
    whitelist: [async (message) => message.type() === bot.Message.Type.Text],
  })
)
```





### wechaty-voteout

**简介** 

这个插件是 `Gcaufy` 开发的，它是一个微信投票插件，可以帮助您有一个投票和踢出功能为您的房间

就是说当你的群聊中有不当的发言者时，发送 `@用户 [关键字或表情]`，就可以发起投票了，可以设置数量，达到一定的数量会被移除群聊



**安装** 

```js
npm install wechaty-voteout --save
```



**使用** 

```js
const VoteOut = require('wechaty-voteout')

bot.use(VoteOut({ /* options */ }))
```

`options` 配置请参考下面示例配置



**示例** 

```js
const options = {
  //您希望机器人与哪个房间一起工作
	//可以是RegExp（用于主题）或函数（过滤室实例）
	//例如 室：函数（室）{room.topic（）。indexOf（'我的'）> -1}
  room: [/Room Topic 1/i, 'room_id@chatroom'],
  // 当达到目标时，就意味着他将被移出
  threshold: 3,
  // 白名单，永远不会被投票移除的人
  // 使用RegEx表示联系人姓名，使用字符串表示联系人ID
  whitelist: [],
  // 不同的木偶得到不同的标志
	// 我们运行更多的案例以查看它是什么符号，并在此处更新注释，就是表情符号
  downEmoji: [
    '[弱]',
    '[ThumbsDown]',
    '<img class="qqemoji qqemoji80" text="[弱]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
  ],
  // 警告模板，设置为falsy以禁用警告消息
  warn: [
    '可能是因为你的聊天内容不当导致被用户投票，当前票数为 {{ downNum }}，当天累计票数达到 {{ threshold }} 时，你将被请出此群。',
  ]
  // 弹出模板，设置为falsy来禁用消息
  kick: '经 {{ voters }} 几人投票，你即将离开此群。',
  repeat: '你已经投票过 {{ votee }} 了，无需再投。',
}

bot.use(VoteOut(options))
```

来看一个运行中的图片

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712204804871.png)



插件其实用法很简单，但是由于不是我开发的，所以大家想查看更多详细介绍请猛戳👇👇👇

[Gcaufy/wechaty-voteout  - GitHub传送门](https://github.com/Gcaufy/wechaty-voteout) 



### wechaty-friend-pass

**简介** 

此插件功能是，自动通过好友请求，或者设置一些关键字，通过好友申请时备注的关键字来校验是否要自动通过该好友申请，并且通过好友申请时自动回复一段话

当时没看到 `wechaty-plugin-contrib` 中有一个 `FriendshipAccepter` ，功能差不多，不过我还是使用了自己开发的， 大家也可以选择性使用



**安装** 

```js
npm install wechaty-friend-pass

// or

yarn add wechaty-friend-pass
```



**使用** 

```js
const WechatyFriendPass = require("wechaty-friend-pass")

bot.use(WechatyFriendPass(options))
```

如上所示，使用插件只要按需传入配置对象 `options` 即可

| Options 参数属性 | 类型          | 简介                                                         |
| ---------------- | ------------- | ------------------------------------------------------------ |
| keyword          | String\|Array | 好友请求时备注自动通过的关键字，只有一个可以使用字符串类型，多个关键字使用数组类型，全部通过不用校验传入字符串 "*" 即可，不传即都不自动通过 |
| blackId          | String\|Array | 用户黑名单 ID，该项可填写用户的 ID 来识别用户，让此用户不被自动通过，也可不填 |
| reply            | String        | 自动通过用户好友申请后自动回复一句话，为空或不填则通过后不回复 |



**示例** 

```js
const options = {
  keyword: ["加群", "前端", "后端", "全栈"],
  blackId: ["*******@id", "*******@id"],
  reply: "你好，我是机器人小助手圈子 \n 加入技术交流群请回复【加群】\n 联系小主请回复【123】",
}

bot.use(WechatyFriendPass(options))
```

使用中如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712200241111.png)



查看更多详细介绍请猛戳 👉 [isboyjc/wechaty-friend-pass - GitHub传送门](https://github.com/isboyjc/wechaty-friend-pass) 



### wechaty-room-invite

**简介** 

向机器人发送某些关键字，机器人会通过这些关键字邀请你进入对应的房间，当然，可以管理多个房间



**安装** 

```js
npm install wechaty-room-invite

// or

yarn add wechaty-room-invite
```



**使用** 

```js
const WechatyRoomInvite = require("wechaty-room-invite")

bot.use(WechatyRoomInvite(options))
```

如上所示，使用插件只要按需传入配置对象 `options` 即可

| Options 参数属性 | 类型          | 简介                                                         |
| ---------------- | ------------- | ------------------------------------------------------------ |
| keyword          | String\|Array | 触发邀请该用户的关键字，只有一个可以使用字符串类型，多个关键字使用数组类型 |
| roomList         | Array         | 机器人管理的群聊列表，该项为必填项，数组对象中具体配置请看下面示例 |
| reply            | String        | roomList 数组长度大于 1 时，视为管理多个群聊，那么 keyword 触发后会回复用户当前管理的群聊列表数据供用户选择进入某一个群，这个群聊数据列表为一段由 roomList 配置生成的话，roomList 数组长度等于 1 时，keyword 触发将会直接拉起群邀请，那么此字段也无用，reply 字段不是必选项，管理多个群聊时，建议直接使用默认文字，默认流程可看最后示例图片 |

我们来看 `roomList` 数组的配置示例

```js
roomList: [
  {
    // 群聊名字，管理多个群聊时用户可通过群聊名字选择某个群聊
    name: "微信机器人",
    // 群聊id
    roomId: "22275855499@chatroom",
    // 群聊别名，建议简短，管理多个群聊时用户可通过别名选择某个群聊，叫它[编号]可能更好
    alias: "A05",
    // 标签，用于在管理多个群聊时给各个群聊做一个简单的标识，方便用户选择
    label: "新群",
    // 是否关闭进入，如果为true，则触发该群时，会提示该群不可进入
    close: true,
  },
  ...
]
```



**示例** 

```js
const options = {
  keyword: ["加群", "入群", "群"],
  roomList: [
    {
      name: "Web圈0x01",
      roomId: "10614174865@chatroom",
      alias: "A01",
      label: "推荐",
    },
    {
      name: "Web圈0x02",
      roomId: "22825376327@chatroom",
      alias: "A02",
      label: "新群",
    },
    {
      name: "微信机器人",
      roomId: "24661539197@chatroom",
      alias: "A04",
      label: "推荐",
    },
    {
      name: "男神开门群",
      roomId: "22275855499@chatroom",
      alias: "A05",
      label: "测试",
      close: true,
    }
  ],
  reply: "",
}

bot.use(WechatyRoomInvite(options))
```

管理多个群聊时，当用户给机器人发送【加群】，机器人默认会回复，当然你也可以自己设置

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712195955225.png)



查看更多详细介绍请猛戳 👉 [isboyjc/wechaty-room-invite - GitHub传送门](https://github.com/isboyjc/wechaty-room-invite) 



### wechaty-room-welcome

**简介** 

这是一个及其简单的插件，就是用于监听群聊中新人员的加入，随后回复一个入群欢迎，可管理多个群聊



**安装** 

```js
npm install wechaty-room-welcome

// or

yarn add wechaty-room-welcome
```



**使用** 

```js
const WechatyRoomWelcome = require("wechaty-room-welcome")

bot.use(WechatyRoomWelcome(options))
```

`options` 参数是一个对象，只有一个属性 `reply` 

| Options 参数属性 | 类型          | 简介                                                         |
| ---------------- | ------------- | ------------------------------------------------------------ |
| reply            | String\|Array | reply参数为字符串时，机器人加入的所有群聊监听到新的加入都将回复此欢迎语，当为数组时，可自由配置管理的每个群聊要回复什么欢迎语，为数组类型的具体配置请看下文示例 |

`reply` 数组格式示例

```js
reply: [
  {
    // 群聊名
    name: "微信机器人",
    // 群聊id
    roomId: "24661539197@chatroom",
    // 入群回复的欢迎词
    reply: `\n 你好，欢迎你的加入，请自觉遵守群规则，文明交流，最后，请向大家介绍你自己！😊`,
  },
	...
]
```



**示例** 

```js
const options = {
  reply: [
    {
      name: "Web圈0x01",
      roomId: "10614174865@chatroom",
      reply: `\n 你好，欢迎你的加入，请自觉遵守群规则，文明交流，最后，请向大家介绍你自己！ 😊`,
    },
    {
      name: "微信机器人",
      roomId: "24661539197@chatroom",
      reply: `\n 你好，欢迎你的加入，请自觉遵守群规则，文明交流，最后，请向大家介绍你自己！😊`,
    },
    {
      name: "男神开门群",
      roomId: "22275855499@chatroom",
      reply: `男神你好，欢迎加入`,
    },
  ],
}

bot.use(WechatyRoomWelcome(options))
```

使用如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712200643675.png)



查看更多详细介绍请猛戳 👉 [isboyjc/wechaty-room-welcome - GitHub传送门](https://github.com/isboyjc/wechaty-room-welcome) 



### wechaty-room-remove

**简介** 

你可以在群聊中@一个违规的人并携带你所设置的关键字，机器人监听到后会帮你快捷的移除他并且给出提示，这比手动删除群聊中某一个人要方便的多



**安装** 

```js
npm install wechaty-room-remove

// or

yarn add wechaty-room-remove
```



**使用** 

```js
const WechatyRoomRemove = require("wechaty-room-remove")

bot.use(WechatyRoomRemove(options))
```

如上所示，使用插件只要按需传入配置对象 `options` 即可

| Options 参数属性  | 类型             | 简介                                                         |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| keyword           | String\|Array    | 触发移除该用户的关键字，只有一个可以使用字符串类型，多个关键字使用数组类型，默认为 ["飞机", "踢"] |
| time              | Number           | 触发移除后的延时/ms，默认3000，即3s                          |
| adminList         | Array            | 可触发命令的管理员列表，一个数组对象，单个数组对象属性请看下面配置示例 |
| replyInfo         | String\|Function | 移除前@提示该用户的一句话，可为字符串类型，也可以是函数类型，函数类型时，有一个参数msg，即当前消息实例，函数最终需返回一个字符串function(msg){return ...}，此项有默认值，请看下文示例 |
| replyDone         | String           | 移除成功提示，字符串类型，默认成功时返回done                 |
| replyNoPermission | String           | 无权限移除成员时机器人的回复，即当一个不在adminList配置中的用户发出命令时回复，默认不做出回复 |

我们来看 `adminList` 数组的配置示例

```js
adminList: [
  {
    // 管理员昵称，用以区分，可选
    name: "isboyjc",
    // 管理员id，必填
    id: "wxid_nrsh4yc8yupm22",
  },
  {
    name: "工具人小杨",
    id: "wxid_vkovzba0b0c212",
  },
  ...
]
```



**示例** 

```js
const options = {
  // 触发关键字数组
  keyword: ["飞机", "踢", "慢走", "不送"],
  // 管理员列表
  adminList: [
    {
      name: "isboyjc",
      id: "wxid_nrsh4yc8yupm22",
    },
    {
      name: "便便",
      id: "wxid_4mnet5yeqo5d21",
    },
    {
      name: "工具人小杨",
      id: "wxid_vkovzba0b0c212",
    }
  ],
  // 延时
  time: 3000,
  // 移除前提示，以下配置是默认配置，这里用来展示函数类型配置
  // 可根据函数回调中msg消息实例参数自由发挥，也可直接填写一段字符串
  replyInfo: function (msg) {
    return `您可能违反了社群规则，并收到举报，${this.time / 1000}s后将您移出群聊，如有问题请联系管理！！！🚀\n\n移除原因：违反社群规则\n操作时间：${dateTimeFormat()}\n操作管理员：${msg.from().name()}\n\nYou may have violated the community rules and received a report. After ${this.time / 1000}S, you will be removed from the group chat. If you have any questions, please contact the management！！！🚀\n\nReason for removal：Violation of community rules\nOperation time：${dateTimeFormat()}\nOperation administrator：${msg.from().name()}`
  },
  // 移除成功后提示
  replyDone: "移除成功",
  // 无权限人员触发命令后回复，可选项，默认不进行回复
  replyNoPermission: "您暂时没有权限哦，联系管理员吧😊",
}

bot.use(WechatyRoomRemove(options))
```

如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712202937488.png)



查看更多详细介绍请猛戳 👉 [isboyjc/wechaty-room-remove  - GitHub传送门](https://github.com/isboyjc/wechaty-room-remove) 



### wechaty-room-clock

**简介** 

在群聊中打卡签到，每次打卡签到后累计打卡签到次数+1，积分+1，每日只可打卡一次，打卡总数/积分总数/打卡日志等等，可以用于积分赠送小礼品提升群活跃度什么的

你可能觉得这些操作需要用到数据库，但是在我的理解中，微信机器人越简单越便捷越好，而微信群聊的数据量不是很大，一个插件的使用，需要额外配置很多东西是很麻烦的，所以，此插件采用了本地存储，用了一个三方轻量化的基于 `Node` 的 `JSON` 文件数据库 `LOWDB`，避免了数据库这一繁琐的配置

插件会自动在项目根目录创建一个 `[机器人名字].clock-logs` 的文件夹，用以存放数据

其中 `clock-logs-[年份].json` 文件存储的是打卡日志，为避免读写操作数据量过大产生的负荷，所以每年会生成对应的 `json` 文件，这样每个群聊上限是 500 人，以5个群聊为基础，一年的打卡数据量也不会太大

其中 `clock-logs-main.json` 文件为主文件，存储的是对应群聊/对应用户的打卡签到数据等等

当然，如果你有更好的想法，请务必告知哦



**安装** 

```js
npm install wechaty-room-clock

// or

yarn add wechaty-room-clock
```



**使用** 

```js
const WechatyRoomClock = require("wechaty-room-clock")

bot.use(WechatyRoomClock(options))
```

如上所示，使用插件只要按需传入配置对象 `options` 即可

| Options 参数属性 | 类型             | 简介                                                         |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| keyword          | String\|Array    | 触发签到的关键字，只有一个可以使用字符串类型，多个关键字使用数组类型，默认为 ["签到", "打卡"] |
| success          | String\|Function | 打卡成功提示该用户的一句话，可为字符串类型，也可以是函数类型，函数类型时，有一个参数data，即当前群成员在本地数据库中的数据对象，函数最终需返回一个字符串function(data){return ...}，此项默认值请看下文示例 |
| repeat           | String\|Function | 重复打卡时提示该用户的一句话，可为字符串类型，也可以是函数类型，函数类型时，有一个参数data，即当前群成员在本地数据库中的数据对象，函数最终需返回一个字符串function(data){return ...}，此项默认值为 “今日已签到，请勿重复签到” |

参数 `success` 和 `repeat` 为函数类型时形参 `data` 示例

```js
{
  // 该用户微信id
  "CONTACTID": "wxid_nrsh4yc8yupm22",
  // 该用户昵称
  "CONTACTNAME": "isboyjc",
  // 该用户打卡总数
  "CLOCKNUM": 170,
  "CLOCKINFO": {
    // 该用户2020年打卡总数
    "2020": 69,
    // 该用户2019年打卡总数
    "2019": 101
  },
  // 该用户积分
  "INTEGRALNUM": 170
}
```



**示例** 

```js
let options = {
  // 此处为默认项配置，也可为一个字符串
  keyword: ["签到", "打卡"],
  // 此处为默认项配置，也可为一个字符串
  success: (data) => {
    let str = "\n签到成功\n"
    Object.keys(data.CLOCKINFO).map(
      (v) => (str += `${v}年累计签到${data.CLOCKINFO[v]}次\n`)
    )
    return str + `共累计签到${data.CLOCKNUM}次\n拥有${data.INTEGRALNUM}积分`
  },
  // 此处为默认项配置，也可为一个字符串
  repeat: (data) => `今日已签到，请勿重复签到`,
}

bot.use(WechatyRoomClock(options))
```

使用如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200712201619049.png)



查看更多详细介绍请猛戳 👉 [isboyjc/wechaty-room-clock  - GitHub传送门](https://github.com/isboyjc/wechaty-room-clock) 



### TODO

看到这其实你可能回发现这个项目功能并不多，是的，所以 `plugin` 生态需要时间来发展，文中后面几个插件是我开发的，都是些简单的小插件，因为我的需求并不复杂，不过还是很希望接下来能自己做或者是说用上点好玩的插件 ，如果你有什么奇思妙想，可以直接在 `wechaty` 官方这个仓库的 `issuse` 中提出 👉  [wechaty/wechaty-plugin-contrib/issues](https://github.com/wechaty/wechaty-plugin-contrib/issues) ，可能会有人帮你写插件来实现哦，当然你也可以在其中寻找插件创意来自己实现

后面想做的几个好玩的小插件，当然只是谋划阶段，因为要上班，业余时间不多

- 黑名单
  - 最近老遇到有些人在群里大量加好友推销课程，所以寻思着做一个黑名单插件，通过记录微信ID来监听入群的人，校验是否在黑名单中，如果在的话直接移出，同时开放一个公共黑名单列表，大家一块来搞
- 群数据推送
  - 每天有新人加群，有人退群，特别是退群的时候察觉不到，所以做一个插件每天定时推送群数据，这个数据可能包括日内新入群数量、退群数量、聊天人数量及聊天数、聊天最积极人及数量、群成员邀请好友入群数量等等
- QA问答
  - 技术交流群免不了的提问，所以准备开一个 `Github` 仓库，使用 `issuse` 管理每个问答，每个成功解决的问题将被收录其中，使用 `webhook` 每个 `issuse` 在提交的时候将会被监听到存放到列表中，在群聊中监听消息作为关键字，触发列表中标题关键字或相似，返回对应链接或解答
- 可视化管理面板
  - 目前对机器人所有的更改都是直接在代码中，想做一个可视化的管理系统，管理机器人并拥有可视化的数据页面方便我们随时随地查看群数据，支持Web端和H5
  - 现在已经有一个类似的了 👉 [WebPanel](https://github.com/gengchen528/wechaty-web-panel)，大家也可以体验一下，我是想开发一个更简单便捷的，顺带做几个数据统计的页面，所以放到 TODO 里了，有时间再说





## 最后

欢迎大家关注公众号「不正经的前端」，是前端，又不只是前端，所以叫不正经的前端

也可以加机器人助手「圈子」体验一波哦，同时也可以加入技术交流群

我们不应该只是为了工作和赚钱而敲代码，最后祝大家工作之余，玩得开心

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200713201421436.png)