# 「前端工程化之模块化」JS模块化演进史

## 写在前面

CommonJS、AMD、CMD、UMD、ESM，相信很多前端新同学甚至有些喜好摸鱼的老同学经常被它们搞混，如果你知道它们却不知道它们之间的联系，如果你知道它们之间的联系却不了解它们的核心实现，你都应该好好看一看这篇文章，相信它可以助你一臂之力，因为你应该找不到比这更 `俗` 的文章了，码字不易，先赞后看，养成习惯！！！



## 什么是模块化

模块化其实是指解决一个复杂问题时 `自顶向下逐层把系统划分成若干模块` 的过程，每个模块完成一个特定的子功能（单一职责），所有的模块按某种方法组装起来，成为一个整体，从而完成整个系统所要求的功能，不理解没关系，接着往下看。



## 为什么需要模块化

早期在网页这个东西刚出现的时候，页面、样式都很简单，极少有交互以及设计元素，一个页面也不会依赖很多文件，逻辑代码非常少，就是静态页面那种，那个时候的前端叫网页设计。

随着我们 `Web` 技术的发展，各种交互以及新技术等使网页变得越来越丰富，逐渐我们前端工程师登上了舞台，同时也使得我们前端同学的代码量急速上涨、复杂度在逐步增高，越来越多的业务逻辑和交互都放在 Web 层实现，代码一多，各种命名冲突、代码冗余、文件间依赖变大等等一系列的问题就出来了，甚至导致后期难以维护。

在这些问题上，其他如 java、php 等后端语言中早已有了很多实践经验，那就是模块化，因为小的、组织良好的代码远比庞大的代码更易理解和维护，于是我们前端也开启了模块化历程。

前端三剑客中占据主导地位的 JS 在早期不是一种模块化编程语言，规范中也没有模块（即module）的概念，所以模块的实现就显得很麻烦了，不过早期的前端工程师通过 JS 的语言特性来模拟实现了模块化。



## 早期模块化方案

### 普通函数

首先考虑到函数实现，因为 JS 中函数是有独立作用域的，并且函数中可以放任何代码，只需要在需要使用的地方调用即可，就比如下面代码：

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

最早期就这样写，可以看到这样做实现了代码分离及组织，看着挺很清晰，但其实是因为代码量小，如果函数过多，并且在多个文件中，还是无法保证它们不与其它模块发生命名冲突，而且模块成员之间看不出直接关系，还是会给后期的维护造成麻烦。



### 命名空间

上面普通函数的方式我们看过了有缺点，很多变量和函数会直接在全局作用域下面声明，很容易产生命名冲突，于是，命名空间模式（namespace）就被提出了。

因为对象可以有属性，而它的属性既可以是数据，也可以是方法，刚好能够很好地满足需求，而且对象的属性通过对象名字来访问，相当于设定了一个命名空间。

那我们就再来看看把模块写成一个对象，所有的模块成员都放到这个对象里面怎么样：

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

显然这是可行的，但是很快我们又发现了其缺点，对象内部属性全部会暴露出来，内部状态可以被外部更改，如下：

```js
myModule.name = "哈哈哈"
myModule.getName() // 哈哈哈
```



### 立即执行函数（IIFE）

尽管命名空间模式一定程度上解决了全局命名空间上的变量污染问题，但是它没办法解决代码和数据隔离的问题，大概在 2003 年，立即执行函数简称 `IIFE` 出现了 ，它其实是利用函数闭包的特性来实现私有数据和共享方法，如下：

```js
var myModule = (function() {
  var name = 'isboyjc'
  
  function getName() {
    console.log(name)
  }
  
  return { getName } 
})()
```

这样我们就可以通过 `myModule.getName()` 来获取 `name`，并且实现 `name` 属性的私有化，即外部调用不到：

```js
myModule.getName() // isboyjc
myModule.name // undefined
```

那假如我们这个模块需要依赖其他模块呢？这时候就用到了引入依赖，即函数传参：

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

通过这种传参的形式，我们就可以在 `myModule` 模块中使用其他模块，从而解决了很多问题，这也是现代模块化规范的思想来源。



