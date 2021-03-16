# 前端模块化精读

webpack、roullp、parcel、snowpack、vite

## 写在前面

春节尤大怕我们太闲了，然后就发布了 `vite2.0`，随着 `vite2.0` 的发布，意味着它逐渐趋于稳定，2.0的更新其实最重要的是一些对 1.0 中接口的优化及对 `Rollup` 插件接口的扩展，从 1.0 的问世，市面上对它的关注量就很高，现在 2.0 都来了，那对我们来说，可以不用，但是不能不知道，还是要积极拥抱新知识的

我个人理解，诸如 `webpack` 、 `roullp` 、 `snowpack` 、 `vite` 等等，他们都只是工具，我们没必要疯狂打新（一出来就使用），但是我们一定要知道这个东西是做什么、为什么被需要、它怎样实现的（大概核心），这才是我们更加应该关心的，相比于前面这 3 个问题，使用方面只需要看看文档就足够了，毕竟别人轮子都造出来了，我们无非是遵循其一些特殊语法用而已，而在开发中一定要使用最多人用的，因为这样最稳定，私下里就可以靠喜好了

此文我们会从 JS模块化的演进开始说起，再到这些工具的产生、作用以及它们的核心是怎样实现的，对于怎样实现的这个问题我们只会说核心，因为我们懂核心就够了，毕竟也不能一行一行的照着把代码敲出来，那样只是浪费时间，况且它只是工具而已，你觉得呢





## JS模块化演进史

`ES6` 大行其道的今天，像 `AMD` 、 `CMD` 也正在逐步退出历史舞台，为了更加深刻的了解其模块化进程，我们还是需要知道的一些历史的



### 什么是模块化

模块化其实是指解决一个复杂问题时自顶向下逐层把系统划分成若干模块的过程，每个模块完成一个特定的子功能（单一职责），所有的模块按某种方法组装起来，成为一个整体，从而完成整个系统所要求的功能，不太理解没关系，接着往下看



### 为什么需要模块化

早期在网页这个东西刚出现的时候，页面、样式都很简单，极少有交互以及设计元素，一个页面也不会依赖很多文件，逻辑代码非常少，就是静态页面那种，那个时候的前端叫网页设计

随着我们 `Web` 技术的发展，各种交互以及新技术等使网页变得越来越丰富，逐渐我们前端工程师登上了舞台，同时也使得我们前端同学的代码量急速上涨、复杂度在逐步增高，越来越多的业务逻辑和交互都放在 Web 层实现，代码一多，各种命名冲突、代码冗余、文件间依赖变大等等一系列的问题就出来了，甚至导致后期难以维护

在这些问题上，其他诸如 java、php 等后端语言中早已有了很多实践经验，那就是模块化，因为小的、组织良好的代码远比庞大的代码更易理解和维护，于是我们前端也开启了模块化历程

早期的 JS 它不是一种模块化编程语言，JS 规范中也没有模块（即module）的概念，所以模块的实现就显得很麻烦了，不过早期的前端工程师通过 JS 的语言特性来模拟实现了模块化



### 早期模块化方案

#### 普通函数

首先考虑到函数实现，因为 JS 中函数是有独立作用域的，并且函数中可以放任何代码，只需要在需要使用的地方调用即可，就比如下面代码

```js
function fn1(){
  //...
}
function fn2(){
  //...
}
function fn3() {
  fn1()
  fn2()
}
```

最早期就这样写，可以看到这样做实现了代码分离及组织，看着挺很清晰，但其实是因为代码量小，如果函数过多，并且在多个文件中，还是无法保证它们不与其它模块发生命名冲突，而且模块成员之间看不出直接关系，还是会给后期的维护造成麻烦



#### 直接定义依赖

最先尝试将模块化引入到 JS 中是在1999年，当时被称作直接定义依赖，这种方式实现模块化十分简单粗暴，即通过全局方法定义、引用模块

就比如早期的 Dojo（1.6版本之前，1.6版本之后就使用AMD规范了），一个基于 JS 的工具包，它就是使用这种方式进行模块组织的，我们使用 `dojo.provide` 定义一个模块，`dojo.require` 来调用在其它地方定义的模块

```js
// greeting.js 文件
dojo.provide("app.greeting");

app.greeting.helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

app.greeting.sayHello = function (lang) {
    return app.greeting.helloInLang[lang];
};

// hello.js 文件
dojo.provide("app.hello");

dojo.require('app.greeting');

app.hello = function(x) {
    document.write(app.greeting.sayHello('es'));
};

```

