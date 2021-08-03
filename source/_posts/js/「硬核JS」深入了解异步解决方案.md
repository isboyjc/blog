---
title: 「硬核JS」深入了解异步解决方案
tags: [JavaScript]
categories: 硬核JS系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/js.jpg
date: 2020-02-14 14:00:00
---

<!-- more -->

## 前言

Javascript 语言的执行环境是`单线程`(single thread，指一次只能完成一件任务，如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推)

这种模式的好处是实现起来比较简单，执行环境相对单纯，坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行，常见的浏览器无响应(假死)，往往就是因为某一段 Javascript 代码长时间运行(比如死循环)，导致整个页面卡在这个地方，其他任务无法执行

为了解决这个问题，Javascript 将任务的执行模式分成两种：同步(Synchronous)和异步(Asynchronous)

`同步模式` 就是后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的

`异步模式`则完全不同，每一个任务有一个或多个回调函数(callback)，前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的，在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是 Ajax 操作。在服务器端，`异步模式`甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有 http 请求，服务器性能会急剧下降

前面都是些无用的话，因为大家都对此很清楚，那么，问题来了，你了解几种异步解决方案？

本文会由浅入深的叙述下面几种已知的异步解决方案，以及它们的区别

- 回调函数(callback)
- 事件监听(发布/订阅)解析
- Promise 解析及从 0 ～ 1 的源码体验
- Generator 全面解析
- Async/Await 解析

赶上春节不出门为国家做贡献，写了这篇帖子，本文有点长，因为本来要写四篇文章分别叙述，但是我觉得还是在一块看比较容易对比理解，大概有两万字左右，如果你肯花 20 分钟的时间阅读本文，定会有所收获，我在耐心写，也希望大家可以耐心看完，基础不太好的同学可以分块看，已详细注明各级标题，希望通过本文可以让大家对大 JS 异步编程加深了解

哦对了，先赞在看，养成习惯，毕竟码字不易，大家的每一个赞和评论都将为我码下一篇文章添一些动力，多谢 😁

## 回调函数(callback)

### 简述回调函数

回调函数大家都应该清楚，简单理解就是一个函数被作为参数传递给另一个函数

回调并不一定就是异步，并没有直接关系，只不过回调函数是异步的一种解决方案

我们用例子来简单说明下

```js
function fn1(callback) {
  console.log("1")
  callback && callback()
}

function fn2() {
  console.log("2")
}

fn1(fn2)
```

如上代码所示，函数 fn1 参数为一个回调，调用 fn1 时传进入了函数 fn2，那么在函数 fn1 执行到 callback 函数调用时会调用 fn2 执行，这是一个典型的回调函数，不过是同步的，我们可以利用这点来解决异步，如下

```js
fn1(callback){
  setTimeout(() => {
    callback && callback()
  }, 1000)
}

fn1(()=>{
  console.log("1")
})
```

如上所示，我们使用 setTimeout 在函数 fn1 中模拟了一个耗时 1s 的任务，耗时任务结束会抛出一个回调，那么我们在调用时就可以做到在函数 fn1 的耗时任务结束后执行回调函数了

采用这种方式，我们把同步操作变成了异步操作，fn1 不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行

### 回调函数优/缺

**优点**

一句话，回调函数是异步编程最基本的方法，其优点是简单、容易理解和部署

**缺点**

回调函数最大的缺点是不利于代码的阅读和维护，各个部分之间高度耦合(Coupling)

```js
fun1(() => {
  fun2(() => {
    fun3(() => {
      fun4(() => {
        fun5(() => {
          fun6()
        })
      })
    })
  })
})
```

上面这种代码在之前使用 AJAX 请求时很常见，因为业务上在一个请求结束后发起另一个请求的需求太多了，代码不优雅，不易阅读维护，高耦合，层层嵌套造成这种**回调地狱**

异步回调中，回调函数的执行栈与原函数分离开，外部无法抓住异常，异常会变得不可控

虽然缺点多，但回调函数日常开发中也不可或缺，使用时注意就好了

回调函数比较简单常用，就先介绍到这里，接下来我们看事件监听

## 事件监听(发布订阅模式)

解决异步，可以采用事件驱动，任务的执行不取决于代码的顺序，而取决于某个事件是否发生

在阮一峰老师早期发布的 **Javascript 异步编程的 4 种方法(参考链接【1】)** 一文中，把事件监听和发布订阅作为了不同的两种解决方案，但是我个人觉得这两种完全可以并为一种，都是利用了发布订阅模式的事件驱动，所以就放一块解释了

### JQuery 实现事件监听

jquery 实现比较简单，因为 jq 为我们封装好了方法，使用即可，只是 JQ 不常用了，简单了解下

我们可以使用 jquery 中的`on`来监听事件，使用`trigger`触发事件，如下

```js
$("body").on("done", fn2)

function fn1() {
  setTimeout(function () {
    $("body").trigger("done")
  }, 2000)
}

function fn2() {
  console.log("fn2执行了")
}
fn1()
```

我们使用 jq 的`on`监听了一个自定义事件`done`，传入了 fn2 回调，表示事件触发后立即执行函数 fn2

在函数 fn1 中使用 setTimeout 模拟了耗时任务，setTimeout 回调中使用`trigger`触发了`done`事件

我们可以使用`on`来绑定多个事件，每个事件可以指定多个回调函数

### JavaScript 实现事件监听

在 JS 中我们要自己实现类似 JQ 的`on`和`trigger`了

实现的过程中用到了一个设计模式，也就是发布订阅模式，所以简单提一下

#### 简述发布订阅模式(观察者模式)

发布订阅模式(publish-subscribe pattern)，又叫观察者模式(observer pattern)，定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

来看一个比较挫的例子

```js
小李辛辛苦苦做了两年程序猿，攒了些钱，内心激动，要去售楼部买一个心仪已久的房型

到售楼部问了下，售楼部说暂时没有这种房型的房源了，怎么办呢，下次再来吧

但是小李不知道这种房型什么时候有房源，总不能每天打电话到售楼部问吧，小李就把电话和房型信息留到售楼部了，什么时候有这种房源了，售楼部会短信通知

要知道，售楼部不会只通知小李一个人，售楼部会把预留信息所有房型信息一致的人都通知一遍

在这个比较挫的例子中，小李包括每个买房的人都是订阅者，而售楼部就是发布者
```

其实我们都用过发布订阅模式，比如我们在 DOM 节点上绑定一个事件函数，就已经使用了

```js
document.body.addEventListener("click", function () {
  console.log(1)
})
```

但是这只是对发布订阅模式最简单的使用，在很多场景下我们经常会实现一些自定义事件来满足我们的需求

比如我们下面要防照 JQ 那种来写一个自定义事件监听器，需要监听一个事件，在该事件触发时执行其监听回调

#### 发布订阅模式实现事件监听器

发布订阅模式有很多种实现方式，下面我们用`class`来简单实现下

```js
class Emitter {
  constructor() {
    // _listener数组，key为自定义事件名，value为执行回调数组-因为可能有多个
    this._listener = []
  }

  // 订阅 监听事件
  on(type, fn) {
    // 判断_listener数组中是否存在该事件命
    // 存在将回调push到事件名对应的value数组中，不存在直接新增
    this._listener[type]
      ? this._listener[type].push(fn)
      : (this._listener[type] = [fn])
  }

  // 发布 触发事件
  trigger(type, ...rest) {
    // 判断该触发事件是否存在
    if (!this._listener[type]) return
    // 遍历执行该事件回调数组并传递参数
    this._listener[type].forEach((callback) => callback(...rest))
  }
}
```

如上所示，我们创建了一个`Emitter`类，并且添加了两个原型方法`on`和`trigger`，上面代码中均有注释，所以不过多解释了，基础不好的同学多看几遍自己敲一下，比较简单

使用时

```js
// 创建一个emitter实例
const emitter = new Emitter()

emitter.on("done", function (arg1, arg2) {
  console.log(arg1, arg2)
})

emitter.on("done", function (arg1, arg2) {
  console.log(arg2, arg1)
})

function fn1() {
  console.log("我是主程序")
  setTimeout(() => {
    emitter.trigger("done", "异步参数一", "异步参数二")
  }, 1000)
}

fn1()
```

如上所示，我们先创建一个 emitter 实例，接着注册事件，再触发事件，用法和上面 JQ 雷同，均解决了异步问题

Vue 的实现就是一个比较复杂的发布订阅模式，使用 Vue 的同学，上面的这个事件监听器，把`trigger`名字改成`emit`是不是就眼熟多了，当然我们这个比较简单，毕竟代码就那么六七行，不过理是这么个理

### 事件监听优/缺

**优点**

发布订阅模式实现的事件监听，我们可以绑定多个事件，每个事件也可以指定多个回调函数，还是比较符合模块化思想的，我们自写监听器时可以做很多优化从而更好的监控程序运行

**缺点**

整个程序变成了事件驱动，流程上来说或多或少都会有点影响，每次使用还得注册事件监听再进行触发挺麻烦的，代码也不太优雅，并不是事件驱动不好，毕竟需求只是 **解决异步问题** 而已，何况有更优解

## Promise

### Promise 简述

ES2015 (ES6)标准化和引入了 Promise 对象，它是异步编程的一种解决方案

简单来说就是用同步的方式写异步的代码，可用来解决回调问题

### Promise 特点

#### 特点一