### 依赖注入

模块化发展的历程中还有模版定义依赖、注释定义依赖等方案，这些我觉得并不具有很强的学习性质，不多说了，我们下面说依赖注入（Dependency Indection, DI），说到这个，不得不提起三大框架之一的 `Angular`，它诞生于 2009 年，其核心特性之一就是依赖注入。

假如我们有两个原始模块 `fnA` 和 `fnB` ：

```js
// 模块fnA
let fnA = function(){
  return {name: '我是fnA'}
}

// 模块fnB
let fnB = function(){
  return {name: '我是fnB'}
}
```

我们编写一个函数 `fnC`，想要使用上面两个模块，我们可以通过下面这种方式：

```js
let fnC = function(){
  let a = fnA()
  let b = fnB()
  console.log(a, b)
}
```

我们也知道，上面这样的代码无论从哪个角度看都很不灵活，我们不知道这段代码中有哪些依赖，也不能对引入的依赖进行二次修改因为会造成原函数的更改，这个时候我们要做的就是将依赖的函数作为参数显式的传入：

```js
let fnC = function(fnA, fnB){
  let a = fnA()
  let b = fnB()
  console.log(a, b)
}
```

问题又来了，如果我们在很多地方都调用了函数 `fnC`，后面突然有需求需要调用第三个依赖项怎么办呢？难道要去修改调用处函数传入参吗？这样做也可以，但很不明智，那这里就需要一段代码帮助我们做这个事情，也就是所谓的依赖注入器，它需要帮我们解决下面这几个问题：

- 可以实现依赖的注册
- 依赖注入器应该可以接收依赖（函数等），注入成功后给我们返回一个可以获取所有资源的函数
- 依赖注入器要能够保持传递函数的作用域
- 传递的函数能够接收自定义的参数，而不仅仅是被描述的依赖项

我们来简单实现一个依赖注册器，我们新建一个 `injector` 对象，它是独立的，以便它能够在我们应用的各个部分都拥有同样的功能。

```js
let injector = {
  dependencies: {},
  register: function(key, value) {
    this.dependencies[key] = value;
  },
  resolve: function(deps, func, scope) {
    var args = [];
    for(var i = 0; i < deps.length, d = deps[i]; i++) {
      if(this.dependencies[d]) {
        // 存在此依赖
        args.push(this.dependencies[d]);
      } else {
        // 不存在
        throw new Error('不存在依赖：' + d);
      }
    }
    return function() {
      func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }   
  }
}
```

可以看到，这个对象非常简单，只有三个属性，`dependencies` 用来保存依赖，`register` 用来添加依赖，最后的 `resolve` 用来注入依赖。

 `resolve` 函数需要做的事情很简单，先检查 `deps` 数组，然后在 `dependencies` 对象种寻找依赖，依次添加至 `args` 数组中，` scope` 参数存在则指定其作用域，返回的函数中将其参数使用 `.apply` 的方法传入我们传递回去的 `func` 回调。

再来看使用：

```js
// 添加
injector.register('fnA', fnA)
injector.register('fnB', fnB)

// 注入
(injector.resolve(['fnA', 'fnB'], function(fnA, fnB){
  let a = fnA()
  let b = fnB()
  console.log(a, b)
}))()
```

调用时，我们也可以传入额外的参数：

```js
(injector.resolve(['fnA', 'fnB'], function(fnA, fnB, str){
  let a = fnA()
  let b = fnB()
  console.log(a, b, str)
}))('isboyjc')
```

由此，我们实现了一个简单的依赖注入，依赖注入并不是一个新的东西，它在其他语言中存在已久，它是一种设计模式，也可以说是一种风格。

早期的模块化演变过程中还有很多方案，就不一一写了，我们所说的模块化方案，并不是相互独立的，每种方案之间可能相互借鉴，就像依赖注入这种方式也用到了 `IIFE` ，一个好的模块化方案，无非就像是解决我们上面依赖注入提出的几个问题一样解决实际问题而存在，随着前端发展对模块需求越来越大，社区中逐渐出现了一些优秀且被大多数人认同的模块化解决方案，慢慢演变成了通用的社区模块化规范，它们不仅解决了依赖注入的这些问题，还很多自己独有的模块化特性，再到后面 ES6 的出现也伴随着官方（语言层面）的模块化规范 ESM 的落地，我们接着看。