直接定义依赖的方式和后面要介绍到的 Commonjs 类似，区别是它可以在任何文件中定义模块，模块不和文件进行关联，而在 Commonjs 中，每一个文件就是一个模块





#### 命名空间

上面普通函数的方式我们看过了有缺点，很多变量和函数会直接在全局作用域下面声明，很容易产生命名冲突，于是，命名空间模式（namespace）就被提出了

因为对象可以有属性，而它的属性既可以是数据，也可以是方法，刚好能够很好地满足需求，而且对象的属性通过对象名字来访问，相当于设定了一个命名空间

那我们就再来看看把模块写成一个对象，所有的模块成员都放到这个对象里面怎么样

```js
var myModule = {
  name: "isboyjc",
  getName: function (){
    console.log(this.name)
  }
}

// 使用
myModule.getName()
```

显然这是可行的，但是很快我们又发现了其缺点，对象内部属性全部会暴露出来，内部状态可以被外部更改，如下

```js
myModule.name = "哈哈哈"
myModule.getName() // 哈哈哈
```



#### 立即执行函数（IIFE）

尽管命名空间模式一定程度上解决了全局命名空间上的变量污染问题，但是它没办法解决代码和数据隔离的问题，大概在 2003 年，立即执行函数简称 `IIFE` 出现了 ，它其实是利用函数闭包的特性来实现私有数据和共享方法，如下

```js
var myModule = (function() {
  var name = 'isboyjc'
  
  function getName() {
    console.log(name)
  }
  
  return { getName } 
})()
```

这样我们就可以通过 `myModule.getName()` 来获取 `name`，并且实现 `name` 属性的私有化，即外部调用不到

```js
myModule.getName() // isboyjc
myModule.name // undefined
```

那假如我们这个模块需要依赖其他模块呢？这时候就用到了传参

```js
// otherModule.js模块文件
var otherModule = (function(){
  return {
    a: 1,
    b: 2
  }
})()

// myModule.js模块文件 - 依赖 otherModule 模块
var myModule = (function(other) {
  var name = 'isboyjc'
  
  function getName() {
    console.log(name)
    console.log(other.a, other.b)
  }
  
  return { getName } 
})(otherModule)
```

通过这种传参的形式，我们就可以在 `myModule` 模块中使用其他模块，从而解决了很多问题，这也是现代模块化规范的思想来源，但是它还是存在问题的，像上面的 `myModule`，我们在分离模块后，`myModule` 模块依赖 `otherModule` 模块，那 `otherModule` 模块文件必须要在 `myModule` 模块文件之前加载



#### 模版定义依赖

大概在 2006 年左右，这个时候非常流行后端的模板语法，从而衍生了一种通过后端语法聚合 JS 文件，从而实现依赖加载的方式，即模板定义依赖

具体做法是对于某个 JS 文件，如果它依赖其它 JS 文件，则在这个文件的头部通过特殊的标签语法去指定以来

这种方案由于太早了，我只找了点资料没有去做尝试，不演示了，但是想想也可以明白，需要配合后端的模板语法一起使用，在现阶段的前端生态中，可维护性极低



#### 注释定义依赖



#### 依赖注入



其实早期的模块化演变过程中还有很多方案，就不一一写了，慢慢的随着前端发展对模块需求越来越大，社区中逐渐出现了一些优秀且被大多数人认同的模块化解决方案，慢慢演变成了通用的社区模块化规范，再到后面 ES6 的出现，伴随着官方（语言层面）的模块化规范 ESM 的落地，接着看



### 常见的模块化规范

#### CommonJS规范

JS 标准定义的 API 只是为了构建基于浏览器的应用程序，并没有制定一个用于更广泛的应用程序的标准库

而 `CommonJS` 规范的提出主要是为了弥补 JS 没有标准的缺陷，由社区提出，终极目标就是提供一个类似 `Python` 或 `Ruby` 或` Java`语言的标准库，而不只是停留在脚本程序的阶段

即用 `CommonJS API` 编写出的应用不仅可利用 JS 来开发客户端应用，还可编写服务器端 JS 应用程序、命令行工具、桌面图形界面应用程序等

2009年，美国程序员 `Ryan Dahl` 以 `CommonJs` 规范为基础创造了 `node.js` 项目，将 JS 语言用于服务器端编程，为我们前端发展添了一把火，从此之后 nodejs 就成为了 `CommonJs` 的代名词