Promise，承诺执行，Promise 对象的状态是不受外界影响的

Promise 对象代表一个异步操作，它有三种状态

- 进行中 (Pending)

- 已完成 (Resolved/Fulfilled)

- 已失败 (Rejected)

只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态

这就是 Promise 这个名字的由来，它的英语意思就是`承诺`，表示其他手段无法改变

#### 特点二

Promise 对象状态一旦改变，就不会再变

Promise 对象的状态改变，只有两种可能

- 从 Pending 变为 Resolved

- 从 Pending 变为 Rejected

只要这两种情况发生，状态就凝固，不会再变了，会一直保持这个结果

### Promise 使用

Promise 是一个构造函数，我们可以通过`new`关键字来创建一个 Promise 实例，也可以直接使用 Promise 的一些静态方法

#### new 一个 Promise 实例

**语法**

```js
new Promise( function(resolve, reject) {...});
```

**示例**

```js
function fn1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let num = Math.ceil(Math.random() * 10)
      if (num < 5) {
        resolve(num)
      } else {
        reject("数字太大")
      }
    }, 2000)
  })
}
```

如上所示，我们使用`new`关键字创建了一个 promise 实例，并在函数 fn1 中`return`了出来

`new Promise`创建了一个 promise 实例，Promise 构造函数会把一个叫做处理器函数(executor function)的函数作为它的参数

处理器函数接收两个参数分别是`resolve`和`reject`，这两个参数也是两个回调函数

`resolve` 函数在异步操作成功时调用，并将异步操作的结果，作为参数传递出去

`reject` 函数在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去

简单理解就是一个是成功回调，一个是失败回调

#### Promise.prototype.then()

Promise 对象有一个原型方法`then`

Promise 实例生成以后，可以用`then`方法指定`resolved`状态和`reject`状态的回调函数

```js
Promise.prototype.then(onFulfilled[, onRejected])
```

`then`方法接收两个回调 onFulfilled 和 onRejected

- onFulfilled-可选

  - 当 Promise 变成已完成状态(fulfilled)时调用的回调函数
  - 该函数有一个参数，即接受的最终结果(the fulfillment value)
  - 如果该参数不是函数，则会在内部被替换为 `(x) => x`，即原样返回 promise 最终结果的函数

- onRejected-可选
  - 当 Promise 变成接受状态或拒绝状态(rejected)时调用的回调函数
  - 该函数有一个参数，即拒绝的原因(rejection reason)
  - 如果该参数不是函数，则会在内部被替换为一个 `Thrower` 函数(it throws an error it received as argument)

`then`方法在接收一个 promise 实例后会返回一个新的 Promise 实例(并不是原来那个 Promise 实例)，且原来的 promise 实例的返回值将作为参数传入这个新 Promise 的`resolve`函数

那么既然`then`方法返回一个新的 promise 实例，所以我们可以接着使用`then`方法，即链式调用，也被称为 **复合(composition)**操作

接上面的示例，函数 fn1 会返回一个 promise 实例

```js
fn1().then(
  (data) => {
    console.log(data)
  },
  (err) => {
    console.log(err)
  }
)
```

如上所示，我们使用了`then`方法的两个参数

第一个参数回调我们很常用，其实就是 Promise 变成已完成状态且拿到传递的值

第二个参数回调就是 Promise 变成接受状态或拒绝状态且拿到错误参数，我们可能用的少，一般都是用`catch`方法，`then`方法的第二个参数 onRejected 和`catch`还是有一些细微区别的，下面会提到

根据 Promises/A+中对`then`方法的定义，我们来看`then`方法的特点

**首先`then` 方法必须返回一个 `promise` 对象(划重点)**

链式调用的原理，不论是何种情况 then 方法都会返回一个新的 Promise 对象，这样才会有下个 then 方法

**如果`then`方法中返回的是一个普通值(如 Number、String 等)就使用此值包装成一个新的 Promise 对象返回**

就像下面这个例子，`then`方法接收 Promise 对象，`then`方法中返回一个普通值时，下一个`then`中是可以接到的

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => {
  return 2 // 返回了一个普通值
}).then((data) => {
  console.log(data) // 2
})
```

**如果`then`方法中没有`return`语句，就返回一个用 Undefined 包装的 Promise 对象**

如下面例子的输出结果

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => {
  // 无return语句
}).then((data) => {
  console.log(data) // undefined
})
```

**如果`then`方法中出现异常，则调用失败态方法(reject)跳转到下一个`then`的 onRejected**

`then`方法的第二个参数 onRejected 是监测不到当前`then`方法回调异常的，规范中定义当前`then`方法出现异常则调用失败态方法(reject)流转到下一个`then`的 onRejected

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => 2)
  .then(
    (data) => {
      throw "this is err"
    },
    (err) => {
      console.log("err1:" + err)
    }
  )
  .then(
    (data) => {
      console.log(data)
    },
    (err) => {
      console.log("err2:" + err) // err2:this is err
    }
  )
```

**如果`then`方法没有传入任何回调，则继续向下传递(即所谓的值穿透)**

下面示例，在第一个`then`方法之后连续调用了两个空的`then`方法 ，没有传入任何回调函数，也没有返回值，此时 Promise 会将值一直向下传递，直到接收处理，这就是所谓的值穿透

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => 2)
  .then()
  .then()
  .then((data) => {
    console.log(data) // 2
  })
```

**如果`then`方法中返回了一个 Promise 对象，那就以这个对象为准，返回它的结果**

话不多说，来看示例

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => {
  return new Promise((resolve, reject) => {
    resolve(2)
  })
}).then((data) => {
  console.log(data) // 2
})
```

#### Promise.prototype.catch()

除了原型方法`then`之外，Promise 对象还有一个`catch`的原型方法

`catch`方法可以用于 promise 组合中的错误处理，此方法返回一个 Promise，并且处理拒绝的情况

```js
p.catch(onRejected)

p.catch(function (reason) {
  // 拒绝
})
```

- onRejected
  - 当 Promise 被 rejected 时，被调用的一个回调函数，该函数拥有一个参数为失败原因或错误信息

简单理解就是捕获异常，promise 组合中抛出了错误或 promise 组合中出现 rejected 会被捕获

同样接最上面的示例，还使用 fn1 函数

```js
fn1()
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

使用这种方式捕获错误或失败是不是比`then`方法的第二个参数看着舒服了点呢，毕竟 Promise 就是链式到底

同样也需要注意一点，`catch`方法也返回一个新的 promise 实例，如果 `onRejected`回调抛出一个错误或返回一个本身失败的 Promise ，通过 `catch` 返回的 Promise 会被 rejected，否则，它就是一个成功的(resolved)promise 实例

和上面的`then`方法中的第二个参数几乎是一致的，我们看例子

```js
fn1()
  .catch((err) => {
    console.log(err)
    return err
  })
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

上面的 fn1 函数有一半的几率返回一个 rejected，当返回一个 rejected 时下面的`then`方法回调中同样会输出，因为我们在第一个`catch`中只 return 了错误信息，并没有抛出错误或者返回一个失败 promise，所以第一个`catch`执行返回的 promise 对象是 resolveing

#### Promise.prototype.finally()

finally，英文是`最后`的意思，此方法是`ES2018`的标准

原型方法`finally`，我们使用的可能不多，语法如下

```js
p.finally(onFinally)

p.finally(function () {
  // 返回状态为(resolved 或 rejected)
})
```

一句话即可解释`finally`，在 promise 结束时，不管成功还是失败都将执行其`onFinally`回调，该回调无参数

适用于同样的语句需要在`then()`和`catch()`中各写一次的情况

#### Promise.resolve()

一句话概括 Promise.resolve()方法，接收一个值，将现有对象转为 Promise 对象

```js
Promise.resolve(value)
```

如下所示，该值可为任意类型，也可是一个 Promise 对象

```js
const p = Promise.resolve(123)

Promise.resolve(p).then((value) => {
  console.log(value) // 123
})
```

#### Promise.reject()

`Promise.reject()`方法同上面`Promise.resolve()`一样，只不过是返回一个带有拒绝原因的`Promise`对象

```js
Promise.reject(123)
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log("err:" + err)
  })

// err:123
```

#### Promise.all()

`Promise.all(iterable)`用于将多个 Promise 实例包装成一个新的 Promise 实例，参数为一组 Promise 实例组成的数组

iterable 类型为 ES6 标准引入，代表可迭代对象，`Array`、`Map`和`Set`都属于`iterable`类型 ，iterable 下面我们会讲到，这里我们就先把这个参数理解成数组就可以，稍后配合下面的 iterable 来理解

```js
let p1 = Promise.resolve(1)
let p2 = Promise.resolve(2)
let p3 = Promise.resolve(3)

let p = Promise.all([p1, p2, p3])

p.then((data) => {
  console.log(data) // [1,2,3]
})
```

如上所示，当 p1, p2, p3 状态都 Resolved 的时候，p 的状态才会 Resolved

只要有一个实例 Rejected ，此时第一个被 Rejected 的实例返回值就会传递给 P 的回调函数

```js
let p1 = Promise.resolve(1)
let p2 = Promise.resolve(2)
let p3 = Promise.reject(3)