## 模块化规范进化史

### CommonJS规范

#### 简介

JS 标准定义的 API 只是为了构建基于浏览器的应用程序，并没有制定一个用于更广泛的应用程序的标准库。

而 `CommonJS` 规范的提出主要是为了弥补 JS 没有标准的缺陷，它由社区提出，终极目标就是提供一个类似 `Python` 或 `Ruby` 或` Java`语言的标准库，而不只是停留在脚本程序的阶段。

即用 `CommonJS API` 编写出的应用不仅可利用 JS 来开发客户端应用，还可编写服务器端 JS 应用程序、命令行工具、桌面图形界面应用程序等。

2009 年，美国程序员 `Ryan Dahl` 以 `CommonJs` 规范为基础创造了 `node.js` 项目，将 JS 语言用于服务器端编程，为前端奠基，从此之后 nodejs 就成为了 `CommonJs` 的代名词。

`CommonJS` 规范中规定每个文件就是一个独立的模块，有自己的作用域，模块的变量、函数、类都是私有的，外部想要调用，必须使用 `module.exports` 主动暴露，而在另一个文件中引用则直接使用 `require(path)` 即可，如下：

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

引用如下：

```js
var num = require('./num.js')

console.log(num.a) // 1
console.log(num.b) // 2
console.log(num.add(a,b)) // 3
```

 `require` 命令则负责读取并执行一个 JS 文件，并返回该模块的 `exports` 对象，没找到的话就抛出一个错误。

上面也说过，`CommonJS` 规范适用于服务端，也就是只适用于  `NodeJS` ，其实简单来说就是 `Node` 内部提供一个构造函数 `Module`，所有模块都是构造函数 `Module` 的实例，如下：

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  // ...
}
```

每个模块内部，都有一个 `module` 实例，该对象就会有下面几个属性：

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名
- `module.filename` 模块的文件名，带有绝对路径
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载
- `module.parent` 返回一个对象，表示调用该模块的模块
- `module.children` 返回一个数组，表示该模块要用到的其他模块
- `module.exports` 表示模块对外输出的值

总的来说 `CommonJS` 规范的特点有下面几个方面：

- 所有代码都运行在模块作用域，不会污染全局作用域
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果，要想让模块再次运行，必须清除缓存
- 模块加载的顺序，按照其在代码中出现的顺序

说了这么多，不如我们直接实现一个简单的。



#### 核心实现

不多说，先上代码为敬，简单几十行代码，带大家体会一下 commonJS。

首先，我们创建一个 `test.js`，写如下代码：

 ```js
 module.exports = {
   a:1,
   b:2,
   c(){
     return 3
   }
 }
 ```

有人会问：不是要手写实现吗？ `module.exports` 明明是原生的。。接着看。

新建一个 `commonJS.js` 文件，全部代码如下，看一遍注释，后面再略微介绍下就 OK 了，因为很简单。。

```js
let path = require('path');
let fs = require('fs');
let vm = require('vm');

let n = 0

// 构造函数Module
function Module(filename){
  this.id = n++; // 唯一ID
  this.filename = filename; // 文件的绝对路径
  this.exports = {}; // 模块对应的导出结果
}

// 存放可解析的文件模块扩展名
Module._extensions = ['.js'];
// 缓存
Module._cache = {};
// 拼凑成闭包的数组
Module.wrapper = ['(function(exports,require,module){','\r\n})'];

// 没写扩展名，默认添加扩展名
Module._resolveFilename = function (p) {
  p = path.join(__dirname, p);
  if(!/\.\w+$/.test(p)){
    //如果没写扩展名,尝试添加扩展名
    for(let i = 0; i < Module._extensions.length; i++){
      //拼接出一个路径
      let filePath = p + Module._extensions[i];
      // 判断文件是否存在
      try{
        fs.accessSync(filePath);
        return filePath;
      }catch (e) {
        throw new Error('module not found')
      }
    }
  }else {
    return p
  }
}