`CommonJS` 规范中规定每个文件就是一个独立的模块，有自己的作用域，模块的变量、函数、类都是私有的，外部想要调用，必须使用 `module.exports` 主动暴露，而在另一个文件中引用则直接使用 `require(path)` 即可，如下

```js
// num.js
var a = 1
var b = 2
var add = function (){
  return a + b
}

// 导出
module.exports.a = a
module.exports.b = b
module.exports.add = add
```

引用如下

```js
var num = require('./num.js')

console.log(num.a) // 1
console.log(num.b) // 2
console.log(num.add(a,b)) // 3
```

 `require` 命令则负责读取并执行一个 JS 文件，并返回该模块的 `exports` 对象，没找到的话就抛出一个错误

上面也说过，`CommonJS` 规范适用于服务端，也就是只适用于  `NodeJS` ，其实简单来说就是 `Node` 内部提供一个构造函数 `Module`，所有模块都是构造函数 `Module` 的实例，如下

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  // ...
}
```

每个模块内部，都有一个 `module` 实例，该对象就会有下面几个属性

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名
- `module.filename` 模块的文件名，带有绝对路径
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载
- `module.parent` 返回一个对象，表示调用该模块的模块
- `module.children` 返回一个数组，表示该模块要用到的其他模块
- `module.exports` 表示模块对外输出的值

总的来说 `CommonJS` 规范的特点有下面几个方面

- 所有代码都运行在模块作用域，不会污染全局作用域
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果，要想让模块再次运行，必须清除缓存
- 模块加载的顺序，按照其在代码中出现的顺序

**简单说，CommonJs 就是模块化的社区标准，而 Nodejs 就是 CommonJs（模块化）的实现**，它对模块的加载是同步的，也就是说，只有引入的模块加载完成，才会执行后面的操作，在 `Node` 服务端应用当中，模块一般存在本地，加载较快，同步问题不大，在浏览器中就不太合适了，你试想一下，如果一个很大的项目，所有的模块都同步加载，那体验是极差的，所以还需要异步模块化方案，所以 `AMD规范` 就此诞生



#### AMD规范

AMD（异步模块定义）是专门为浏览器环境设计的，它定义了一套异步加载标准来解决同步的问题

语法如下：

```js
define(id?: String, dependencies?: String[], factory: Function|Object)
```

- `id` 即模块的名字，字符串，可选
- `dependencies`  指定了所要依赖的模块列表，它是一个数组，也是可选的参数，每个依赖的模块的输出将作为参数一次传入 `factory` 中。如果没有指定 `dependencies`，那么它的默认值是 `["require", "exports", "module"]` 
- `factory` 包裹了模块的具体实现，可为函数或对象，如果是函数，返回值就是模块的输出接口或者值

我们简单列举一些用法，如下，我们定义一个名为 `myModule` 的模块，依赖于 `jQuery` 模块

```js
define('myModule', ['jquery'], function($) {
  // $ 是 jquery 模块的输出
  $('body').text('isboyjc')
})

// 使用
require(['myModule'], function(myModule) {})
```

没有 ID 值的匿名模块，此时文件名就是它的标识名，通常都作为启动模块

```js
define(['jquery'], function($) {
  $('body').text('isboyjc')
})
```

多个模块

```js
define(['jquery', './math.js'], function($, math) {})
```

模块输出

```js
define(['jquery'], function($) {
  var writeName = function(selector){
    $(selector).text('isboyjc')
  }

  // writeName 是该模块输出的对外接口
  return writeName
})
```

模块内部引用依赖

```js
define(function(require) {
  // 引入依赖
  var $ = require('jquery')
  $('body').text('isboyjc')
})
```

大家应该都知道 `RequireJS` ，一个遵守 `AMD` 规范的工具库，用于客户端的模块管理

它就是通过 `define` 方法，将代码定义为模块，通过 `require` 方法，实现代码的模块加载，使用时需要下载和导入，也就是说我们在浏览器中想要使用 `AMD` 规范时先在页面中引入 `require.js` 就可以了

可以说 **`RequireJS` 就是 `AMD` 的标准化实现** 



#### CMD规范

`CMD` 的出现较为晚一些，它汲取了 `CommonJS` 和 `AMD` 规范的优点，也是专门用于浏览器的异步模块加载

在 `CMD` 规范中，一个模块就是一个文件，`define` 是一个全局函数，用来定义模块

`define` 接受 `factory` 参数，`factory` 可以是一个函数，也可以是一个对象或字符串

`factory` 为对象和字符串时，表示模块的接口就是该对象、字符串，如下

```js
// factory 为JSON数据对象
define({'name': 'isboyjc'})