let p = Promise.all([p1, p2, p3])
p.then((data) => {
  console.log(data)
}).catch((err) => {
  console.log("err:" + err) // 3
})
```

应用场景在我们有一个接口，需要其他两个或多个接口返回的数据作为参数时会多一些

#### Promise.race()

`Promise.race(iterable)`和上面`Promise.all(iterable)`类似

`all`方法是迭代对象中状态全部改变才会执行

`race`方法正好相反，只要迭代对象中有一个状态改变了，它的状态就跟着改变，并将那个改变状态实例的返回值传递给回调函数

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "1")
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "2")
})

Promise.race([p1, p2]).then((value) => {
  console.log(value) // 2
})
```

#### Promise.try()

开发中，经常遇到一种情况：不知道或不想区分，函数 fn 是同步函数还是异步函数，但想用 Promise 来处理它

因为这样就可以不管 fn 是不是异步操作，都用 then 方法指定下一步流程，用 catch 方法处理 fn 抛出的错误

我们可能会使用`Promise.resolve`把它转换成 Promise 对象

```js
let fn = () => console.log("fn")
Promise.resolve(fn).then((cb) => cb())
console.log("hahaha")

// hahaha
// fn
```

但是这样有一个问题，如果函数 fn 是同步的，那么这波操作会把它转成异步，如上输出

那么有没有一种方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 呢？当然可以

我们可以这样

```js
const fn = () => console.log("fn")
;(() => new Promise((resolve) => resolve(fn())))()
  .then(() => {
    console.log(222)
  })
  .catch((err) => {
    console.log(err)
  })

console.log("111")

// fn
// 111
// 222
```

也可以这样

```js
const fn = () => console.log("fn")
;(async () => fn())()
  .then(() => {
    console.log(222)
  })
  .catch((err) => {
    console.log(err)
  })

console.log("111")

// fn
// 111
// 222
```

但是，代码有点诡异，不优雅

来看使用`try`方法

```js
const fn = () => console.log("fn")
Promise.try(fn)
  .then(() => {
    console.log(222)
  })
  .catch((err) => {
    console.log(err)
  })

console.log("111")

// fn
// 111
// 222
```

如上所示，简洁明了，还是很实用的

其实，`Promise.try`就是模拟 try 代码块，就像`promise.catch`模拟的是 catch 代码块

最后 `Promise.try` 并不是 Javascript 的一部分

早在 16 年有过这个提案，有兴趣的同学可以了解下，现在也没下文了，并没有被纳入标准

如果想要使用的话，需要使用 Promise 库 Bluebird、Q 等，或引入 Polyfill

虽然没有被纳入标准，但并不代表它不好用，大家自行体验

想要了解更多此方法推荐大家看参考链接【4】【5】

#### onRejected 和 catch 区别

上面提到了`promise.then(onFulfilled, onRejected)`中的第二个参数 onRejected 和`catch`

看到这大家可能会问，同样都是捕获异常它们的区别在哪

其实`promise.then(onFulfilled, onRejected)` 在 `onFulfilled`回调中发生异常的话，在`onRejected`中是捕获不到这个异常的，使用`catch`可以捕获到前面的 onFulfilled 的异常

其实这不算个缺点，我们完全可以在末尾多加一个`then`从而达到和`catch`相同的作用，如下

```js
Promise.reject(1)
  .then(() => {
    console.log("我是对的")
  })
  .then(null, (err) => {
    console.log("err:" + err) // err:1
  })

// 等价于

Promise.reject(1)
  .then(() => {
    console.log("我是对的")
  })
  .catch((err) => {
    console.log("err:" + err) // err:1
  })
```

就这么点区别，不过大部分人都喜欢直接使用`catch`罢了

#### then 中抛错未处理

如果在 then 中抛错，而没有对错误进行处理(catch)，那么会一直保持 reject 状态，直到 catch 了错误

我们来看一段代码

```js
Promise.resolve()
  .then(() => {
    console.log(a)
    console.log("Task 1")
  })
  .then(() => {
    console.log("Task 2")
  })
  .catch((err) => {
    console.log("err:" + err)
  })
  .then(() => {
    console.log("finaltask")
  })

// err:ReferenceError: a is not defined
// finaltask
```

我们看上面代码，我们在第一个`then`中输出了一个未声明的变量

输出结果先走了`catch`然后走了最后一个`then`，第一个`then`中抛出错误并跳过了第二个`then`

也就是说如果我们没有处理这个错误(无 catch)的话，就不会往下执行了

可参考下图

![image-20200201231714043](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200201231714043.png)

promise 的缺点之一就是无法让 promise 中断，利用这个特性可以让 Promise 中断执行，也算一种办法吧

#### 异步回调中抛错 catch 捕捉不到

首先我们看在 Promise 对象的处理器函数中直接抛出错误

```js
const p = new Promise((resolve, reject) => {
  throw new Error("这是一个错误")
})
p.catch((error) => {
  console.log(error)
})
```

按照上述内容来看，在 Promise 对象的处理器函数中直接抛出错误，`catch`是可以捕捉到的

在下面代码，在 Promise 对象的处理器函数中模拟一个异步抛错

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    throw new Error("这是一个错误")
  }, 0)
})
p.catch((error) => {
  console.log(error)
})
```

这种情况`catch`是捕捉不到的，这是为什么呢？先想后看，再做不难

**原因**

JS 事件循环列表有宏任务与微任务之分，setTimeOut 是宏任务， promise 是微任务，执行顺序不同

那么这段代码的执行顺序是：

1. 代码执行栈进入 promise 触发 setTimeOut，setTimeOut 回调函数入宏任务队列
2. 代码执行 promise 的 catch 方法，入微任务队列，此时 setTimeOut 回调还没有执行
3. 执行栈检查发现当前微任务队列执行完毕，开始执行宏任务队列
4. 执行`throw new Error('这是一个错误')` 此时这个异常其实是在 promise 外部抛出的

**解决**

使用`try catch`捕获异常主动触发`reject`

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      throw new Error("这是一个错误")
    } catch (e) {
      reject(e)
    }
  }, 0)
})
p.catch((error) => {
  console.log(error)
})
```

### 手写 Promise—符合 Promises/A+规范

#### 为什么要手写 Promise

Promise 源码逻辑相对来说不算简单，可能我们只会使用，并不清楚其原理

自己实现一遍会加深我们对 Promise 的理解，也可以加强我们 JS 的功底

更何况手写实现 Promise 是一道前端经典的面试题，此处必然不用多说

#### Promises/A+

了解了 Promise 的基础用法后，我们来一步步倒推实现 Promise

Promises/A+标准是一个开放、健全且通用的 JavaScript Promise 标准，由开发者制定，供开发者参考

很多 Promise 三方库都是按照 Promises/A+标准实现的

so，此次实现我们严格 Promises/A+标准，包括完成后我们会使用开源社区提供的测试包来测试

简单来说，测试通过的话，足以证明代码符合 Promises/A+标准，是合法的、完全可以上线提供给他人使用的

更多 Promises/A+标准请看参考链接【6】【7】

#### 构造方法核心基础搭建

Promise 的用法上面已经详细讲了，如果阅读仔细的话，我们会知道

- Promise 有三种状态进行中 (Pending)、已完成 (Resolved/Fulfilled)和已失败 (Rejected)
- Promise 是一个构造方法，实例化 Promise 时传入一个函数作为处理器
  - 处理器函数有两个参数(resolve 和 reject)分别将结果变为成功态和失败态
  - Promise 对象执行成功了要有一个结果，通过 resolve 传递出去，失败的话失败原因通过 reject 传递出入
- Promise 的原型上定义着 then 方法

那么根据我们上面的这些已知需求我们可以写出一个基础的结构(写法千千万，喜欢 class 也可以用 class)

```js
function Promise(executor) {
  // 状态描述 pending resolved rejected
  this.state = "pending"
  // 成功结果
  this.value = undefined
  // 失败原因
  this.reason = undefined

  function resolve(value) {}

  function reject(reason) {}
}

Promise.prototype.then = function (onFulfilled, onRejected) {}
```

如上所示，我们创建了一个 Promise 构造方法，`state`属性保存了 Promise 对象的状态，使用`value`属性保存 Promise 对象执行成功的结果，失败原因使用`reason`属性保存，这些命名完全贴合 Promises/A+标准

接着我们在构造函数中创建了`resolve`和`reject`两个方法，然后在构造函数的原型上创建了一个`then`方法，以备待用

#### 初始化实例 executor 立即执行

我们知道，在创建一个 Promise 实例时，处理器函数(executor)是会立即执行的，所以我们更改代码

```js
function Promise(executor) {
  this.state = "pending"
  this.value = undefined
  this.reason = undefined

  // 让其处理器函数立即执行
  try {
    executor(resolve, reject)
  } catch (err) {
    reject(err)
  }

  function resolve(value) {}
  function reject(reason) {}
}
```

#### resolve&reject 回调实现

Promises/A+规范中规定，当 Promise 对象已经由 pending 状态改变为成功态(resolved)或失败态(rejected)后不可再次更改状态，也就是说成功或失败后状态不可更新已经凝固

因此我们更新状态时要判断，如果当前状态是 pending(等待态)才可更新，由此我们来完善`resolve`和`reject`方法

```js
let _this = this

function resolve(value) {
  if (_this.state === "pending") {
    _this.value = value
    _this.state = "resolved"
  }
}

function reject(reason) {
  if (_this.state === "pending") {
    _this.reason = reason
    _this.state = "rejected"
  }
}
```

如上所示，首先我们在 Promise 构造函数内部用变量`_this`托管构造函数的`this`