// 加载模块本身
Module.prototype.load = function () {
  // 解析文件后缀名 isboyjc.js -> .js
  let extname = path.extname(this.filename);
  // 调用对应后缀文件加载方法
  Module._extensions[extname](this);
};

// 后缀名为js的加载方法
Module._extensions['.js'] = function (module) {
  // 读文件
  let content = fs.readFileSync(module.filename, 'utf8');
  // 形成闭包函数字符串
  let script = Module.wrapper[0] + content + Module.wrapper[1];
  // 创建沙箱环境，运行并返回结果
  let fn = vm.runInThisContext(script);
  // 执行闭包函数，将被闭包函数包裹的加载内容
  fn.call(module, module.exports, req, module)
};

// 仿require方法, 实现加载模块
function req(path) {
  // 根据输入的路径 转换绝对路径
  let filename = Module._resolveFilename(path);
  // 查看缓存是否存在，存在直接返回缓存
  if(Module._cache[filename]){
      return Module._cache[filename].exports;
  }
  // 通过文件名创建一个Module实例
  let module = new Module(filename);
  // 加载文件，执行对应加载方法
  module.load();
  // 入缓存
  Module._cache[filename] = module;
  return module.exports
}

let str = req('./test');
console.log(str);
```

如上，附带注释也不过 80 行代码。

介绍下，首先我们写了一个构造函数 `Module`，其中 `id` 是唯一ID，`filename` 存文件的绝对路径，`exports` 存模块对应的导出结果。

我们还为 Module  添加了几个静态属性，其中 `_extensions`  存放可解析模块扩展名，而在后面将扩展名作为 key，添加其解析方法。`_cache` 则是缓存加载过的模块，`wrapper` 是一个数组，包含两个字符串项，两个字符串合起来就是一个函数字符串，它作为我们后面拼凑函数的数组。

其次还添加了一个静态方法 `_resolveFilename` 用于解析文件完整路径，还有一个比较核心的原型方法 `load` ，用于加载模块。

平常我们使用 node 加载模块时，使用的是 `require` 方法，而我们手写则是用 `req` 方法，该方法传入一个文件路径（可省略后缀），方法中我们首先调用构造函数 Module 的 `_resolveFilename` 方法把传入的路径解析成一个绝对路径 `filename`，接着校验 `_cache` 对象中是否存在以 `filename` 路径为 key 的值，如果有，直接读取缓存。

如果缓存中没有，new 一个 Module 实例，再调用 `load` 方法加载模块。

最重要的是 `load` 的过程，`load` 首先解析 `filename` 字符串，拿到文件的后缀名，通过调用 `_extensions` 中后缀名对应的方法加载对应文件，我们在代码中，已经为 `Module._extensions['.js']` 添加了对应解析方法，也就是解析 js 后缀的文件。

文中的文件是 `test.js`，其后缀是 `.js`，正好对应，调用该方法，传入 this（即 module 实例）。

目光来到  `Module._extensions['.js']` 方法，其实也简单，首先通过 `filename` 读取该文件内容，接着，开始拼凑一个方法，也就是下面这行代码：

```js
let script = Module.wrapper[0] + content + Module.wrapper[1];
```

此行代码拼凑出来的字符串 script 其实就是一个方法，只不过是字符串方法，如下：

 ```js
 'function(exports,require,module){ test.js文件内容 }'
 ```

再接下来，就是大家不太理解的 `vm.runInThisContext` 方法了，这里简单介绍下：

`vm.runInThisContext(code)` 会创建一个独立的沙箱环境，执行对参数代码 `code` 的编译，运行并返回结果。该方法运行的代码没有权限访问本地作用域，但是可以访问 Global 全局对象。

这样说不理解的话，那大家总知道 `eval` 吧！其实它和 `eval` 类似，来看示例：

```js
var vm = require('vm');
var str = '111';
 
//在runInThisContext创建的沙箱环境中执行
var vmRes = vm.runInThisContext('str = "vm222";');
console.log('vmRes: ', vmRes); // vmRes:  vm222
console.log('str: ', str); // str:  111
 