// factory 为字符串模版
define('my name is {{name}}!!!')
```

`factory` 为函数时，表示是模块的构造方法，执行该构造方法，可以得到模块向外提供的接口

`factory` 是一个函数时即 `function(require, exports, module)`

- `require` 是一个方法，接受模块标识作为唯一参数，用来获取其他模块提供的接口
- `exports` 是一个对象，用来向外提供模块接口
- `module` 是一个对象，上面存储了与当前模块相关联的一些属性和方法

`factory` 为函数时，如下

```js
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  
  // 依赖就近原则：依赖就近书写，什么时候用到什么时候引入
  var b = require('./b')
  b.doSomething()
})
```

再来看看更多用法

```js
define(function(require, exports, module) {
  // 同步引入
  var a = require('./a')
  
  // 异步引入
  require.async('./b', function (b) {
  })
  
  // 条件引入
  if (status) {
      var c = requie('./c')
  }
  
  // 暴露模块
  exports.aaa = 'hahaha'
})
```

和上面 `CommonJS` 、 `AMD` 类似，**`CMD` 是 `SeaJS` 在推广过程中对模块定义的规范化产出** ，而 `CMD` 规范以及 `SeaJS` 在国内曾经十分被推崇，原因不只是因为它足够简单方便，更是因为 `SeaJS` 的作者是阿里的 `玉伯` 所写，同 Vue 一样的国人作者

**`CMD` 与 `AMD` 区别**

`CMD` 对比 `AMD` 来说，`CMD` 比较推崇 `as lazy as possible`（尽可能的懒加载，也称为延迟加载，即在需要的时候才加载），对于依赖的模块，`AMD` 是提前执行，`CMD` 是延迟执行，两者执行方式不一样，`AMD` 执行过程中会将所有依赖前置执行，也就是在自己的代码逻辑开始前全部执行，而 `CMD` 如果 `require` 引入了但整个逻辑并未使用这个依赖或未执行到逻辑使用它的地方前是不会执行的，不过 `RequireJS` 从 2.0 开始，也能改成延迟执行（根据写法不同，处理方式不同），另外一方面 `CMD` 推崇依赖就近，而 `AMD` 推崇依赖前置



#### UMD规范

UMD（Universal Module Definition），即通用模块定义，从名字就可以看出来，这东西是做大一统的





其实社区形成的的规范还有很多，目的也都是为了 JS 的模块化开发，只是我们上面说的这几个是最常用的

截止到目前为止我们说的 `CommonJS` 、`AMD` 、 `CMD` 等都只是社区比较认可的统一模块化规范，但并不是官方（JS语言层面）的，那接下来要说的这个就是 JS 的官方模块化规范了



#### ES Module

2015年6月，`ECMAScript2015` 也就是我们说的 `ES6` 发布了，JS 终于在语言标准的层面上，实现了模块功能，使得在编译时就能确定模块的依赖关系，以及其输入和输出的变量，不像 `CommonJS` 、`AMD` 之类的需要在运行时才能确定（例如 FIS 这样的工具只能预处理依赖关系，本质上还是运行时解析），成为浏览器和服务器通用的模块解决方案

所以说在 ES6 之前 JS 是没有官方的模块机制的，而 ES6 中引入了 `export` 和 `import` 两个关键字分别对应模块导出、模块导入







## Bundle打包工具





## 无Bundle打包工具



















前几天掘金运营不是让写vite吗，然后我就写了一片vite的文章，写着写着跑偏了，写到了工程化，然后就打算写本小册，从开发、测试、构建、部署以及监控这五个模块构成的典型前端工作流为主线叙述前端工程化演进历史，大概思路是下面这样



**开发**

JS模块化、CSS模块化以及组件化的产生以及演进



**构建**

从 打包工具 到 构建工具

从grunt/gulp到webpack/roullp/parcel再到snowpack/vite的为什么产生、解决了哪些问题、是怎样工作的



**部署**

从发布到迭代的 CI/CD 工程



**测试**

针对组件、逻辑的 单元测试

针对代码质量、构建产物质量、最佳实践、开发约定等多个维度的静态检查

针对业务流程的 自动化测试

针对性能的 性能测试



**监控**

针对生产环境下

通过 埋点 来统计、分析业务数据以及跟踪性能指标等

通过监控平台的形式进一步观察线上异常信息（报错、白屏、流量异常）















[Javascript模块化的演进历程](https://juejin.cn/post/6844903640897945614)