接着我们在`resolve`和`reject`函数中分别加入了判断，因为只有当前态是 pending 才可进行状态更改操作

同时将成功结果和失败原因都保存到对应的属性上

然后将 state 属性置为更新后的状态

#### then 方法基础实现

接着我们来简单实现`then`方法

首先`then`方法有两个回调，当 Promise 的状态发生改变，成功或失败会分别调用`then`方法的两个回调

所以，then 方法的实现看起来挺简单，根据 state 状态来调用不同的回调函数即可

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (this.state === "resolved") {
    if (typeof onFulfilled === "function") {
      onFulfilled(this.value)
    }
  }
  if (this.state === "rejected") {
    if (typeof onRejected === "function") {
      onRejected(this.reason)
    }
  }
}
```

如上所示，由于`onFulfilled & onRejected`两个参数都不是必选参，所以我们在判断状态后又判断了参数类型，当参数不为函数类型，就不执行，因为在 Promises/A+规范中定义非函数类型可忽略

#### 让 Promise 支持异步

写到这里，我们可能会觉得，咦？Promise 实现起来也不难嘛，这么快就有模有样了，我们来简单测试下

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => console.log(data)) // 1
```

嗯，符合预期，再来试下异步代码

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }，1000);
})

p.then(data => console.log(data)) // 无输出
```

问题来了，Promise 一个异步解决方案被我们写的不支持异步。。。

我们来分析下，本来是等 1000ms 后执行`then`方法，运行上面代码发现没有结果，哪里有问题呢？

setTimeout 函数让`resolve`变成了异步执行，有延迟，调用`then`方法的时候，此刻状态还是等待态(pending)，`then`方法即没有调用`onFulfilled`也没有调用`onRejected`

嗯，清楚原因我们开始改造，如果是你，你会如何解决呢，此处可思考 40 秒，想一个可实施的大致思路

**小提示：** 可以参考上文的发布订阅模式，如果 40 秒还没有思路，嗯，有待提高

|

|

-->为了让您小小活动一下左脑并活跃下气氛，我也是煞费苦心(**ps:**都看到这了，不点个赞鼓励下就太没劲了噻 😄)

|

|

回归正题，我们来解决这个问题

我们可以参照发布订阅模式，在执行`then`方法时如果还在等待态(pending)，就把回调函数临时寄存到队列(就是一个数组)里，当状态发生改变时依次从数组中取出执行就好了

思路有了，我们来实现下

首先，我们要在构造方法中新增两个 Array 类型的数组，用于存放成功和失败的回调函数

```js
function Promise(executor) {
  let _this = this
  this.state = "pending"
  this.value = undefined
  this.reason = undefined
  // 保存成功回调
  this.onResolvedCallbacks = []
  // 保存失败回调
  this.onRejectedCallbacks = []
  // ...
}
```

我们还需要改善`then`方法，在`then`方法执行时如果状态是等待态，就将其回调函数存入对应数组

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  // 新增等待态判断，此时异步代码还未走完，回调入数组队列
  if (this.state === "pending") {
    if (typeof onFulfilled === "function") {
      this.onResolvedCallbacks.push(onFulfilled)
    }
    if (typeof onRejected === "function") {
      this.onRejectedCallbacks.push(onRejected)
    }
  }

  // 以下为之前代码块
  if (this.state === "resolved") {
    if (typeof onFulfilled === "function") {
      onFulfilled(this.value)
    }
  }
  if (this.state === "rejected") {
    if (typeof onRejected === "function") {
      onRejected(this.reason)
    }
  }
}
```

如上所示，我们改写`then`方法，除了判断成功态(resolved)、失败态(rejected)，我们又加了一个等待态(pending)判断，当状态为等待态时，异步代码还没有走完，那么我们把对应的回调先存入准备好的数组中即可

最那么，就差最后一步执行了，我们在`resolve`和`reject`方法中调用即可

```js
function resolve(value) {
  if (_this.state === "pending") {
    _this.value = value
    // 遍历执行成功回调
    _this.onResolvedCallbacks.forEach((cb) => cb(value))
    _this.state = "resolved"
  }
}

function reject(reason) {
  if (_this.state === "pending") {
    _this.reason = reason
    // 遍历执行失败回调
    _this.onRejectedCallbacks.forEach((cb) => cb(reason))
    _this.state = "rejected"
  }
}
```

到了这里，我们已经实现了 Promise 的异步解决，赶快测试下

#### 实现 Promise 经典的链式调用

Promise 的`then`方法可以链式调用，这也是 Promise 的精华之一，在实现起来也算是比较复杂的地方了

首先我们要理清楚`then`的需求是什么，这需要仔细看 Promises/A+规范中对`then`方法的返回值定义及 Promise 解决过程，当然你如果仔细阅读了上文`then`方法的使用大概也清楚了，我们在这里再次总结下

- **首先`then` 方法必须返回一个 `promise` 对象(划重点)**

- **如果`then`方法中返回的是一个普通值(如 Number、String 等)就使用此值包装成一个新的 Promise 对象返回**

- **如果`then`方法中没有`return`语句，就返回一个用 Undefined 包装的 Promise 对象**

- **如果`then`方法中出现异常，则调用失败态方法(reject)跳转到下一个`then`的 onRejected**

- **如果`then`方法没有传入任何回调，则继续向下传递(值穿透)**

- **如果`then`方法中返回了一个 Promise 对象，那就以这个对象为准，返回它的结果**

嗯，到此我们需求已经明确，开始代码实现

需求中说如果`then`方法没有传入任何回调，则继续向下传递，但是每个`then`中又返回一个新的 Promise，也就是说当`then`方法中没有回调时，我们需要把接收到的值继续向下传递，这个其实好办，只需要在判断回调参数不为函数时我们把他变成回调函数返回普通值即可

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err
        }
  // ...
}
```

我们上面`then`实现中，在每个可执行处都加了参数是否为函数的类型校验，但是我们这里在`then`方法开头统一做了校验，就不需要参数校验了

现在的`then`方法变成了

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err
        }

  if (this.state === "pending") {
    this.onResolvedCallbacks.push(onFulfilled)
    this.onRejectedCallbacks.push(onRejected)
  }

  if (this.state === "resolved") {
    onFulfilled(this.value)
  }
  if (this.state === "rejected") {
    onRejected(this.reason)
  }
}
```

接着来