//在eval中执行
var evalRes = eval('str = "eval222";');
console.log('evalRes: ', evalRes); // evalRes:  eval222
console.log('str: ', str); // str:  eval222
```

如上，使用 `vm.runInThisContext` 执行的字符串 code 并不会改变当前作用域，而 `eval` 可以，仅此而已。

思绪回来，`vm.runInThisContext(script)`  把我们拼成的字符串方法，变成了一个可执行的方法，随后调用并传入参数：

```js
fn.call(module, module.exports, req, module)
```

由于使用了 `call` 方法，所以第一个参数是将转换后的 `script` 也就是函数 fn 的 this 指向变为 当前 `module` 实例，剩余三个即函数调用参数，回顾当时拼函数时这个函数的形参与当前函数调时传入值的对比：

```js
// 原来函数
fn = function(exports, require, module){ 
  // test.js文件内容 
}

// 调用
fn(module.exports, req, module)
```

三个参数分别是：

- module 实例的 `exports` 对象
- req 模块导入方法
- module 实例本身

看到这里我想大家应该明白示例最开始的 `test.js` 中我们为什么可以直接使用 `module.exports` 导出了，很明显因为在加载过程中，我们把整个 `test` 文件作为一块代码塞进了匿名的加载方法中，而这个加载方法在执行时，形参中存在 `module` 实例，所以我们就可以直接操作 `module` 实例，向其 `exports` 属性中塞数据了！！！如此，一个非常简单的 commonJS 手写例子就结束了，你 Get 了吗？

最后总结，**简单点说，CommonJs 就是模块化的社区标准，而 Nodejs 就是 CommonJs 模块化规范的实现**，它对模块的加载是同步的，也就是说，只有引入的模块加载完成，才会执行后面的操作，在 `Node` 服务端应用当中，模块一般存在本地，加载较快，同步问题不大，在浏览器中就不太合适了，你试想一下，如果一个很大的项目，所有的模块都同步加载，那体验是极差的，所以还需要异步模块化方案，所以 `AMD规范` 就此诞生。



### AMD规范

#### 简介

AMD（异步模块定义）是专门为浏览器环境设计的，它定义了一套异步加载标准来解决同步的问题

语法如下：

```js
define(id?: String, dependencies?: String[], factory: Function|Object)
```

- `id` 即模块的名字，字符串，可选
- `dependencies`  指定了所要依赖的模块列表，它是一个数组，也是可选的参数，每个依赖的模块的输出将作为参数一次传入 `factory` 中。如果没有指定 `dependencies`，那么它的默认值是 `["require", "exports", "module"]` 
- `factory` 包裹了模块的具体实现，可为函数或对象，如果是函数，返回值就是模块的输出接口或者值

我们简单列举一些用法，如下，我们定义一个名为 `myModule` 的模块，依赖于 `jQuery` 模块：

```js
// 定义依赖 myModule，该模块依赖 JQ 模块
define('myModule', ['jquery'], function($) {
  // $ 是 jquery 模块的输出
  $('body').text('isboyjc')
})

// 引入依赖
require(['myModule'], function(myModule) {
  // todo...
})
```

没有 ID 值的匿名模块，此时文件名就是它的标识名，通常都作为启动模块：

```js
define(['jquery'], function($) {
  $('body').text('isboyjc')
})
```

依赖多个模块：

```js
define(['jquery', './math.js'], function($, math) {})
```

模块输出：

```js
define(['jquery'], function($) {
  var writeName = function(selector){
    $(selector).text('isboyjc')
  }

  // writeName 是该模块输出的对外接口
  return writeName
})
```

模块内部引用依赖：

```js
define(function(require) {
  // 引入依赖
  var $ = require('jquery')
  $('body').text('isboyjc')
})
```

大家应该都知道 `RequireJS` ，一个遵守 `AMD` 规范的工具库，用于客户端的模块管理。

它就是通过 `define` 方法，将代码定义为模块，通过 `require` 方法，实现代码的模块加载，使用时需要下载和导入，也就是说我们在浏览器中想要使用 `AMD` 规范时先在页面中引入 `require.js` 就可以了。

可以说 **`RequireJS` 就是 `AMD` 的标准化实现** 。



#### 核心实现

上面的用法大家可能都知道，我们接下来来简单实现一个 AMD 规范的模块加载器，类似 `RequireJS` 。

写之前，我们先把使用的例子写出来：

index.html 入口文件：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
    <script src="./requireJS.js"></script>
    <script>
      require(['a', 'b'], function (a, b) {
          console.log(b + a)
      });
    </script>
  </body>
</html>
```

如上所示，大概就是引入 `requireJS.js` 文件，然后使用它引入 `a` 和 `b` 两个依赖项并返回其相加的和。

我们自来看模块 `a` 和 `b` :

```js
// a.js
define([], function () {
  return 1
})

// b.js
define(['c'], function (c) {
  return 2 + c
})

// c.js
define([], function () {
  return 2
})
```

可以看到，`a.js` 文件中返回或者说导出了变量 1。

而 `b.js` 文件确又依赖了模块 `c` ，返回 `2 + c` 的和。

最后的 `c.js` 模块文件则是直接返回了变量 2。

我们要做到的效果就是执行 `index.html` 文件，最终输出 5 即可。

接下来我们来手写，其实最主要的就是两个方法 `require & define` ，还是先放代码再解释，`requireJS.js`  文件如下：

```js
(function () {
  // 缓存
  const cache = {}
  let moudle = null
  const tasks = []
  
  // 创建script标签，用来加载文件模块
  const createNode = function (depend) {
    let script = document.createElement("script");
    script.src = `./${depend}.js`;
    // 嵌入自定义 data-moduleName 属性，后可由dataset获取
    script.setAttribute("data-moduleName", depend);
    let fs = document.getElementsByTagName('script')[0];
    fs.parentNode.insertBefore(script, fs);
    return script;
  }

  // 校验所有依赖是否都已经解析完成
  const hasAlldependencies = function (dependencies) {
    let hasValue = true
    dependencies.forEach(depd => {
      if (!cache.hasOwnProperty(depd)) {
        hasValue = false
      }
    })
    return hasValue
  }

  // 递归执行callback
  const implementCallback = function (callbacks) {
    if (callbacks.length) {
      callbacks.forEach((callback, index) => {
        // 所有依赖解析都已完成
        if (hasAlldependencies(callback.dependencies)) {
          const returnValue = callback.callback(...callback.dependencies.map(it => cache[it]))
          if (callback.name) {
            cache[callback.name] = returnValue
          }
          tasks.splice(index, 1)
          implementCallback(tasks)
        }
      })
    }
  }
   
  // 根据依赖项加载js文件
  const require = function (dependencies, callback) {
    if (!dependencies.length) { // 此文件没有依赖项
      moudle = {
        value: callback()  
      }
    } else { //此文件有依赖项
      moudle = {
        dependencies,
        callback
      }
      tasks.push(moudle)
      dependencies.forEach(function (item) {
        if (!cache[item]) {
          // script表亲加载文件结束
          createNode(item).onload = function () {
            // 获取嵌入属性值，即module名
            let modulename = this.dataset.modulename
            console.log(moudle)
            // 校验module中是否存在value属性
            if (moudle.hasOwnProperty('value')) {
              // 存在，将其module value（模块返回值｜导出值）存入缓存
              cache[modulename] = moudle.value
            } else {
              // 不存在
              moudle.name = modulename
              if (hasAlldependencies(moudle.dependencies)) {
                // 所有依赖解析都已完成，执行回调，抛出依赖返回（导出）值
                cache[modulename] = callback(...moudle.dependencies.map(v => cache[v]))
              }
            }
            // 递归执行callback
            implementCallback(tasks)
          }
        }
      })
    }
  }
  window.require = require
  window.define = require
})(window)
```

同样也是简化版本，不超过 90 行代码，附带注释，大部分同学看一遍应该就懂了。

不过分讲解，简单介绍一下流程。