既然每个`thne`都反回一个新的 Promise，那么我们就先在`then`中创建一个 Promise 实例返回，开始改造

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err
        }

  let promise2 = new Promise((resolve, reject) => {
    if (this.state === "pending") {
      this.onResolvedCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
    }

    if (this.state === "resolved") {
      onFulfilled(this.value)
    }
    if (this.state === "rejected") {
      onRejected(this.reason)
    }
  })
  return promise2
}
```

我们在`then`方法中先实例化了一个 Promise 对象并返回，我们把原来写的代码放到该实例的处理器函数中

我们把原来写的代码放到该实例的处理器函数中

接着在每个执行函数处使用`try..catch`语法，try 中`resolve`执行结果，catch 中`reject`异常，原来的`then`方法中有 resolved、rejected 和 pending 三种逻辑判断，如下

在 resolved 状态判断时，rejected 和 resolved 逻辑一致

```js
if (this.state === "resolved") {
  try {
    // 拿到返回值resolve出去
    let x = onFulfilled(this.value)
    resolve(x)
  } catch (e) {
    // catch捕获异常reject抛出
    reject(e)
  }
}
```

pending 状态判断，逻辑也和 resolved 相似，但是由于此处为了处理异步，我们在这里做了 push 操作，所以我们 push 时在 onFulfilled 和 onRejected 回调外面再套一个回调做操作即可，都是 JS 惯用小套路，不过分解释

```js
if (this.state === "pending") {
  // push(onFulfilled)
  // push(()=>{ onFulfilled() })
  // 上面两种执行效果一致，后者可在回调中加一些其他功能，如下
  this.onResolvedCallbacks.push(() => {
    try {
      let x = onFulfilled(this.value)
      resolve(x)
    } catch (e) {
      reject(e)
    }
  })
  this.onRejectedCallbacks.push(() => {
    try {
      let x = onRejected(this.value)
      resolve(x)
    } catch (e) {
      reject(e)
    }
  })
}
```

再接下来我们开始处理根据上一个`then`方法的返回值来生成新 Promise 对象，这块逻辑复杂些，规范中可以抽离出一个方法来做这件事，我们来照做

```js
/**
 * 解析then返回值与新Promise对象
 * @param {Object} 新的Promise对象，就是我们创建的promise2实例
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve promise2处理器函数的resolve
 * @param {Function} reject promise2处理器函数的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  // ...
}
```

我们来一步步分析完善 resolvePromise 函数

**避免循环引用，当 then 的返回值与新生成的 Promise 对象为同一个(引用地址相同)，则抛出 TypeError 错误**

例：

```js
let promise2 = p.then((data) => {
  return promise2
})

// TypeError: Chaining cycle detected for promise #<Promise>
```

如果返回了自己的 Promise 对象，状态永远为等待态(pending)，再也无法成为 resolved 或是 rejected，程序就死掉了，因此要先处理它

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("请避免Promise循环引用"))
  }
}
```

**判断 x 类型，分情况处理**

当 x 是一个 Promise，就执行它，成功即成功，失败即失败，如果`x`是一个对象或是函数，再进一步处理它，否则就是一个普通值

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("请避免Promise循环引用"))
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 可能是个对象或是函数
  } else {
    // 是个普通值
    resolve(x)
  }
}
```

如果 x 是个对象，尝试将对象上的 then 方法取出来，此时如果报错，那就将 promise2 转为失败态

在这里 catch 防止报错是因为 Promise 有很多实现，假设另一个人实现的 Promise 对象使用`Object.defineProperty()`在取值时抛错，我们可以防止代码出现 bug

```js
// resolvePromise方法内部片段

if (x !== null && (typeof x === "object" || typeof x === "function")) {
  // 可能是个对象或是函数
  try {
    // 尝试取出then方法引用
    let then = x.then
  } catch (e) {
    reject(e)
  }
} else {
  // 是个普通值
  resolve(x)
}
```

如果对象中有`then`，且`then`是函数类型，就可以认为是一个 Promise 对象，之后，使用`x`作为其 this 来调用执行`then`方法

```js
// resolvePromise方法内部片段

if (x !== null && (typeof x === "object" || typeof x === "function")) {
  // 可能是个对象或是函数
  try {
    // 尝试取出then方法引用
    let then = x.then
    if (typeof then === "function") {
      // then是function，那么执行Promise
      then.call(
        x,
        (y) => {
          resolve(y)
        },
        (r) => {
          reject(r)
        }
      )
    } else {
      resolve(x)
    }
  } catch (e) {
    reject(e)
  }
} else {
  // 是个普通值
  resolve(x)
}
```

此时，我们还要考虑到一种情况，如果 Promise 对象转为成功态或是失败时传入的还是一个 Promise 对象，此时应该继续执行，直到最后的 Promise 执行完，例如下面这种

```js
Promise.resolve(1).then((data) => {
  return new Promise((resolve, reject) => {
    // resolve传入的还是Promise
    resolve(
      new Promise((resolve, reject) => {
        resolve(2)
      })
    )
  })
})
```

解决这种情况，我们可以采用递归，把调用 resolve 改写成递归执行 resolvePromise，这样直到解析 Promise 成一个普通值才会终止

```js
// resolvePromise方法内部片段
if (x !== null && (typeof x === "object" || typeof x === "function")) {
  // 可能是个对象或是函数
  try {
    let then = x.then
    if (typeof then === "function") {
      then.call(
        x,
        (y) => {
          // 递归调用，传入y若是Promise对象，继续循环
          resolvePromise(promise2, y, resolve, reject)
        },
        (r) => {
          reject(r)
        }
      )
    } else {
      resolve(x)
    }
  } catch (e) {
    reject(e)
  }
} else {
  // 普通值结束递归
  resolve(x)
}
```

规范中定义，如果 resolvePromise 和 rejectPromise 都被调用，或者多次调用同一个参数，第一个调用优先，任何进一步的调用都将被忽略，为了让成功和失败只能调用一个，我们接着完善，设定一个 called 来防止多次调用

```js
// resolvePromise方法内部片段
let called
if (x !== null && (typeof x === "object" || typeof x === "function")) {
  // 可能是个对象或是函数
  try {
    let then = x.then
    if (typeof then === "function") {
      then.call(
        x,
        (y) => {
          if (called) return
          called = true
          // 递归调用，传入y若是Promise对象，继续循环
          resolvePromise(promise2, y, resolve, reject)
        },
        (r) => {
          if (called) return
          called = true
          reject(r)
        }
      )
    } else {
      resolve(x)
    }
  } catch (e) {
    if (called) return
    called = true
    reject(e)
  }
} else {
  // 普通值结束递归
  resolve(x)
}
```

到此，我们算是实现好了`resolvePromise`方法，我们来调用它实现完整的`then`方法，在原来的原型方法`then`中我们`return`了一个 promise2，这个实例处理器函数的三种状态判断中把`resolve`处替换成`resolvePromise`方法即可

那么，此时`then`方法实现完成了吗？

当然还没有，我们都知道，Promise 中处理器函数是同步执行，而`then`方法是异步，但是我们完成这个还是同步

解决这个问题其实也很简单，仿照市面上大多数 Promise 库的做法，使用 setTimeout 模拟，我们在`then`方法内执行处的所有地方使用 setTimeout 变为异步即可(只是这样做和浏览器自带的 Promises 唯一的区别就是浏览器的 Promise..then 是微任务，我们用 setTimeout 实现是宏任务)，不过这也是大多数 Promise 库的做法，如下

```js
setTimeout(() => {
  try {
    let x = onFulfilled(value)
    resolvePromise(promise2, x, resolve, reject)
  } catch (e) {
    reject(e)
  }
}, 0)
```

现在我们的终极版`then`方法就大功告成了

```js
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err
        }

  let promise2 = new Promise((resolve, reject) => {
    // 等待态判断，此时异步代码还未走完，回调入数组队列
    if (this.state === "pending") {
      this.onResolvedCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      })

      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      })
    }
    if (this.state === "resolved") {
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)
    }
    if (this.state === "rejected") {
      setTimeout(() => {
        try {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0)
    }
  })
  return promise2
}
```

#### catch 实现

实现了最复杂的`then`方法后，`catch`实现非常简单，一看就懂了

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```

#### 代码测试

开源社区提供了一个包用于测试我们的代码是否符合 Promises/A+规范：`promises-aplus-tests`

首先我们要为该测试包提供一个`deferred`钩子，用于测试

如下，将下面代码防止我们的`Promise.js`文件末尾即可

```js
// promises-aplus-tests测试
Promise.defer = Promise.deferred = function () {
  let defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}
try {
  module.exports = Promise
} catch (e) {}
```

接着，安装这个包

```js
npm install promises-aplus-tests -D
```

执行测试

```js
npx promises-aplus-tests Promise.js
```

静等片刻，如果控制台没有爆红就是成功了，符合规范，如图所示

![image-20200206222942803](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200206222942803.png)

#### 完整代码

篇幅已经很长了，后续还有其他内容，所以就实现了比较核心的 Promise 及 then 和 catch 方法

其他的 resolve/reject/race/all 等比较简单，不在这里描述了

给大家贴个我这边 Promise 多个方法实现的地址，大家有兴趣自行看代码吧，注释写的很详细了，也就大概 200 多行代码

- Github：https://github.com/isboyjc/promise

### Promise 优/缺

**优点**

Promise 用同步的方式写异步的代码，避免了层层嵌套的回调函数

Promise 对象提供了统一的接口，使得控制异步操作更加容易

链式操作，可以在 then 中继续写 Promise 对象并返回，然后继续调用 then 来进行回调操作

**缺点**

Promise 对象一旦新建就会立即执行，无法中途取消

若不设置回调函数，Promise 内部会抛出错误，不会流到外部

当处于 pending 状态时，无法得知当前处于哪一阶段

用多了 Promise 后代码一眼看上去都是 promise 的 API，而且链式语法总觉得不好看，不优雅

## Generator

Generator 是协程在 ES6 的实现，最大的特点就是可以交出函数的执行权

我们可以通过 yield 关键字，把函数的执行流挂起，为改变执行流程提供了可能，从而为异步编程提供解决方案

Generator 的英文是生成器

想要了解生成器(Generator)，还是绕不过迭代器(Iterator)这个概念，我们先来简单介绍下

### 迭代器(Iterator)

#### Iterator 简介

迭代器是一种接口，也可以说是一种规范

js 中不同的数据类型如(Array/Object/Set)等等遍历方式都各有不同，比如对象遍历我们会使用`for..in..`，数组可以使用`for循环/for..in../forEach`等等

那么有没有统一的方式遍历这些数据呢？这就是迭代器存在的意义，它可以提供统一的遍历数据的方式，只要在想要遍历的数据结构中添加一个支持迭代器的属性即可

#### Iterator 语法

```js
const obj = {
  [Symbol.iterator]: function () {},
}
```

`[Symbol.iterator]` 属性名是固定的写法，只要拥有了该属性的对象，就能够用迭代器的方式进行遍历

迭代器的遍历方法是首先获得一个迭代器的指针，初始时该指针指向第一条数据之前

接着通过调用 `next` 方法，改变指针的指向，让其指向下一条数据

每一次的 `next` 都会返回一个对象，该对象有两个属性

- value 代表想要获取的数据

- done 布尔值，false 表示当前指针指向的数据有值，true 表示遍历已经结束

#### Iterator 详解

在 JS 中，`Array/Set/Map/String`都默认支持迭代器

由于数组和集合都支持迭代器，所以它们都可以用同一种方式来遍历

es6 中提供了一种新的循环方法叫做`for-of`，它实际上就是使用迭代器来进行遍历

换句话说只有支持了迭代器的数据结构才能使用`for-of`循环

**数组中使用迭代器遍历**

```js
let arr = [{ num: 1 }, 2, 3]
let it = arr[Symbol.iterator]() // 获取数组中的迭代器
console.log(it.next()) // { value: Object { num: 1 }, done: false }
console.log(it.next()) // { value: 2, done: false }
console.log(it.next()) // { value: 3, done: false }
console.log(it.next()) // { value: undefined, done: true }
```

数组是支持迭代器遍历的，所以可以直接获取其迭代器，集合也是一样

**集合中使用迭代器遍历**

```js
let list = new Set([1, 3, 2, 3])
let it = list.entries() // 获取set集合中自带的的迭代器
console.log(it.next()) // { value: [ 1, 1 ], done: false }
console.log(it.next()) // { value: [ 3, 3 ], done: false }
console.log(it.next()) // { value: [ 2, 2 ], done: false }
console.log(it.next()) // { value: undefined, done: true }
```

集合与数组不同的是，我们可以使用 Set 中的`entries`方法获取迭代器

Set 集合中每次遍历出来的值是一个数组，里面的第一和第二个元素都是一样的

**自定义对象中使用迭代器遍历**

首先自定义的对象没有迭代器属性，所以不支持迭代器迭代，我们也都知道`for..of`是无法遍历对象的，原因就在这里，因为`for..of`是使用迭代器迭代，所以对象不能用`for..of`

既然知道是因为自定义对象无迭代器属性，那么我们可以为它加上`Symbol.iterator`这样一个属性，并为它实现一个迭代器方法，如下

```js
let obj = {
  name: "tom",
  age: 18,
  gender: "男",
  intro: function () {
    console.log("my name is " + this.name)
  },
  [Symbol.iterator]: function () {
    let i = 0
    // 获取当前对象的所有属性并形成一个数组
    let keys = Object.keys(this)
    return {
      next: function () {
        return {
          // 外部每次执行next都能得到数组中的第i个元素
          value: keys[i++],
          // 如果数组的数据已经遍历完则返回true
          done: i > keys.length,
        }
      },
    }
  },
}

for (let attr of obj) {
  console.log(attr)
}
```

如上所示，加上`[Symbol.iterator]`这个迭代器属性我们自定义了一个迭代器方法，就可以使用`for..of`方法了

#### Iterator 作用

Iterator 的作用有三个：

- 为各种数据结构，提供一个统一的、简便的访问接口
- 使得数据结构的成员能够按某种次序排列
- ES6 创造了一种新的遍历命令`for..of`循环，Iterator 接口主要供`for..of`消费

Iterator 我们就介绍到这里，到这就理解上文 Iterator 参数是什么了吧，就是代表一个有迭代器属性的参数

### 初识 Generator

Generator 其实也是一个函数，只不过是一个特殊的函数

普通函数，你运行了这个函数，函数内部不会停，直到这个函数结束

Generator 这个函数特殊之处就是，中间可以停

#### Generator 函数特点

```js
function* generatorFn() {
  console.log("a")
  yield "1"
  console.log("b")
  yield "2"
  console.log("c")
  return "3"
}

let it = generatorFn()
it.next()
it.next()
it.next()
it.next()
```

上面这个示例就是一个 Generator 函数，首先我们观察它的特点，一个一个进行分析

- 不同于普通函数，Generator 函数在`function`后面，函数名之前有个`*`
  - `*`用来表示函数为 Generator 函数
  - 写法很多，`function* fn()`、`function*fn()`和`function *fn()`都可以
- 函数内部有`yield`字段
  - `yield`用来定义函数内部的状态，并让出执行权
  - 这个关键字只能出现在生成器函数体内，但是生成器中也可以没有 yield 关键字，函数遇到 yield 的时候会暂停，并把 yield 后面的表达式结果抛出去
- 调用后其函数返回值使用了`next`方法
  - 调用 Generator 函数和调用普通函数一样，在函数名后面加上()即可
  - Generator 函数不会像普通函数一样立即执行，而是返回一个指向内部状态对象的指针
  - 所以要调用迭代器对象 Iterator 的 `next` 方法，指针就会从函数头部或者上一次停下来的地方开始执行
  - `next` 方法其实就是将代码的控制权交还给生成器函数

#### 分析执行过程

接着我们来分析它的执行过程，线来看它的打印结果，还是上面那个例子

```js
let it = generatorFn()
it.next()
// a
// {value: "1", done: false}

it.next()
// b
// {value: "1", done: false}

it.next()
// c
// {value: "1", done: true}

it.next()
// {value: undefined, done: true}
```

首先，Generator 函数执行，返回了一个指向内部状态对象的指针，此时没有任何输出

第一次调用`next`方法，从 Generator 函数的头部开始执行，先是打印了 a ，执行到`yield`就停下来，并将`yield`后边表达式的值 '1'，作为返回对象的 value 属性值，此时函数还没有执行完， 返回对象的 done 属性值是 false

第二次调用`next`方法时，同上步

第三次调用`next`方法时，先是打印了 c ，然后执行了函数的返回操作，并将 return 后面的表达式的值，作为返回对象的 value 属性值，此时函数已经结束，所以 done 属性值为 true

第四次调用`next`方法时， 此时函数已经执行完了，所以返回 value 属性值是 undefined，done 属性值是 true ，如果执行第三步时，没有 return 语句的话，就直接返回 `{value: undefined, done: true}`

简单的理解，Generator 函数`yield`放到哪里它就停到哪里，调用时使用`next`方法踹一步就走一步

#### next 参数传递

`yield`是有返回值的，`next`方法直接调用不传入参数的时候，`yield` 表达式的返回值是 undefined

当 next 传入参数的时候，该参数会作为**上一步**`yield`的返回值

我们通过示例来理解

```js
function* geFn() {
  cosnole.log("start")
  let a = yield "1"

  console.log(a)
  let b = yield "2"

  console.log(b)
  let c = yield "3"

  console.log(c)
  return 4
}

let it = geFn()
it.next()
// start
// { value:1, done: false }

it1.next()
// undefined   		未传值，所以a=undefined
// { value:2, done: false }

it.next("hahaha")
// hahaha	     		传值，所以b=hahaha
// { value:3, done: false }

it.next("omg")
// omg				 		传值，所以c=omg
// {value: 4, done: true}
```

由于 `next` 方法的参数表示上一个 `yield` 语句的返回值，所以第一次使用 `next` 方法时，不能带有参数

V8 引擎会直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用 `next` 方法开始，参数才是有效的

没有接到传值时，`yield`语句的返回值就是 undefined，正如上面示例输出那样

通过 `next` 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值，这代表了我们可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为

#### 再次理解 yield

我们再来看一段代码，帮助我们理解`yield`

```js
function* geFn() {
  console.log("start")
  let a = yield console.log("1")
  console.log(a)
  let b = yield console.log("2")
  console.log(b)
  return console.log("3")
}

let it = geFn()
it.next()
// start
// 1
// {value: 1, done: false}

it.next("我是a")
// 我是a
// 2
// {value: 2, done: false}

it.next("我是b")
// 我是b
// 3
// {value: 3, done: true}
```

通过`next`调用我们可以看到，第一次调用就输出了`start & 1` ，意味着`yield`停止时，后面代码是执行了的

![image-20200207234938429](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200207234938429.png)

如上图所示，如果将说`yield`比做一道墙，那么墙右边和上面是一块，墙左边和下面是一块，这样说应该够直白了吧

#### for..of 遍历 Generator

上文我们就知道了`for...of`内部实现就是在使用迭代器迭代，那么`for...of`循环直接用在 Generator 遍历器上岂不是完美

是的，它可以自动遍历 Generator 函数，而且此时不再需要调用 next 方法，一旦 next 方法的返回对象的 done 属性为 true，`for...of`循环就会中止，且不包含该返回对象

```js
function* foo() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}
for (let v of foo()) {
  console.log(v)
}
// 1 2 3 4 5
```

#### yield\* 表达式

在`yield`命令后面加上星号，表明它返回的是一个遍历器，这被称为`yield*`表达式

```js
function* foo() {
  yield "foo1"
  yield "foo2"
}
function* bar() {
  yield "bar1"
  yield* foo()
  yield "bar2"
}
for (let val of bar()) {
  console.log(val)
}

// bar1 foo1 foo2 bar2
```

`yield`命令后面如果不加星号，返回的是整个数组，加了星号就表示返回的是数组的遍历器

```js
function* gen1() {
  yield ["a", "b", "c"]
}
for (let val of gen1()) {
  console.log(a)
}
// ["a", "b", "c"]

// ------------------- 上下分割

function* gen2() {
  yield* ["a", "b", "c"]
}
for (let val of gen2()) {
  console.log(a)
}
// a b c
```

#### Generator 中的 return

return 方法返回给定值，并结束遍历 Generator 函数

当 return 无值时，就返回 undefined，来看例子

```js
function* foo() {
  yield 1
  yield 2
  yield 3
}

var f = foo()
f.next()
// {value: 1, done: false}

f.return("hahaha")
// 由于调用了return方法，所以遍历已结束，done变true
// {value: "hahaha", done: true}

f.next()
// {value: undefined, done: true}
```

#### Generator 错误处理 throw

`throw`方法可以再 Generator 函数体外面抛出异常，再函数体内部捕获，听着是很好理解

这里一不小心还是挺容易入坑的，我们来看几个例子吧

```js
function* foo() {
  try {
    yield "hahaha"
  } catch (err) {
    console.log("inside error: " + err)
  }
}
var f = foo()
try {
  it.throw("this is err")
} catch (err) {
  console.log("out error: " + err)
}
```

上面代码会输出哪个错误呢？

其实答案很简单，上述代码会输出`out error：this is err`

因为调用`throw`的时候，我们并没有执行`next`方法，这个时候内部的`try{}catch{}`代码都还没执行，因此只会被外面捕捉

所以说，我们只需要在调用`throw`之前，先调用一遍`next`，这个时候函数体内部已经执行了`try{}catch{}`，那么执行到`throw`时，内外都有错误捕捉，**`throw`方法会先被内部捕捉**，从而打印`inside error：this is err`

除此，**`throw`方法会附带执行下一个`yield`**，我们来看示例

```js
var foo = function* foo() {
  try {
    yield console.log("1")
    yield console.log("2")
  } catch (e) {
    console.log("inside err")
  }
  yield console.log("3")
  yield console.log("4")
}
var g = foo()
g.next()
g.throw()
g.next()
```

我们来看上述代码的执行过程

首先执行第一个`next`方法，进入`try()catch()`，输出 1

接着，执行`throw`方法，内部捕捉到，输出`inside err`，此时`try()catch()`代码块已经执行了`catch`，`try()catch()`代码块已经结束了，所以附带执行一个`yield`会继续向下找，所以再输出 3

最后执行`next`方法，输出 4

最终输出结果为`1 3 4`

### Generator 扩充

在 Generator 开头有一句话，不知道大家理解没有

- Generator 是协程在 ES6 的实现，最大的特点就是可以交出函数的执行权

#### 什么是协程？

这里使用阮一峰老师的文章参考链接【8】中对协程的解释并略带修改及补充

进程和线程大家应该都清楚，那么协程是什么呢

不知道大家知不知道用户空间线程，其实就是一种由程序员自己写程序来管理他的调度的线程，对内核来说不可见

协程(coroutine)，可以理解就是一种“用户空间线程”，也可理解为多个“线程”相互协作，完成异步任务

由于线程是操作系统的最小执行单元，因此也可以得出，协程是基于线程实现的，不过它要比线程要轻很多

协程，有几个特点：

- 协同，因为是由程序员自己写的调度策略，其通过协作而不是抢占来进行切换
- 在用户态完成创建，切换和销毁
- 编程角度上看，协程的思想本质上就是控制流的主动让出(yield)和恢复(resume)机制

它的运行流程如下

- 协程 A 开始执行
- 协程 A 执行到一半，暂停执行，执行的权利转交给协程 B。
- 一段时间后 B 交还执行权
- 协程 A 重得执行权，继续执行

上面的协程 A 就是一个异步任务，因为在执行过程中执行权被 B 抢了，被迫分成两步完成

举例来说，读取文件的协程写法如下

```javascript
function asnycJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

上面代码的函数 asyncJob 是一个协程，其中的 `yield` 命令，它表示执行到此处，执行权将交给其他协程，也就是说，`yield`命令是异步两个阶段的分界线

协程遇到 `yield` 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行，它的最大优点，就是代码的写法非常像同步操作，只多了一个`yield`命令

#### Generator 与协程

JS 是单线程的，ES6 中的 Generator 的实现，类似于开了多线程，但是依然同时只能进行一个线程，不过可以切换

就像汽车在公路上行驶，js 公路只是单行道(主线程)，但是有很多车道(辅助线程)都可以汇入车流(异步任务完成后回调进入主线程的任务队列)

而 Generator 把 js 公路变成了多车道(协程实现)，但是同一时间只有一个车道上的车能开(所以依然是单线程)，不过可以自由变道(移交控制权)

#### Generator 之 Thunk 函数

thunk 函数的诞生源于一个编译器设计的问题：`求值策略`，即函数的参数到底应该何时求值

```js
var x = 1
function fn(n) {
  return n * 10
}
fn(x + 5)
```

如上所示，其中 fn 方法调用时`x+5`这个表达式应该什么时候求值，有两种思路

- **传值调用(call by value)**，先计算`x+5`的值，再将这个值 `6` 传入函数 fn，例如 c 语言，这种做法的好处是实现比较简单，但是有可能会造成性能损失(例如一个函数传入了两个参数，第二个参数是一个表达式，但是函数体内没有用到这个参数，那么先计算出值就会损耗性能且无意义)
- **传名调用(call by name)**，即直接将表达式`x+5`传入函数体，只在用到它的时候求值

Thunk 函数的定义，就是传名调用的一种实现策略，用来替换某个表达式，实现思路其实也很简单

先将参数放到一个临时函数之中，再将这个临时函数传入函数体，就像下面这样

```js
function fn(m) {
  return m * 2
}
fn(x + 5)

// thunk实现思路
var thunk = function () {
  return x + 5
}

function fn(thunk) {
  return thunk() * 2
}
```

JS 是传值调用，它的 Thunck 函数含义有所不同

在 JS 中，Thunk 函数替换的不是表达式，是对函数珂里化的一种运用，简单来说，就是把是多参数函数替换成一个只接受回调函数作为参数的单参数函数，我们来看下它的简单实现

```js
fs.readFile(fileName, callback)

const Thunk = function (fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback)
    }
  }
}

// 使用上面的Thunk转化器，生成fs.readFile的Thunk函数
var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileName)(callback)
```

如果在生产环境要使用 Thunk 函数的话，使用 Thunkify 模块就可以，其实它核心源码就是上面我们写的 Thunk，Thunkify 里多了一个检查机制而已，比较简单，可自行百度 Thunkify 模块了解

Thunk 这东西在 ES6 前其实没有太大用处，但是在 Generator 函数出来后，Thunk 函数就可以派上用场了，它可以用于 Generator 函数的自动流程管理，接收和交换程序的执行权

我们来实现一个基于 Thunk 函数的 Generator 自动执行器

```js
// 基于Thunk函数的Genertor函数自动执行器
function run(fn) {
  let gen = fn()
  function next(err, data) {
    // 将指针移动到Generator函数的下一步
    let result = gen.next(data)
    // 判断是否结束
    if (result.done) return
    // 递归,把next放进.value中
    result.value(next)
  }
  next()
}

// 模拟异步方法
let sleep = function (n, callback) {
  setTimeout(() => {
    console.log(n)
    callback && callback(n)
  }, n)
}

// 模拟异步方法进行Thunk转换
let sleepThunk = Thunk(sleep)

// Generator函数
let gen = function* () {
  let f1 = yield sleepThunk(1000)
  let f2 = yield sleepThunk(1500)
  // ...
  let fn = yield sleepThunk(2000)
}

// 调用Genertor函数自动执行器
run(gen)
```

上面代码的 run 函数，就是一个 Generator 函数的自动执行器，内部的 next 函数就是 Thunk 的回调函数

next 函数先将指针移到 Generator 函数的下一步(gen.next 方法)

然后判断 Generator 函数是否结束(result.done 属性)

如果没结束，就将 next 函数再传入 Thunk 函数(result.value 属性)，否则就直接退出

代码中模拟了一个异步操作`sleep`方法，并将其转化为了 Thunk 方法(使用上文我们实现的那个简易版 Thunk)

函数 gen 封装了 n 个异步操作，只要执行 run 函数，这些操作就会自动完成

这样一来，异步操作不仅可以写得像同步操作，而且一行代码就可以执行，极其方便

不过相信大家也看到了，这种自动执行器传入的 Generator 函数，**yield 方法后面必须是一个 Thunk 函数**

--------👇--------

Thunk 就简单介绍到这里了，更多 Thunk 相关推荐看阮一峰文参考链接【9】

我们只需要明白 Thunk 是什么，它和 Generator 有什么关系就可以

#### Generator 之 co 函数库

co 函数库是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 Generator 函数的自动执行

[co 函数库传送门](https://github.com/tj/co)

co 函数库其实就是将两种自动执行器(Thunk 函数和 Promise 对象)，包装成一个库，所以说使用 co 的前提条件是，Generator 函数的 yield 命令后面，只能是 Thunk 函数或 Promise 对象

co 函数会返回一个 Promise，所以我们可以后接`then`等方法

基于 Thunk 函数的自动执行器上面介绍了下，那么基于 Promise 的其实也差不多，我们简单实现下

```js
// 基于Promise函数的Genertor函数自动执行器
function run(gen) {
  let g = gen()

  function next(data) {
    // 将指针移动到Generator函数的下一步
    let result = g.next(data)
    // 判断是否结束，结束返回value，value是一个Promise
    if (result.done) return result.value
    // 递归
    result.value.then((data) => {
      next(data)
    })
  }
  next()
}

// 模拟异步方法进行Promise转换
let sleepPromise = function (n) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log(n)
      resolve(n)
    }, n)
  })
}

// Generator函数
let gen = function* () {
  let f1 = yield sleepPromise(1000)
  let f2 = yield sleepPromise(1500)
  // ...
  let fn = yield sleepPromise(2000)
}

// 调用Genertor函数自动执行器
run(gen)
```

如上代码，和 Thunk 函数那里区别就是 yield 后面一个跟 Thunk 函数，一个跟 Promise 对象

如果 Thunk 自执行器你理解了，Promise 使用也 ok 的话，这块代码看看就懂了，也没啥解释的

接下来我们来看看 co 库的源码

co 函数库的源码也很简单，只有几十行代码

首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象

```js
function co(gen) {
  var ctx = this
  return new Promise(function (resolve, reject) {})
}
```

在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数

如果是，就执行该函数，得到一个内部指针对象

如果不是就返回，并将 Promise 对象的状态改为 resolved

```js
function co(gen) {
  var ctx = this

  return new Promise(function (resolve, reject) {
    if (typeof gen === "function") gen = gen.call(ctx)
    if (!gen || typeof gen.next !== "function") return resolve(gen)
  })
}
```

接着，co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulefilled 函数

主要是为了能够捕捉抛出的错误

```js
function co(gen) {
  var ctx = this

  return new Promise(function (resolve, reject) {
    if (typeof gen === "function") gen = gen.call(ctx)
    if (!gen || typeof gen.next !== "function") return resolve(gen)

    onFulfilled()
    function onFulfilled(res) {
      var ret
      try {
        ret = gen.next(res)
      } catch (e) {
        return reject(e)
      }
      next(ret)
    }
  })
}
```

最后，就是关键的 next 函数，它会反复调用自身

```js
function next(ret) {
  if (ret.done) return resolve(ret.value)
  var value = toPromise.call(ctx, ret.value)
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, but the following object was passed: "' + String(ret.value) + '"'))
    }
})
```

`next`方法中，第一行，检查当前是否为 Generator 函数的最后一步，如果是就返回

第二行，确保每一步的返回值，是 Promise 对象

第三行，使用 then 方法，为返回值加上回调函数，然后通过 onFulfilled 函数再次调用 next 函数

第四行，在参数不符合要求的情况下(参数非 Thunk 函数和 Promise 对象)，将 Promise 对象的状态改为 rejected，从而终止执行

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步，我们可以并发的操作放在数组或对象里面，如下

```js
// 数组的写法
co(function* () {
  var res = yield [Promise.resolve(1), Promise.resolve(2)]
  console.log(res)
}).catch(onerror)

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  }
  console.log(res)
}).catch(onerror)
```

-------👇-------

以上就是 co 的内容了，这里提及只是为了让大家了解 co 这种函数库，虽然目前用的不多，但是对我们理解 Generator 有帮助，即使这里有些迷糊，也无伤大雅，知道 co 是什么，co 的自动执行原理大概是怎么实现的就行

这块和 Thunk 一样，也是参考阮一峰老师的文章，所以有兴趣的话可以看下参考链接【10】

### Generator 优/缺

#### 优点

优雅的流程控制方式，可以让函数可中断执行，在某些特殊需求里还是很实用的

使用过 React-dva 的同学可能会更有感触一些

之前 Node 的 koa 框架也用 Generator，不过后来被 async/await 替代了

#### 缺点

Generator 函数的执行必须靠执行器，所以才有了 co 函数库，但 co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，只针对异步处理来说，还是不太方便

## Async/Await

### Async 和 Await 简介

ES2017 标准引入了 `async` 函数，使得异步操作变得更加方便

JS 异步编程解决方案的历程，从经典的回调函数到事件监听，再到 `Promise` ，再到 `Generator` ，再到我们要说的 `Async/Await` ，可谓艰辛

`Async/Await` 的出现，被很多人认为是 JS 异步操作的最终且最优雅的解决方案

`Async/Await` 大家都经常使用，也都知道它是 `Generator` 的语法糖

其实我觉得 `Async/Await = Generator + Promise` 这个解释更适合

`async` 是异步的意思，而 `await` 是 `async wait` 的简写，即异步等待

所以从语义上就很好理解 `async` 用于声明一个 `function` 是异步的，`await` 用于等待一个异步方法执行完成

另外 `await` 只能出现在 `async` 函数中

闲聊至此，接下来还是简单介绍下使用

### Async 在做什么

我们来看一个例子理解

```js
async function test() {
  return "this is async"
}
const res = test()
console.log(res)
// Promise {<resolved>: "this is async"}
```

可以看到，输出的是一个 Promise 对象

所以，`async` 函数返回的是一个 Promise 对象，如果在 `async` 函数中直接 return 一个直接量，`async` 会把这个直接量通过 `PromIse.resolve()` 封装成 Promise 对象返回

既然 `async` 返回一个 Promise，那么我们也可以用 `then` 链来处理这个 Promise 对象，如下

```js
test().then((res) => {
  console.log(res)
})
```

### Await 在等待什么

我们常说`await` 是在等待一个异步完成， 其实按照语法说明， `await` 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值(换句话说，就是没有特殊限定，啥都行)

- `await` 后面不是 Promise 对象，直接执行
- `await` 后面是 Promise 对象会阻塞后面的代码，Promise 对象 `resolve`，然后得到 `resolve` 的值，作为 `await` 表达式的运算结果
- `await` 只能在 `async` 函数中使用

使用比较简单，大家也经常用就不多说了

简单说一下为什 `await` 必须要在 `async` 函数中使用

其实很简单， `await` 会阻塞后面代码，如果允许我们直接使用 `await` 的话，假如我们使用`await`等待一个消耗时间比较长的异步请求，那代码直接就阻塞不往下执行了，只能等待 `await` 拿到结果才会执行下面的代码，那不乱套了

而 `async` 函数调用不会造成阻塞，因为它内部所有的阻塞都被封装在一个 Promise 对象中异步执行，所以才规定 `await` 必须在 `async` 函数中

### 处理异常

promise 正常 resolve，那么 await 会返回这个结果，但是在 reject 的情况下会抛出一个错误

所以我们直接把 `await` 代码块写到 `try()catch()` 中捕获错误即可

```js
async function fn() {
  try {
    let res = await ajax()
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}
```

### 没有对比没有伤害

我们经常会遇到这种业务，多个请求，每个请求依赖于上一个请求的结果

我们用 setTimeout 模拟异步操作，用 Promise 和 Async/Await 分别来实现下

```js
function analogAsync(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(n + 500), n)
  })
}

function fn1(n) {
  console.log(`step1 with ${n}`)
  return analogAsync(n)
}

function fn2(n) {
  console.log(`step2 with ${n}`)
  return analogAsync(n)
}

function fn3(n) {
  console.log(`step3 with ${n}`)
  return analogAsync(n)
}
```

使用 Promise

```js
function fn() {
  let time1 = 0
  fn1(time1)
    .then((time2) => fn2(time2))
    .then((time3) => fn3(time3))
    .then((res) => {
      console.log(`result is ${res}`)
    })
}

fn()
```

使用 Async/Await

```js
async function fn() {
  let time1 = 0
  let time2 = await fn1(time1)
  let time3 = await fn2(time2)
  let res = await fn3(time3)
  console.log(`result is ${res}`)
}

fn()
```

输出结果和上面用 Promise 实现是一样的，但这个 `aaync/await` 代码结构看起来清晰得多，几乎跟同步写法一样，十分优雅

我们再来看下面这个小例子

```js
// Generator
function* gen() {
  let f1 = yield ajax()
  let f2 = yield ajax()
}
gen()

// async/await
async function asyncAjax() {
  let f1 = await ajax()
  let f2 = await ajax()
}
asyncAjax()
```

这两块代码看着是不是几乎一样

上面函数为 Generator 函数执行两个 ajax，下面函数为 async/await 执行

比较可发现，两个函数其实是一样的，`async` 不过是把 Generator 函数的 `*` 号换成 `async`，`yield` 换成 `await`

那么这两个函数在调用时，Generator 函数需要手动调用 `next` 方法或者使用 co 函数库才可执行，而下面的`async` 函数直接就按顺序执行完成了，使用非常方便

异步编程追求的是，让它更像同步编程， `Async/Await` 完美诠释了这一点

到这里我们其实就不难看出 `Async/Await` 已经完虐了 `Generator` 和 `Promise`

对比来看我们发现，Async 函数自带执行器

### Async/Await 优/缺

#### 优点

内置执行器， Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 `async` 函数自带执行器，也就是说，`async` 函数的执行，与普通函数一模一样，只要一行

更好的语义，`async` 和 `await`，比起 `*` 和 `yield`，语义更清楚了，`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果

更广的适用性，co 函数库约定，`yield` 命令后面只能是 Thunk 函数或 Promise 对象，而 `async` 函数的 `await` 命令后面，可以跟 Promise 对象和原始类型的值(数值、字符串和布尔值，但这时等同于同步操作)

#### 缺点

滥用 `await` 可能会导致性能问题，因为 `await` 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性

## 异步解决方案对比

别看了，我没有总结对比

其实相对来说已经写的很详细了，能讲出来的才算是自己的，大家可根据每种方案列出的优缺点加上自己的理解做个对比或着说总结，毕竟你都看到这了，也不妄花费这么长时间来阅读这两万字的干帖子，总归要有些收获的

## 写在最后

水平有限，欢迎指错

码字不易，大家有收获别忘了点个赞鼓励下

搜索【不正经的前端】或直接扫码可以关注公众号看到更多的精彩文章，也有一些群友提供的学习视频、资源干货什么的免费拿

也可以直接加我微信，进交流群学习交流

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/qqz.png)

> 参考
>
> 1. [Javascript 异步编程的 4 种方法-阮一峰](<[http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html](http://www.ruanyifeng.com/blog/2012/12/asynchronous＿javascript.html)>)
> 2. [Promise-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
> 3. [iterable-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312/1023024358748480)
> 4. [What is Promise.try, and why does it matter?](http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/)
> 5. [什么是 Promise.try，为什么它这么重要？-参考 4 译](https://segmentfault.com/a/1190000018586947)
> 6. [Promise/A+规范-英原文](https://promisesaplus.com/)
> 7. [Promise/A+规范-中文译](http://www.ituring.com.cn/article/66566)
> 8. [Generator 函数的含义与用法-阮一峰](http://www.ruanyifeng.com/blog/2015/04/generator.html)
> 9. [Thunk 函数的含义和用法-阮一峰](http://www.ruanyifeng.com/blog/2015/05/thunk.html)
> 10. [co 函数库的含义和用法-阮一峰](http://www.ruanyifeng.com/blog/2015/05/co.html)