调用 `require` 或者 `define` 方法，首先是根据依赖数组加载 js 文件，不同于 commonJS，AMD 基于浏览器，要读文件，我们只能动态创建 script 标签，所以 `createNode` 即创建script标签，用来加载文件模块。

script 引入文件加载完成后会触发 onload 事件，我们以此控制依赖的加载顺序。只有在 JS 模块加载完成后，才能执行其 callback 回调，但是我们引入的 JS 依赖项中都是使用 `define` 方法定义的，而 `define` 方法还可能会依赖某些 js 文件模块，但总有一个源头是不存在依赖的，如此，递归便派上了用场。

我们的目的是模块加载完成后执行 callbck 回调，但如果是 A 依赖 B，B 又依赖 C 等等的关系，我们想要执行 A 回调，那必须等 B 和 C 都加载完，所以我们使用一个栈（数组） `tasks` 来存储 callback 回调，等所有依赖都加载完了，再依次执行，就和 Node 框架 koa 的洋葱模型一样。这是为了让 callback 回调函数的执行顺序正确。

大概就是这么个意思，剩下还有一些校验，因为代码简单，不细说了（可不要以为 requireJS 源码真的这么简单，并不是，真正的源码考虑了太多的东西，此代码只是为了方便大家理解，有兴趣自己看源码吧~）。



### CMD规范

#### 简介

`CMD` 的出现较为晚一些，它汲取了 `CommonJS` 和 `AMD` 规范的优点，也是专门用于浏览器的异步模块加载。

在 `CMD` 规范中，一个模块就是一个文件，`define` 是一个全局函数，用来定义模块。

`define` 接受 `factory` 参数，`factory` 可以是一个函数，也可以是一个对象或字符串。

`factory` 为对象和字符串时，表示模块的接口就是该对象、字符串，如下：

```js
// factory 为JSON数据对象
define({'name': 'isboyjc'})

// factory 为字符串模版
define('my name is {{name}}!!!')
```

`factory` 为函数时，表示是模块的构造方法，执行该构造方法，可以得到模块向外提供的接口，即 `function(require, exports, module)` ：

- `require` 是一个方法，接受模块标识作为唯一参数，用来获取其他模块提供的接口
- `exports` 是一个对象，用来向外提供模块接口
- `module` 是一个对象，上面存储了与当前模块相关联的一些属性和方法

`factory` 为函数时，如下：

```js
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  
  // 依赖就近原则：依赖就近书写，什么时候用到什么时候引入
  var b = require('./b')
  b.doSomething()
})
```

再来看看更多用法：

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

和上面 `CommonJS` 、 `AMD` 类似，**`CMD` 是 `SeaJS` 在推广过程中对模块定义的规范化产出** ，而 `CMD` 规范以及 `SeaJS` 在国内曾经十分被推崇，原因不只是因为它足够简单方便，更是因为 `SeaJS` 的作者是阿里的 `玉伯` 大佬所写，同 Vue 一样的国人作者，堪称国人之光。



#### 核心实现

对于 CMD 规范下的 SeaJS，同 AMD 规范下的 RequireJS 一样，都是浏览器端模块加载器，两者很相似，但又有明显不同，个人认为 SeaJS 的实现相对来说更精美一些，一度风靡前端圈，碍于篇幅，放在这里肯定是不合适的，后面有机会单独来介绍 SeaJS 的实现，此文我们先了解 CMD 与 AMD 区别即可。



#### CMD 与 AMD

| 规范 | 推崇     | 代表作    |
| ---- | -------- | --------- |
| AMD  | 依赖前置 | requirejs |
| CMD  | 依赖就近 | seajs     |

`CMD` 对比 `AMD` 来说，`CMD` 比较推崇 `as lazy as possible`（尽可能的懒加载，也称为延迟加载，即在需要的时候才加载）。

对于依赖的模块，`AMD` 是提前执行，`CMD` 是延迟执行，两者执行方式不一样，`AMD` 执行过程中会将所有依赖前置执行，也就是在自己的代码逻辑开始前全部执行，而 `CMD` 如果 `require` 引入了但整个逻辑并未使用这个依赖或未执行到逻辑使用它的地方前是不会执行的，不过 `RequireJS` 从 2.0 开始，也能改成延迟执行（根据写法不同，处理方式不同），另外一方面 `CMD` 推崇依赖就近，而 `AMD` 推崇依赖前置。



### UMD规范

#### 简介

UMD（Universal Module Definition），即通用模块定义，从名字就可以看出来，这东西是做大一统的。

它随着大前端的趋势所诞生，可以通过运行时或者编译时让同一个代码模块在使用 `CommonJs、CMD` 甚至是 `AMD` 的项目中运行，也就是说同一个 JavaScript 包运行在浏览器端、服务区端甚至是 APP 端都只需要遵守同一个写法就行了，那它是怎样实现的呢？



#### 核心实现

我们来看看这样一段代码

```js
((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.cmd){
		// CMD
    define(function(require, exports, module) {
      module.exports = factory()
    })
  } else {
    // 都不是
    root.umdModule = factory();
  }
})(this, () => {
  console.log('我是UMD')
  // todo...
});
```

可以看到，`define` 是 `AMD/CMD` 语法，而 `exports` 只在 `CommonJS` 中存在，你会发现它在定义模块的时候会检测当前使用环境和模块的定义方式，如果匹配就使用其规范语法，全部不匹配则挂载再全局对象上，我们看到传入的是一个 `this` ，它在浏览器中指的就是 `window` ，在服务端环境中指的就是 `global` ，使用这样的方式将各种模块化定义都兼容。

其实社区形成的的规范还有很多，目的也都是为了 JS 的模块化开发，只是我们上面说的这几个是最常用的。

截止到目前为止我们说的 `CommonJS` 、`AMD` 、 `CMD` 等都只是社区比较认可的统一模块化规范，但并不是官方（JS语言层面）的，那接下来要说的这个就是 JS 的官方模块化规范了。



### ES Module

2015年6月，`ECMAScript2015` 也就是我们说的 `ES6` 发布了，JS 终于在语言标准的层面上，实现了模块功能，使得在编译时就能确定模块的依赖关系，以及其输入和输出的变量，不像 `CommonJS` 、`AMD` 之类的需要在运行时才能确定（例如 FIS 这样的工具只能预处理依赖关系，本质上还是运行时解析），成为浏览器和服务器通用的模块解决方案。

所以说在 ES6 之前 JS 是没有官方的模块机制的，ES6在语言标准的层面上，实现了模块化功能，而且实现的相当简单，旨在成为浏览器和服务器通用的模块化解决方案，其模块化功能主要由俩个命令构成：exports和import，export命令由于规定模块的对外接口，import命令用于输入其他模块的功能。ES6还提供了export default的命令。为模块指定默认输出。对应的import语句不需要大括号。这也更接近AMD的引用写法。

ES6 Module不是对象，import命令被JavaScript引擎静态分析，在编译的时候就引入模块代码。而不是在代码运行时加载，所以无法实现条件加载。也就使得静态分析成为可能。

- export

export可以导出的是对象中包含多个属性、方法，export default只能导出一个可以不具名的函数。我们可以输用import引入。同时我们也可以直接使用require使用，原因是webpack启用了server相关。

- import

```js
import { fn } from './xxx' //    export导出的方式

import fn from 'xx' //    export default方式
```

ES6模块运行机制与commonjs运行机制不一样。js引擎对脚本静态分析的时候，遇到模块加载指令后会生成一个只读引用。等到脚本真正执行的时候。才会通过引用模块中获取值，在引用到执行的过程中，模块中的值发生变化，导入的这里也会跟着发生变化。ES6模块是动态引入的。并不会缓存值。模块里总是绑定其所在的模块。



## 最后

读到这里，你是不是对 JavaScript 模块化了解有了更清晰的认识呢？

有问题评论区码字，欢迎指错勘误！




## 参考

[Dependency injection in JavaScript](https://krasimirtsonev.com/blog/article/Dependency-injection-in-JavaScript) 

[【推荐看看】JavaScript模块化七日谈](https://github.com/Huxpro/js-module-7day) 





