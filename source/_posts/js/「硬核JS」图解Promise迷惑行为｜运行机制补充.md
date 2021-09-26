---
title: 「硬核JS」图解Promise迷惑行为｜运行机制补充
tags: [JavaScript, 运行机制, Promise]
categories: 硬核JS系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/js.jpg
date: 2021-08-19 20:00:00
---
<!-- more -->

## 写在前面

Promise用起来很简单，JavaScript运行机制也不难，但是运行机制和 Promise 挂钩之后，往往就能把人迷的晕头转向，如果你也是如此，那此文或许能帮你解惑。

前些天有几个小伙伴看了我很早之前写的 [「硬核JS」一次搞懂JS运行机制](https://github.com/isboyjc/blog/issues/5) 后私信给我提出了疑问，说是运行机制是懂了，可是涉及到 Promise 的种种迷惑行为（各种嵌套输出、链式 `then` 等等）还是不太懂。其实那篇文章的核心本来就只是运行机制的概念，而对于 Promise 迷惑行为拿捏不准的小伙伴是因为对 Promise 的整体实现机制不太了解导致的。

假如你不知道自己对这块是否了解，可以直接跳到最后几个小标题，看一看这些题型自己能否正确解答即可。

此文应读者要求，算是对 Promise+运行机制的一个梳理与补充，重要的是实战方面，列了几种常见的 Promise 相关求输出顺序的题型，几乎涵盖所有 Promise 难搞题型了，总之，目的只有一个：彻底搞明白 Promise+运行机制的各种迷惑行为。



## JS运行机制简述

在开始之前，还是有必要简单介绍下 JS 的运行机制。

JavaScript 中有同步/异步任务的概念，同步任务在主线程上执行，会形成一个 `执行栈`，主线程之外，事件触发线程管理着一个 `任务队列`，只要异步任务有了运行结果，就在 `任务队列` 之中放一个事件回调。一旦 `执行栈` 中的所有同步任务执行完毕，就会读取 `任务队列`，将可运行的异步任务（任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行）添加到执行栈中，开始执行。

同步/异步任务是广义上的，同时，JavaScript 中还有宏任务（macrotask）和微任务（microtask）这种更加细致的概念，我们可以将每次执行栈执行的代码当做是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）， 每一个宏任务会从头到尾执行完毕，不会执行其他。而在异步任务中，有些特殊的任务我们称之为微任务，它在当前宏任务执行后立即执行。

比较常见的微任务有这些：

- process.nextTick-Node
- Promise.then
- catch
- finally
- Object.observe
- MutationObserver
- queueMicrotask
- ...

简单来说，一段完整的 JS 代码，浏览器会将整体的 script（作为第一个宏任务）开始执行，所有代码分为`同步任务`、`异步任务`两部分：

1. 同步任务直接进入主线程执行栈依次执行，异步任务会再分为普通异步任务（也是宏任务），和特殊异步任务（即微任务）；
2. 普通的异步任务等有了运行结果其回调就会进入事件触发线程管理的 `任务队列`（可理解为宏任务队列）；
3. 特殊的异步任务也就是微任务的回调会立即进入一个微任务队列；
4. 当主线程内的任务执行完毕，即主线程为空时，会检查微任务队列，如果有任务，就全部执行，如果没有就执行下一个宏任务（事件触发线程管理的 `任务队列` 中）；

上述过程会不断重复，这就是Event Loop，事件循环。

浏览器中加上渲染的话就是先执行一个宏任务，再执行当前所有的微任务，接着开始执行渲染，然后再执行下一个宏任务，如此循环。

> 简单回顾，详细请看 👉 [「硬核JS」一次搞懂JS运行机制](https://github.com/isboyjc/blog/issues/5)



## Promise手写实现

由于后面涉及到了一些 Promise 内部的运行机制，所以，这部分手写 Promise 请耐心看完，不多，只有核心部分，也很简单，看看思路即可。



### Promises/A+

Promises/A+标准是一个开放、健全且通用的 JavaScript Promise 标准，由开发者制定，供开发者参考。很多 Promise 三方库都是按照 Promises/A+标准实现的。

so，此次实现我们严格参照 Promises/A+标准，包括完成后我们会使用开源社区提供的测试包来测试。测试通过的话，足以证明代码符合 Promises/A+标准，是合法的、完全可以上线提供给他人使用的。



### 构造方法核心基础搭建

- Promise 有三种状态进行中（Pending）、已完成（Resolved/Fulfilled）和已失败 （Rejected）。
- Promise 是一个构造方法，实例化 Promise 时传入一个函数作为处理器。
  - 处理器函数有两个参数（resolve 和 reject）分别将结果变为成功态和失败态。
  - Promise 对象执行成功了要有一个结果，通过 resolve 传递出去，失败的话失败原因通过 reject 传递出入。
- Promise 的原型上定义着 then 方法。

那么根据我们上面的这些已知需求我们可以写出一个基础的结构（写法千千万，喜欢 class 也可以用 class）。

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

如上所示，我们创建了一个 Promise 构造方法，`state` 属性保存了 Promise 对象的状态，使用 `value` 属性保存 Promise 对象执行成功的结果，失败原因使用 `reason` 属性保存，这些命名完全贴合 Promises/A+标准。

接着我们在构造函数中创建了 `resolve` 和 `reject` 两个方法，然后在构造函数的原型上创建了一个 `then` 方法，以备待用。



### 初始化实例 executor 立即执行

我们知道，在创建一个 Promise 实例时，处理器函数 `executor` 是会立即执行的，所以我们更改代码：

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

### resolve&reject 回调实现

Promises/A+ 规范中规定，当 Promise 对象已经由 pending 状态改变为成功态 `resolved` 或失败态 `rejected` 后不可再次更改状态，也就是说成功或失败后状态不可更新已经凝固。

因此我们更新状态时要判断，如果当前状态是等待态 `pending` 才可更新，由此我们来完善 `resolve` 和 `reject` 方法。

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

如上所示，首先我们在 Promise 构造函数内部用变量 `_this` 托管构造函数的 `this`。

接着我们在 `resolve` 和 `reject` 函数中分别加入了判断，因为只有当前态是 pending 才可进行状态更改操作。

同时将成功结果和失败原因都保存到对应的属性上。

然后将 state 属性置为更新后的状态。

### then 方法基础实现

接着我们来简单实现 `then` 方法。

首先 `then` 方法有两个回调，当 Promise 的状态发生改变，成功或失败会分别调用 `then` 方法的两个回调。

所以，then 方法的实现看起来挺简单，根据 state 状态来调用不同的回调函数即可。

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

如上所示，由于 `onFulfilled & onRejected` 两个参数都不是必选参，所以我们在判断状态后又判断了参数类型，当参数不为函数类型，就不执行，因为在 Promises/A+规范中定义非函数类型可忽略。



### 让 Promise 支持异步

写到这里，你可能会觉得，咦？Promise 实现起来也不难嘛，这么快就有模有样了，我们来简单测试下：

```js
let p = new Promise((resolve, reject) => {
  resolve(1)
})

p.then((data) => console.log(data)) // 1
```

嗯，符合预期，再来试下异步代码：

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }，1000);
})

p.then(data => console.log(data)) // 无输出
```

问题来了，Promise 一个异步解决方案被我们写的不支持异步。本来是等 1000ms 后执行`then`方法，运行上面代码发现没有结果，哪里有问题呢？

setTimeout 函数让`resolve`变成了异步执行，有延迟，调用`then`方法的时候，此刻状态还是等待态 `pending`，`then`方法即没有调用`onFulfilled`也没有调用`onRejected`。

原因搞清楚了，我们开始改造。我们可以在执行`then`方法时如果还在等待态 `pending`，就把回调函数临时寄存到队列（就是一个数组）里，当状态发生改变时依次从数组中取出执行就好了。

思路有了，我们来实现下：

首先，我们要在构造方法中新增两个 Array 类型的数组，用于存放成功和失败的回调函数。

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

我们还需要改善`then`方法，在`then`方法执行时如果状态是等待态，就将其回调函数存入对应数组。

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

如上所示，我们改写`then`方法，除了判断成功态 `resolved`、失败态 `rejected`，我们又加了一个等待态 `pending` 判断，当状态为等待态时，异步代码还没有走完，那么我们把对应的回调先存入准备好的数组中即可。

现在，就差最后一步执行了，我们在 `resolve` 和 `reject` 方法中调用即可。

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

到了这里，我们已经完成了 Promise 的异步支持。



### 实现 Promise 经典的链式调用

Promise 的`then`方法可以链式调用，这也是 Promise 的精华之一，在实现起来也算是比较复杂的地方了。

首先我们要理清楚`then`的需求是什么，这需要仔细看 Promises/A+ 规范中对`then`方法的返回值定义及 Promise 解决过程，如下：

- **首先`then` 方法必须返回一个 `promise` 对象(划重点)**

- **如果`then`方法中返回的是一个普通值(如 Number、String 等)就使用此值包装成一个新的 Promise 对象返回**

- **如果`then`方法中没有`return`语句，就返回一个用 Undefined 包装的 Promise 对象**

- **如果`then`方法中出现异常，则调用失败态方法(reject)跳转到下一个`then`的 onRejected**

- **如果`then`方法没有传入任何回调，则继续向下传递(值穿透)**

- **如果`then`方法中返回了一个 Promise 对象，那就以这个对象为准，返回它的结果**

嗯，到此我们需求已经明确，开始代码实现。

需求中说如果`then`方法没有传入任何回调，则继续向下传递，但是每个`then`中又返回一个新的 Promise，也就是说当`then`方法中没有回调时，我们需要把接收到的值继续向下传递，这个其实好办，只需要在判断回调参数不为函数时我们把他变成回调函数返回普通值即可。

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

我们上面`then`实现中，在每个可执行处都加了参数是否为函数的类型校验，但是我们这里在`then`方法开头统一做了校验，就不需要参数校验了。

现在的`then`方法变成了：

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

既然每个`thne`都返回一个新的 Promise，那么我们就先在`then`中创建一个 Promise 实例返回，开始改造。

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

我们在`then`方法中先实例化了一个 Promise 对象并返回，我们把原来写的代码放到该实例的处理器函数中。

我们把原来写的代码放到该实例的处理器函数中。

接着在每个执行函数处使用`try..catch`语法，try 中`resolve`执行结果，catch 中`reject`异常，原来的`then`方法中有 resolved、rejected 和 pending 三种逻辑判断，如下：

在 resolved 状态判断时，rejected 和 resolved 逻辑一致。

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

pending 状态判断，逻辑也和 resolved 相似，但是由于此处为了处理异步，我们在这里做了 push 操作，所以我们 push 时在 onFulfilled 和 onRejected 回调外面再套一个回调做操作即可，都是 JS 惯用小套路，不过分解释。

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

再接下来我们开始处理根据上一个`then`方法的返回值来生成新 Promise 对象，这块逻辑复杂些，规范中可以抽离出一个方法来做这件事，我们来照做。

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

我们来一步步分析完善 resolvePromise 函数。

**避免循环引用，当 then 的返回值与新生成的 Promise 对象为同一个(引用地址相同)，则抛出 TypeError 错误：**

例：

```js
let promise2 = p.then((data) => {
  return promise2
})

// TypeError: Chaining cycle detected for promise #<Promise>
```

如果返回了自己的 Promise 对象，状态永远为等待态(pending)，再也无法成为 resolved 或是 rejected，程序就死掉了，因此要先处理它。

```js
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("请避免Promise循环引用"))
  }
}
```

**判断 x 类型，分情况处理：**

当 x 是一个 Promise，就执行它，成功即成功，失败即失败，如果`x`是一个对象或是函数，再进一步处理它，否则就是一个普通值。

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

如果 x 是个对象，尝试将对象上的 then 方法取出来，此时如果报错，那就将 promise2 转为失败态。

在这里 catch 防止报错是因为 Promise 有很多实现，假设另一个人实现的 Promise 对象使用`Object.defineProperty()`在取值时抛错，我们可以防止代码出现 bug。

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

如果对象中有`then`，且`then`是函数类型，就可以认为是一个 Promise 对象，之后，使用`x`作为其 this 来调用执行`then`方法。

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

此时，我们还要考虑到一种情况，如果 Promise 对象转为成功态或是失败时传入的还是一个 Promise 对象，此时应该继续执行，直到最后的 Promise 执行完，例如下面这种：

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

解决这种情况，我们可以采用递归，把调用 resolve 改写成递归执行 resolvePromise，这样直到解析 Promise 成一个普通值才会终止。

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

规范中定义，如果 resolvePromise 和 rejectPromise 都被调用，或者多次调用同一个参数，第一个调用优先，任何进一步的调用都将被忽略，为了让成功和失败只能调用一个，我们接着完善，设定一个 called 来防止多次调用。

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

到此，我们算是实现好了`resolvePromise`方法，我们来调用它实现完整的`then`方法，在原来的原型方法`then`中我们`return`了一个 promise2，这个实例处理器函数的三种状态判断中把`resolve`处替换成`resolvePromise`方法即可。

那么，此时`then`方法实现完成了吗？

当然还没有，我们都知道，Promise 中处理器函数是同步执行，而`then`方法是异步且是个微任务，但是我们完成这个还是同步。

解决这个问题其实也很简单，我们可以使用 `queueMicrotask` 方法实现一个微任务，在`then`方法内执行处的所有地方使用 `queueMicrotask` 变为微任务即可，`queueMicrotask` API有兼容性问题，大多数 Promise 库中此处的实现是递进的策略，简单说就是有好几种微任务实现方案，依次向下，如果都不兼容的话最后使用 `setTimeout`，如下：

```js
queueMicrotask(() => {
  try {
    let x = onFulfilled(value)
    resolvePromise(promise2, x, resolve, reject)
  } catch (e) {
    reject(e)
  }
})
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
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

      this.onRejectedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
    }
    if (this.state === "resolved") {
      queueMicrotask(() => {
        try {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }
    if (this.state === "rejected") {
      queueMicrotask(() => {
        try {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }
  })
  return promise2
}
```



### catch 实现

实现了最复杂的`then`方法后，`catch`实现非常简单，一看就懂了。

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```



### 代码测试

开源社区提供了一个包用于测试我们的代码是否符合 Promises/A+规范：`promises-aplus-tests`。

首先我们要为该测试包提供一个 `deferred` 钩子，用于测试。

如下，将下面代码防止我们的 `Promise.js` 文件末尾即可。

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

接着，安装这个包：

```js
npm install promises-aplus-tests -D
```

执行测试：

```js
npx promises-aplus-tests Promise.js
```

静等片刻，如果控制台没有爆红就是成功了，符合规范，如图所示：

![image-20200206222942803](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20200206222942803.png)

其他的 resolve/reject/race/all 等比较简单，不在这里描述了。

给大家贴个我这边 Promise 多个方法实现的地址，大家有兴趣自行看代码吧，注释写的很详细了，也就大概 200 多行代码。

- [Promise/A+实现](https://github.com/isboyjc/promise)

其实，这块儿的 Promise 的手写实现是在很久之前的 [「硬核JS」深入了解异步解决方案](https://github.com/isboyjc/blog/issues/7) 一文的 Promise 章节写的，但是搞懂此文需要这块，我就 Copy 了一下稍作修改，跑了一下测试还能过证明还不算过时。

注意一定要先搞懂手写实现的逻辑哦，不然下面不好懂，那接下来开始进入正文。





## 手写后的启发

Promise 核心实现我们上面已经介绍过了，从上面代码中我们得到了什么启发？

哦，原来 then 方法返回的是一个全新的 Promise 对象。

哦，原来 then 方法是一个微任务这种说法是不准确的，应该说 then 方法的回调函数会被作为微任务执行。

哦，原来 then 方法并不是在上一个 Promise 对象 resolve 后才执行，它在一开始就执行并返回了一个新的 Promise，在返回的新 Promise 中会根据上一个 Promise 的状态来做判断。

- 上一个 Promise 在成功态 `Fulfilled` 的时候会直接将 then 方法回调作为微任务入队
- 上一个 Promise 在失败态 `Rejected` 时候会直接将 then 方法回调作为微任务入队

- 上一个 Promise 还在等待态 `pending` 的时候它的内部会把 then 方法回调使用微任务方法包裹缓存到新 Promise 实例数组中，并没有直接入队。当上一个 Promise 从等待态变为成功态的时候会调用其自身返回的新 Promise 的 resolve 方法，从而调用新 Promise（也就是返回的那个新 Promise）实例数组中的方法，这时微任务方法包裹的回调函数就会执行，即入栈。

哦，原来上一个 Promise 中 return 一个 Promise 和直接 return 一个值或不写的处理方式是不一样的

- 上一个 Promise 中什么都 return 即其回调的返回值为 undefined，和直接 return 一个值一样，都会在上一个 Promise 状态为成功态时调用其返回时内部创建的新 Promise 的 resolve 方法并将值传出。
- 上一个 Promise 中 return 一个 Promise 的话会在上一个 Promise 状态为成功态时，**调用其 then 方法执行**，拿到值 resolve 或 reject 出去（注意，由于 return Promise 时回在内部执行一个 then 方法，所以这里多执行了一个微任务，但是这个微任务其实什么都没做，只是为了取我们自己 return 的 Promise 的值）

绕晕了？没关系，概念还是概念，我们用案例说话。



## 多个Promise执行

```js
new Promise((resolve, reject)=>{
  console.log(1);
  resolve();
}).then(() => {
  console.log(2);
}).then(() =>{
  console.log(3);
});

Promise.resolve().then(() => {
  console.log(10);
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30);
}).then(() => {
  console.log(40);
});

// 1 2 10 3 20 30 40
```

这题相对简单，目的是为了让大家先熟悉一下解题套路，过一遍整体流程，方面后面能够看懂。

首先，我们为整道题做一个拆分命名，方便后续讲解：

- 整个程序有两个 Promise，我们记作 `P1、P2`。
- P1中 Promise 传入的回调我们记作 `P1-主`，还有两个 then 方法我们记作 `P1-t1、P1-t2`。
- P2中直接使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，后面有 4 个 then 方法，我们记作 `P2-t1、P2-t2、P2-t3、P2-t4`。

分析一下，整个程序会作为一个宏任务第一批执行，而 then 方法中的回调最终会被作为微任务入微任务队列，等待宏任务执行结束后依次执行，在宏任务执行过程中部分 then 方法回调在上一个 Promise 状态为 `pending` 时会被微任务方法包裹先存入各自 Promise 实例中缓存起来等待后续执行。

被微任务方法包裹这个描述大概意思就是下面这样子：

```js
// 缓存数组
let arr = []

// 微任务方法包裹的回调存入缓存
arr.push(() => {
  queueMicrotask(() => {
    // 需要作为微任务执行的代码
    let x = onFulfilled(this.value)
    resolvePromise(promise2, x, resolve, reject)
    
    // ...
  })
})

// 只有arr[0]这个函数执行的时候，微任务才会入队
```

这时，我们脑子里就形成了一个空白的结构图，如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210810184731045.png)

开始执行代码，首先执行第一个宏任务，即程序整体：

- 因为 `new Promise` 时参数回调是同步执行，所以执行 `P1-主` 回调，输出 1，接着执行 `resolve` ，将 `new` 的 Promise 实例变为成功态 `Fulfilled` 。
- `P1-t1` 的 then 方法开始执行，由于上一个 Promise 为成功态，所以 `P1-t1` 回调直接入微任务对列等待执行。
- `P1-t2` 的 then 方法开始执行，由于 `P1-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P1-t2` 回调使用微任务方法包裹缓存进 Promise 实例（注意：这里的 Promise 实例为 `P1-t1` 返回的新 Promise，所以我们在各实例缓存列表中以 `P1-t1返` 开头注明存在哪个 Promise 实例中）。
- P1 执行完毕，开始执行 P2。
- P2 中直接使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，`P2-t1` 的 then 方法执行时，由于是成功态 `Fulfilled`，所以 `P2-t1` 直接作为微任务入队等待执行。
- 接着 `P2-t2` 的 then 方法开始执行，由于 `P2-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t2` 回调使用微任务方法包裹缓存进 `P2-t1返` 这个 Promise 实例中。
- 接着 `P2-t3` 的 then 方法开始执行，由于 `P2-t2` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t3` 回调使用微任务方法包裹缓存进 `P2-t2返` 这个 Promise 实例中。
- 接着 `P2-t4` 的 then 方法开始执行，由于 `P2-t3` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t4` 回调使用微任务方法包裹缓存进 `P2-t3返` 这个 Promise 实例中。

执行到这里，主程序这个宏任务结束，目前程序运行状态如下：

![image-20210810192049256](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210810192049256.png)

宏任务执行完了，那接下来就是依次执行微任务队列中的任务了

- 按照顺序，首先是 `P1-t1` 执行，输出 2，返回值是 `undefined` ，这时会调用 `P1-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve方法执行后即 `P1-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P1-t1返` 实例的缓存方法。
- `P1-t1返` 实例的缓存中只有微任务方法包裹的 `P1-t2` 回调，执行后即 `P1-t2` 入微任务队列等待执行，到此微任务 `P1-t1` 执行结束，出队。

现在程序运行状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210810200441935.png)

继续执行微任务队列中的方法

-  `P2-t1` 执行，输出 10，返回值是 `undefined` ，这时会调用 `P2-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P2-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P2-t1返` 实例的缓存方法
- `P2-t1返` 实例的缓存中只有微任务方法包裹的 `P2-t2` 回调，执行后即 `P2-t2` 入微任务队列等待执行，到此微任务 `P2-t1` 执行结束，出队

现在程序运行状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210810200534781.png)

还是一样的套路，接着执行微任务队列的任务

-  `P1-t2` 执行，输出 3，返回值是 `undefined` ，这时会调用 `P1-t2`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P1-t2返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P1-t2返` 实例的缓存方法，由于后续没有 then， `P1-t2返` 实例也就没有缓存的方法， `P1-t2`  出队，P1 到此结束

此时程序运行状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210810235736888.png)

- 接着微任务队列中 `P2-t2` 执行，输出 20， 返回值是 `undefined` ，这时会调用 `P2-t2`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P2-t2返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P2-t2返` 实例的缓存方法
- `P2-t2返` 实例的缓存中只有微任务方法包裹的 `P2-t3` 回调，执行后即 `P2-t3` 入微任务队列等待执行，到此微任务 `P2-t2` 执行结束，出队

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811000521764.png)

- 接下来就是执行微任务队列中的 `P2-t3` ，输出 30，同样， `P2-t4` 入队，`P2-t3` 出队，如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811000749847.png)

- 最后 `P2-t4` 执行，输出 40，结束出队，P2 结束，执行完毕，如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811000854307.png)

所以，最终的输出如下：

```js
// 1 2 10 3 20 30 40
```

其实对于简单题型，我们完全可以脑子里想象一个微任务队列即可，复杂一点可以画图理解。

这题如果 Get 了的话，接着往下看。。



## Promise嵌套执行

```js
new Promise((resolve, reject)=>{
  console.log("1")
  resolve()
}).then(()=>{
  console.log("2")
  new Promise((resolve, reject)=>{
      console.log("10")
      resolve()
  }).then(()=>{
      console.log("20")
  }).then(()=>{
      console.log("30")
  })
}).then(()=>{
  console.log("3")
})
```

如题，还是与之前一样 new 了两个 Promise实例，不过此题两个 Promise 是嵌套的关系。

那我们还是先为整道题做一个拆分命名：

- 整个程序有两个 Promise，我们记作 `P1、P2`
- P1 中 Promise 传入的回调我们记作 `P1-主`，还有两个 then 方法我们记作 `P1-t1、P1-t2`
- P2 中 Promise 传入的回调我们记作 `P2-主`，还有两个 then 方法我们记作 `P2-t1、P2-t2`

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811004809667.png)

其实还是按照一样的套路分析就可以了，首先整个程序会作为一个宏任务第一批执行：

- 因为 `new Promise` 时参数回调是同步执行，所以执行 `P1-主` 回调，输出 1，接着执行 `resolve` ，将 `new` 的 Promise 实例变为成功态 `Fulfilled` 。
- `P1-t1` 的 then 方法开始执行，由于上一个 Promise 为成功态，所以 `P1-t1` 回调直接入微任务对列等待执行
- 接着 `P1-t2` 的 then 方法开始执行，由于 `P1-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P1-t2` 回调使用微任务方法包裹缓存进 `P1-t1返` 这个 Promise 实例中。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811005205779.png)

宏任务执行结束，开始依次执行微任务队列所有微任务。

- 执行 `P1-t1`，输出 2，接着执行 `P1-t1` 回调里的 P2
  - `P2-主` 是同步代码直接执行，输出 10，接着执行 `resolve` ，将 P2  `new` 的 Promise 实例变为成功态 `Fulfilled` 。
  - 执行 `P2-t1` 的 then 方法，由于上一个 Promise 为成功态，所以 `P2-t1` 回调直接入微任务对列等待执行。
  - 执行 `P2-t2` 的 then 方法，由于 `P2-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t2` 回调使用微任务方法包裹缓存进 `P2-t1返` 这个 Promise 实例中。
-  `P1-t1` 回调执行完毕，其返回值是 `undefined` ，这时会调用 `P1-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve方法执行后即 `P1-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P1-t1返` 实例的缓存方法。
-  `P1-t1返` 实例中存有被微任务方法包裹的 `P1-t2` ，执行其微任务方法，`P1-t2` 入队，最后 `P1-t1` 出队

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811012410471.png)

接着执行微任务队列：

-  `P2-t1` 开始执行，输出 20，返回值是 `undefined` ，这时会调用 `P2-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P2-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P2-t1返` 实例的缓存方法。
-  `P2-t1返` 实例中存有被微任务方法包裹的 `P2-t2` ，执行其微任务方法，`P2-t2` 入队，最后 `P2-t1` 出队

目前程序状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811013049592.png)

接着执行微任务队列：

- 执行 `P1-t2`，输出 3， `P1-t2` 出队。
- 执行 `P2-t2`，输出 30， `P2-t2` 出队，程序执行完毕，如下图

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811013406862.png)

所以，这个嵌套的 Promise 程序的执行输出是：

```js
// 1 2 10 20 3 30
```





## 嵌套返回新Promise

### 基础版

前面在手写 Promise 的时候说过，Promise 实例 resolve 或 then 方法中还可以返回一个新的 Promise，当返回 Promise 对象时内部进行的处理和返回一些基础的值是不同的，那我们接下来就来看看这种情况。

```js
Promise.resolve().then(() => {
  console.log(1);
  return Promise.resolve(2)
}).then(res => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(10);
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30);
}).then(() => {
  console.log(40);
})
```

同样的，我们还是先为整道题做一个拆分命名：

- 整个程序有两个 Promise，我们记作 `P1、P2`
- P1 使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，后面有 2 个 then 方法，我们记作 `P1-t1`、`P1-t2`。
- P2 使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，后面有 4 个 then 方法，记作 `P2-t1`，`P2-t2`，`P2-t3`，`P2-t4`。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200000107.png)

首先整个程序会作为一个宏任务第一批执行：

- P1 中直接使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，`P1-t1` 的 then 方法执行时，由于是成功态 `Fulfilled`，所以 `P1-t1` 直接作为微任务入队等待执行。
- 接着 `P1-t2` 的 then 方法开始执行，由于 `P1-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P1-t2` 回调使用微任务方法包裹缓存进 `P1-t1返` 这个 Promise 实例中。
- P2 中也是使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，`P2-t1` 的 then 方法执行时，由于是成功态 `Fulfilled`，所以 `P2-t1` 直接作为微任务入队等待执行。
- 接着 `P2-t2` 的 then 方法开始执行，由于 `P2-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t2` 回调使用微任务方法包裹缓存进 `P2-t1返` 这个 Promise 实例中。
- 接着 `P2-t3` 的 then 方法开始执行，由于 `P2-t2` 的 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t3` 回调使用微任务方法包裹缓存进 `P2-t2返` 这个 Promise 实例中。
- 接着 `P2-t4` 的 then 方法开始执行，由于 `P2-t3` 的 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t4` 回调使用微任务方法包裹缓存进 `P2-t3返` 这个 Promise 实例中。

现在程序运行的状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200233374.png)

宏任务执行结束，开始依次执行微任务队列中的任务：

- 首先是执行 `P1-t1`，输出 1，注意 ⚠️⚠️⚠️ ，`P1-t1` 回调中返回的是一个 Promise 对象，还记得我们之前手写 Promise 时对于返回结果是 Promise 对象的处理吗？没错，我们会调用传入 Promise 对象的 then 方法，取到其是成功态或者是失败态并将值传出。由于我们内部又取了 `Promise.resolve(2)` 这个 Promise 的 then 方法执行，且  `Promise.resolve(2)`  是一个成功态的 Promise，所以这个 then 方法执行后，其回调也会入队等待，我们记作  `P1-t1返`  回调，其实 `P1-t1返` 这个 Promise 实例就是 `Promise.resolve(2).then((res)=>{...})` 。
-  `P1-t1返` 回调入队了，由于 `P1-t1返` 回调在队列中排队，还没有执行，所以 `P1-t2` 这个 then 方法 对应的 Promise 实例还是等待态 `pending` ，所以 `P1-t2` 还是无动作。

我们来看图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200719972.png)

接着开始执行后微任务队列中的 `P2-t1` ：

- `P2-t1` 回调执行，输出 10，返回值是 `undefined` ，这时会调用 `P2-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P2-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P2-t1返` 实例的缓存方法。
-  `P2-t1返` 实例中存有被微任务方法包裹的 `P2-t2` ，执行其微任务方法，`P2-t2` 入队，最后 `P2-t1` 出队

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200933314.png)

按照微任务队列中的顺序，现在要开始执行 `P1-t1返` 这个回调了：

- `P1-t1返` 这个回调是之前 `P1-t1` 中的 `Promise.resolve(2)` 的 then 方法回调，它是在内部调用的，其实什么都没做，只是通过 then 取到成功态然后再将 2 这个值传 resolve 出去而已，所以 `P1-t1返` 回调执行，无输出，`P1-t1返` 这个 Promise 实例内部 resolve 之后状态改为成功态 `Fulfilled` ，并执行 `P1-t1返` 实例的缓存方法。
-  `P1-t1返` 实例中存有被微任务方法包裹的 `P1-t2` ，执行其微任务方法，`P1-t2` 入队，最后 `P1-t1返` 出队。

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811201224223.png)

后面的就和之前一样了：

- 执行微任务队列中的 `P2-t2` ，输出 20，`P2-t3` 入队，`P2-t2` 出队。
- 执行微任务队列中的 `P1-t2`，输出 2，`P1-t2` 出队，P1 结束。
- 接着执行微任务队列中的 `P2-t3` ，输出 30，`P2-t4` 入队，`P2-t3` 出队。
- 执行微任务队列中的 `P2-t4`，输出 40，`P2-t4` 出队，P2 结束。

最终程序的输出结果如下：

```js
// 1 10 20 2 30 40
```

好像很顺畅，真的是这样吗？

我们 `copy` 一下这段程序在浏览器控制台中执行一下，查看输出结果：

```js
// 1 10 20 30 2 40
```

？？？这是为什么？

按照我们上面的手写 Promise 实现方式输出结果是第一种，但是浏览器中输出结果却是下面这种。。。

我们之前的手写实现，当使用 Promise 返回一个新的 Promise 时，内部会调用它的 then 方法从而产生一个新的微任务，其回调入队，后面微任务队列执行到这个回调时，拿到传入的值作处理后再 resolve 出去。

> 但是在 TC39 ECMA 262 SPEC 的 `Promise` 规范中是这样的：
>
> ![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811213155754.png)
>
> ![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811190609598.png)
>
> - [ECMA 262 spec Promise Resolve Functions](https://tc39.es/ecma262/#sec-promise-reject-functions) 
> - [ECMA 262 spec NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-promise.prototype.then) 
>
> 如果我们仔细看过规范后，其实就会发现，规范中说的很明确，大概意思就是在 resolve 一个 thenable 时，ECMA 262 规定这个动作必须通过一个 job `NewPromiseResolveThenableJob` 以异步的方式来完成，也就是说这个 job 其实执行了一个微任务，后面在执行 `NewPromiseResolveThenableJob` 时又调用了 then 函数（类似我们上面手写 Promise 时，如果返回 Promise 的话，内部回调用这个 Promise 的 then 方法），这个时候又执行了一个微任务，所以是两次微任务。

在 Chrome V8 的 `Promise.then` 实现中，就严格遵守了这一规范，这里需注意一下，我们上面的 Promise 手写实现遵循的是 Promise/A+ 规范，这个是 ECMA 262 规范，所以我们上面写的也不错，只是我们在面试或者做这种考查输出的题时还是以浏览器为标准的，所以 ECMA 262 要晓得，我们只要知道在返回一个 Promise 对象时，浏览器对其内部的实现会产生 2 次微任务就行，不用刻意纠结，记住就好，没必要扒 V8 源码，意义不大。

那接下来，我们按照浏览器的标准从零再来解释一下这道题。

程序回到最初的状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200000107.png)

首先整个程序会作为一个宏任务第一批执行：

- P1 中直接使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，`P1-t1` 的 then 方法执行时，由于是成功态 `Fulfilled`，所以 `P1-t1` 直接作为微任务入队等待执行。
- 接着 `P1-t2` 的 then 方法开始执行，由于 `P1-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P1-t2` 回调使用微任务方法包裹缓存进 `P1-t1返` 这个 Promise 实例中。
- P2 中也是使用 Promise 构造函数中的 resolve 方法创建了一个成功态的实例，`P2-t1` 的 then 方法执行时，由于是成功态 `Fulfilled`，所以 `P2-t1` 直接作为微任务入队等待执行。
- 接着 `P2-t2` 的 then 方法开始执行，由于 `P2-t1` 回调还在队列中，上一个 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t2` 回调使用微任务方法包裹缓存进 `P2-t1返` 这个 Promise 实例中。
- 接着 `P2-t3` 的 then 方法开始执行，由于 `P2-t2` 的 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t3` 回调使用微任务方法包裹缓存进 `P2-t2返` 这个 Promise 实例中。
- 接着 `P2-t4` 的 then 方法开始执行，由于 `P2-t3` 的 then 方法返回的 Promise 实例状态还是 `pending` ，所以 `P2-t4` 回调使用微任务方法包裹缓存进 `P2-t3返` 这个 Promise 实例中。

现在程序运行的状态如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811200233374.png)

宏任务执行结束，开始依次执行微任务队列中的任务：

- 首先是执行 `P1-t1`，输出 1，由于后面 `P1-t1` 回调中返回的是一个 Promise 对象，所以和规范中一致，创建一个微任务，我们记作 `PRTJob` 入队。

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811215549298.png)

接着开始执行后微任务队列中的 `P2-t1` ：

- `P2-t1` 回调执行，输出 10，返回值是 `undefined` ，这时会调用 `P2-t1`  这个 then 方法中返回的新 Promise 实例的 resolve 方法并将返回值 `undefined` 传入，resolve 方法执行后即 `P2-t1返` 实例状态更改为成功态 `Fulfilled` ，并执行 `P2-t1返` 实例的缓存方法。
-  `P2-t1返` 实例中存有被微任务方法包裹的 `P2-t2` ，执行其微任务方法，`P2-t2` 入队，最后 `P2-t1` 出队

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811215851046.png)

按照微任务队列中的顺序，要开始执行 `PRTJob` 这个回调了：

-  `PRTJob` 是在内部调用的，所以没有任何输出， `PRTJob` 在执行时，就是走 `NewPromiseResolveThenableJob`  规范，又因为执行时其内部调用了 then 方法，所以此时会作为一个微任务再次入队（第二次微任务），这里我们记作 `P1-t1返` 回调。
-  `P1-t1返` 回调还在队列中，所以 `P1-t1` 的 then 方法返回的 Promise 实例的状态还是 `pending`，所以后续的 `P1-t2` 还是无动作存在缓存数组中。

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811221429813.png)

- 接着执行微任务队列中的 `P2-t2` ，输出 20，`P2-t3` 入队，`P2-t2` 出队。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811221632681.png)

- 接着执行微任务队列中的 `P1-t1返` 回调，同样是内部调用，无输出，该回调内部执行完实例的 resolve 方法后，`P1-t1` 的 then 方法返回的 Promise 也就是 `P1-t1返` 这个Promise 实例终于变成了成功态 `Fulfilled`，接着清空实例的缓存， `P1-t2` 入队，`P1-t1返` 回调出队。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811222333433.png)

- 接着执行微任务队列中的 `P2-t3`，输出 30，`P2-t4` 入队，`P2-t3` 出队。
- 再执行微任务队列中的 `P1-t2`，输出 2，`P1-t2` 出队，P1 执行结束。
- 接着执行微任务队列中的 `P2-t4`，输出 40，`P2-t4` 出队，P2 执行结束。

最终程序执行输出结果如下：

```js
// 1 10 20 30 2 40
```



### 增强版

上面那个小例子只是单纯返回了一个 Promise，我们再给它接个 then 试试看：

```js
Promise.resolve().then(() => {
  console.log(1);
  return Promise.resolve(2).then(res=>{
    return res
  });
}).then(res => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(10);
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30);
}).then(() => {
  console.log(40);
})
```

浏览器控制台里运行此段代码后，我们发现输出的结果是：

```js
// 1 10 20 30 2 40
```

诶？为什么接了一个 then 后输出顺序和没有接 then 是时候一样，没有变化？

再来接一个 then 试试，如下：

```js
Promise.resolve().then(() => {
  console.log(1);
  return Promise.resolve(2).then(res=>{
    return res
  }).then(res=>{
    return  res
  })
}).then(res => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(10);
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30);
}).then(() => {
  console.log(40);
})
```

现在我们在返回的 `Promise.resolve(2)` 后面接了 2 个 then 方法，来看输出结果：

```js
// 1 10 20 30 40 2
```

诶？输出结果又变了，可以看到，在只返回一个单纯的 Promise 对象时和在 Promise 对象后跟一个 then 方法的输出结果是一样的，但是返回的 Promise 后面跟 2 个以上的 then 方法时，又会影响到输出顺序，这是为什么呢？

其实很简单，还按照我们之前的套路画一个入队的图就知道了，上面我们已经介绍过了单纯的返回一个 `Promise.resolve(2)` 的程序微任务入队出队图。这里就不给大家画详细的图了，我们口述一下，最后简单画一个程序整体微任务队列入队出队图。

回顾 No.1 中只返回一个 `Promise.resolve(2)` 的程序，我们看它整体的微任务队列图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811222848424.png)

我们再来看 `Promise.resolve(2).then(res => return res)` 的程序：

- 由于多了一个 then，整个程序除了之前说的 P1 和 P2，我们将 `Promise.resolve(2).then(res => return res)` 记作 P3，多出的这一个 then 方法我们记作 `P3-t1` 。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811210304349.png)

简单口述一下各个微任务的入队出队顺序，大家可以跟着在纸上画一下：

- 程序主体作为一个宏任务第一批次执行。
- P1 中由于是 `Promise.resolve()` ，所以直接返回成功态 Promise，`P1-t1` 入队。
- `P1-t2` 的 then 方法执行，由于上一个 then 方法返回的 Promise 还在等待态 `pending` ，所以缓存到 `P1-t1返` 这个 Promise 实例等待执行。
- P2 中也是 `Promise.resolve()` ，所以直接返回成功态 Promise，`P2-t1` 入队。
- P2 后续的 `P2-t2`、`P2-t3`、`P2-t4` 各自缓存进其上一个 then 方法返回的 Promise 实例中

宏任务结束，开始执行微任务队列：

- `P1-t1` 执行，输出 1，接着执行 `return Promise.resolve(2).then(...)`，`P3-1` 入队。
- 由于 `P1-t1` 回调的返回值为 Promise 对象，所以创建 `PRTJob` 入队。`P1-t1` 回调执行结束出队。
- 接着执行微任务队列中的 `P2-t1` 回调，输出 10，`P2-t1返` 实例变为成功态 `Fulfilled`，`P2-t2` 入队。
- 接着执行微任务队列中的 `P3-t1` 回调，`P3-t1` 的 then 方法返回的 Promise 实例状态改为成功态 `Fulfilled`，无输出，执行结束 `P3-t1` 出队。
- 接着执行微任务队列中的 `PRTJob` 回调，由于 `P3-t1` 中返回的 Promise 实例状态为成功态 `Fulfilled`，所以 `PRTJob` 执行时，调用 then 方法 `P1-t1返` 回调直接入队，`PRTJob` 出队。
- 接着执行微任务队列中的 `P2-t2` 回调，输出 20，`P2-t2返` 实例变为成功态 `Fulfilled`，`P2-t3` 入队， `P2-t2` 出队。
- 接着执行微任务队列中的 `P1-t1返` 回调， `P1-t1返` 实例变为成功态 `Fulfilled`，`P1-t2` 入队， `P1-t1返` 出队 。
- 接着执行微任务队列中的 `P2-t3` 回调，输出 30，`P2-t3返` 实例变为成功态 `Fulfilled`，`P2-t4` 入队， `P2-t3` 出队 。
- 接着执行微任务队列中的 `P1-t2` 回调，输出 2， `P1-t2` 出队，P1 结束。
-  接着执行微任务队列中的 `P2-t4` 回调，输出 40， `P2-t4` 出队，P2 结束。

整个程序微任务入队出队顺序如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811225121431.png)



再来看 `Promise.resolve(2).then(...).then(...)` 的程序：

- 由于多了两个 then，整个程序除了之前说的 P1 和 P2，我们将 `Promise.resolve(2).then(...).then(...)` 记作 P3，两个 then 方法我们分别记作 `P3-t1`、`P3-t2` 。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811225621580.png)

简单口述一下各个微任务的入队出队顺序，和上面一样，大家可以跟着在纸上画一下：

- 程序主体作为一个宏任务第一批次执行。
- P1 中由于是 `Promise.resolve()` ，所以直接返回成功态 Promise，`P1-t1` 入队。
- `P1-t2` 的 then 方法执行，由于上一个 then 方法返回的 Promise 还在等待态 `pending` ，所以缓存到 `P1-t1返` 这个 Promise 实例等待执行。
- P2 中也是 `Promise.resolve()` ，所以直接返回成功态 Promise，`P2-t1` 入队。
- P2 后续的 `P2-t2`、`P2-t3`、`P2-t4` 各自缓存进其上一个 then 方法返回的 Promise 实例中

宏任务结束，开始执行微任务队列：

- `P1-t1` 执行，输出 1，接着执行 `return Promise.resolve(2).then(...)`，`P3-t1` 入队。
- 由于 `P1-t1` 回调的返回值为 Promise 对象，所以创建 `PRTJob` 入队。`P1-t1` 回调执行结束出队。
- 接着执行微任务队列中的 `P2-t1` 回调，输出 10，`P2-t1返` 实例变为成功态 `Fulfilled`，`P2-t2` 入队。
- 接着执行微任务队列中的 `P3-t1` 回调，`P3-t1` 的 then 方法返回的 Promise 实例状态改为成功态 `Fulfilled`，无输出，执行结束 `P3-t2` 入队， `P3-t1` 出队。
- 接着执行微任务队列中的 `PRTJob` 回调，由于 `P3-t2` 还在队列中，即返回的实例状态还在等待态 `pending`， 所以 `PRTJob` 执行时，调用实例的 then 方法会直接存入实例缓存，等待 `P3-t2` 回调执行后状态为成功态 `Fulfilled`时调用，`PRTJob` 出队。
- 接着执行微任务队列中的 `P2-t2` 回调，输出 20，`P2-t2返` 实例变为成功态 `Fulfilled`，`P2-t3` 入队， `P2-t2` 出队。
- 接着执行 `P3-t2` 回调，`P3-t2` 这个 then 方法返回的 Promise 状态改为成功态 `Fulfilled`，这时，内部调用其实例的 then 方法，规范中说的返回 Promise时产生的第二次微任务 `P1-t1返` 回调入队。
- 接着执行微任务队列中的 `P2-t3` 回调，输出 30，`P2-t3返` 实例变为成功态 `Fulfilled`，`P2-t4` 入队， `P2-t3` 出队 。
- 接着执行微任务队列中的 `P1-t1返` 回调， `P1-t1返` 实例变为成功态 `Fulfilled`，`P1-t2` 入队， `P1-t1返` 出队 。
- 接着执行微任务队列中的 `P2-t4` 回调，输出 40， `P2-t4` 出队，P2 结束。
- 接着执行微任务队列中的 `P1-t2` 回调，输出 2， `P1-t2` 出队，P1 结束。

整个程序微任务入队出队顺序如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811231115853.png)

至于为什么一个 then 和不带 then 的输出结果一致，我们来看三个程序的微任务入队出队顺序对比就知道了：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210811231822398.png)

其实，主要是因为在返回的 Promise 对象后写一个 then，由于这个 then 的上个 Promise 是 `Promise.resolve()` ，状态是成功态，所以会先入队。返回一个 Promise 所造成的两次微任务，第二次是调用传入 Promise 对象的 then 方法，只要调用前该 Promise 实例的状态是成功态 `Fulfilled` 即可。直接返回 `Promise.resolve()` 的话，其状态直接就是成功态 `Fulfilled` ，而在返回的 Promise 后写两个及以上的 then，那传入到内部的 Promise 实例的就需要等最后一个 then 返回的 Promise 实例状态为成功态 `Fulfilled` 时才能执行。

如果看不懂我的描述也没关系，会画图就可以，按照我们的套路走即可。



## async/await+Promise执行

### 基础版

async/await 其实就是 Generator + Promise 的一个语法糖，不过它也有很多坑。

来看下面这个例子：

```js
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
}
async1();

new Promise(resolve => {
  console.log(10);
  resolve();
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30)
}).then(() => {
  console.log(40)
})
```

这个例子在老版本浏览器和新版本浏览器中是有差异的，主要还是浏览器的内部实现。

可以简单的这样理解，await 下面的代码会被作为一个微任务入队。

接下来我们来逐步分析：

- 首先，整体作为一个宏任务开始执行。
- 运行 `async1()` ，函数 async1 开始执行，输出 1，遇到 await，执行 `async2`，输出 3，await 下面的代码作为微任务入队。
- 接着执行 `new Promise()` 的回调，输出 10，`resolve` 的执行让返回的 Promise 实例状态变为了成功态 `Fulfilled`。
- 执行第一个 then 方法，由于接上一个 Promise 返回的实例是成功态 `Fulfilled` ，所以第一个 then 方法回调直接入队。
- 执行第二个 then 方法，由于第一个 then 方法回调还在队列中没有执行，所以上一个 Promise 返回的实例还是等待态 `pending` ，将第二个 then 方法回调由微任务方法包裹缓存进实例数组。
- 执行第三个 then 方法，由于第二个 then 方法回调还在队列中没有执行，所以上一个 Promise 返回的实例还是等待态 `pending` ，将第三个 then 方法回调由微任务方法包裹缓存进实例数组。

到此，宏任务结束，开始执行微任务队列的任务。

- 首先，执行先入队的 async1 方法中 await 下面的代码回调，输出 2，然后出队。
- 接着，执行队列中的第一个 then 回调，输出 20，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，所以第二个 then 方法回调入队，第一个 then 方法出队。
- 接着，执行队列中的第二个 then 回调，输出 30，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，所以第三个 then 方法回调入队，第一个 then 方法出队。
- 接着，执行队列中的第三个 then 回调，输出 40，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，实例上缓存数组为空，第三个 then 方法出队，程序结束。

最终的输出结果为：

```js
// 1 3 10 2 20 30 40
```



### 增强版

题目简单一变，又能迷倒一大群人，如下：

```js
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
  return Promise.resolve()
}
async1();

new Promise(resolve => {
  console.log(10);
  resolve();
}).then(() => {
  console.log(20);
}).then(() => {
  console.log(30)
}).then(() => {
  console.log(40)
})
```

可以看到，之前的代码中 `async2` 函数没有写 return ，也就是返回的是一个 undefined，由于是 `async` 吗，最终函数是返回一个值为 undefined 的 Promise 对象，但现在我们在 `async2` 函数中返回了一个 Promise 对象。。。

输出一下，顺序变了：

```js
// 1 3 10 20 30 2 40
```

聪明的小伙伴可能已经看出蹊跷来了，之前在说 Promise 的时候，我们就在说如果返回的是一个正常的值，Promise 内部会正常 resolve 出去，但是如果返回的是一个新的 Promise 对象，内部会产生 2 个微任务。

那这里为了方便理解，其实也完全可以按照这种思路来走。

现在我们在 `async2` 函数中返回了一个 Promise 对象，相当于多产生了 2 次微任务，所以输出中 2 的顺序后移了 2 位。

整体流程大概就是：

- 首先，整体作为一个宏任务开始执行。
- 运行 `async1()` ，函数 async1 开始执行，输出 1，遇到 await，执行 `async2`，先输出 3，由于`async2` 中返回的是 Promise 对象，解析时产生的第一个微任务入队。
- 接着执行 `new Promise()` 的回调，输出 10，`resolve` 的执行让返回的 Promise 实例状态变为了成功态 `Fulfilled`。
- 执行第一个 then 方法，由于接上一个 Promise 返回的实例是成功态 `Fulfilled` ，所以第一个 then 方法回调直接入队。
- 执行第二个 then 方法，由于第一个 then 方法回调还在队列中没有执行，所以上一个 Promise 返回的实例还是等待态 `pending` ，将第二个 then 方法回调由微任务方法包裹缓存进实例数组。
- 执行第三个 then 方法，由于第二个 then 方法回调还在队列中没有执行，所以上一个 Promise 返回的实例还是等待态 `pending` ，将第三个 then 方法回调由微任务方法包裹缓存进实例数组。

到此，宏任务结束，开始执行微任务队列的任务。

- 首先，执行 `async2` 中返回 Promise 对象解析时所产生的第一个微任务，无输出，然后产生的第二个微任务入队，产生的第一个微任务出队。
- 接着，执行队列中的第一个 then 回调，输出 20，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，所以第二个 then 方法回调入队，第一个 then 方法出队。
- 接着，执行 `async2` 中返回 Promise 对象解析时所产生的第二个微任务，无输出，然后 `async1` 函数中 await 下面的代码作为微任务入队，返回 Promise 对象解析时所产生的第二个微任务出队。
- 接着，执行队列中的第二个 then 回调，输出 30，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，所以第三个 then 方法回调入队，第一个 then 方法出队。
- 接着，执行 `async1` 函数中 await 下面代码产生的微任务，输出 2，随后出队。
- 接着，执行队列中的第三个 then 回调，输出 40，返回undefined，内部执行 `resolve(undefined)` 后返回的实例状态改为成功态 `Fulfilled`，并执行实例上的缓存方法，实例上缓存数组为空，第三个 then 方法出队，程序结束。

最终的输出结果即：

```js
// 1 3 10 20 30 2 40
```

其实，还可以在 `async2` 函数返回的 `Promise.resolve()` 后面加一个 then 方法，你会发现输出顺序还是上面这种，加 2 个及以上的 then 方法 输出结果的 2 才会产生后移。有没有发现哪里相似？

没错，和我们上面 Promise 中说过的案例如出一辙，这里就不再唠叨了，感兴趣可以自己写一写、画一画。。

其实由于规范在改动，浏览器也在不断升级，所以执行顺序这个东西真的是很扯淡。。。我们了解就好，只要能解释为什么，最终结果不用过分在意。。



## 杂七杂八的混编执行

最后来一个混编的题型，以应对多个宏任务+多个微任务的场景下：

```js
new Promise((reslove, reject) => {
  setTimeout(() => {
    console.log(10);
  }, 2000);
  setTimeout(() => {
    console.log(20);
  }, 1000);
  reslove();
}).then(() => {
  console.log(1);
  return new Promise((reslove, reject) => {
    console.log('1-1');
    setTimeout(() => {
      console.log(30);
      reslove();
    }, 500);
  });
}).then(() => {
  console.log(2);
  return new Promise((reslove, reject) => {
    console.log('2-1');
    setTimeout(() => {
      console.log(40);
      reslove();
    }, 200);
  });
}).then(() => {
  console.log(3);
});
```

首先，还是为程序中各个部分做一个拆分命名。

- 程序中所有的 `setTimeout` 使用 `timer+定时的ms数字` 命名。
- 最外部的 Promise 记作 P1，`new Promise` 的回调记作 `P1-主`，其下三个 then 方法分别记作 `P1-t1`，`P1-t2`，`P1-t3`。
- `P1-t1` 中返回的 `new Promise` 实例记作 P2，其实例参数回调记作 `P2-主`。
- `P1-t2` 中返回的 `new Promise` 实例记作 P3，其实例参数回调记作 `P3-主`。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812041257886.png)

上图为程序初始化状态，多了一个宏任务队列，我们慢慢来看。

首先整个程序作为一个宏任务先执行：

- `P1-主` 执行，遇到 `timer2000` ，`setTimeout` 为异步宏任务，通过事件触发线程将其移交给定时触发器线程处理，等待其 `2000ms` 定时结束其回调入宏任务队列。接着执行，遇到 `timer1000` ，`setTimeout` 为异步宏任务，通过事件触发线程将其移交给定时触发器线程处理，等待其 `1000ms` 定时结束其回调入宏任务队列。最后执行 resolve 方法将返回的 Promise 实例状态改为成功态 `Fulfilled`。
- 由于 `new Promise` 实例参数回调中已经调用 resolve 方法，所以返回的 Promise 实例 `P1-主返` 状态为成功态 `Fulfilled` ，`P1-t1` 的 then 方法执行时，直接入微任务队列。
- `P1-t2` 由于 `P1-t1` 还在回调中，其返回的 Promise 实例 `P1-t1返` 状态为等待态 `pending` ，所以 `P1-t2` 回调被微任务方法包裹存入 `P1-t1返` 实例缓存数组中。
- `P1-t3` 由于 `P1-t2` 回调还未执行，其返回的 Promise 实例 `P1-t2返` 状态为等待态 `pending` ，所以 `P1-t3` 回调被微任务方法包裹存入 `P1-t2返` 实例缓存数组中。

此时程序运行状态如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812050426816.png)

到此第一轮宏任务执行完毕，开始执行微任务队列。

- 执行 `P1-t1` 回调，先输出 1，接着执行 return 的 Promise 实例参数回调 `P2-主` ，输出 `1-1`，又遇到了 `setTimeout` ，通过事件触发线程将其移交给定时触发器线程处理，等待其 `500ms` 定时结束其回调入宏任务队列，由于 resolve 方法是在定时器中执行的，所以此时 通过 new Promise 创建的 Promise 实例状态还是等待态 `pending`。
- 由于 `P1-t1` 最终返回的是一个 Promise 对象，所以和规范中一致，创建第一个微任务 job，我们记作 `PRTJob1` 入微任务队列。到此 `P1-t1` 出队。
- 接着执行微任务队列中的任务，即 `PRTJob1` 回调，执行结束后，开始执行 `P1-t1` 中 return 的 `new Promise` 实例的 then 方法（ 该方法执行后会返回 `P1-t1返` 实例 ），由于 `P1-t1` 中 return 的 `new Promise` 实例还是等待态 `pending`，所以 `P1-t1` 中 return 的 `new Promise` 实例的 then 方法回调（记作 `P1-t1返` 回调）被微任务方法包裹存入 `P1-t1返` 实例缓存数组中。

此时程序状态如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812052915966.png)

这时微任务队列已经执行完毕，宏任务队列没有任务，500ms 后，定时器触发线程的 `timer500` 执行有了结果后将其回调送入宏任务队列。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812053231056.png)

此时主线程空闲，突然宏任务队列有了任务，所以立即取宏任务队列的第一个任务在 JS主执行栈执行，即开始执行新的宏任务 `timer500`。

- 执行 `timer500` 回调，输出 30，再接着执行 resolve 方法，此时 `P1-t1` 中 return 的 `new Promise` 实例状态改为了成功态 `Fulfilled` ，并执行其实例中的缓存，即 `P1-t1返` 回调入微任务队列。

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812054947123.png)

宏任务执行完毕，开始执行当前宏任务所产生的所有微任务。

- 执行微任务队列中的  `P1-t1返`  回调，修改 `P1-t1返`  实例的状态为成功态 `Fulfilled` ，执行其实例上的缓存，所以 `P1-t2` 入微任务队列。
- 接着执行微任务队列的  `P1-t2` 回调，输出 2，接着执行 return 的 Promise 实例参数回调 `P3-主` ，输出 `2-1`，又遇到了 `setTimeout` ，通过事件触发线程将其移交给定时触发器线程处理，等待其 `200ms` 定时结束其回调入宏任务队列，由于 resolve 方法是在定时器中执行的，所以此时通过 new Promise 创建的 Promise 实例状态还是等待态 `pending`。
- 由于 `P1-t2` 最终返回的是一个 Promise 对象，所以和规范中一致，创建第一个微任务 job，我们记作 `PRTJob2` 入微任务队列。到此 `P1-t2` 出队。
- 接着执行微任务队列中的任务，即 `PRTJob2` 回调，执行结束后，开始执行 `P1-t2` 中 return 的 `new Promise` 实例的 then 方法（ 该方法执行后会返回 `P1-t2返` 实例 ），由于 `P1-t2` 中 return 的 `new Promise` 实例还是等待态 `pending`，所以 `P1-t2` 中 return 的 `new Promise` 实例的 then 方法回调（记作 `P1-t2返` 回调）被微任务方法包裹存入 `P1-t2返` 实例缓存数组中。

此时程序状态如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812055803586.png)

这时微任务队列已经执行完毕，宏任务队列没有任务，200ms 后，定时器触发线程的 `timer200` 执行有了结果后将其回调送入宏任务队列。

此时主线程空闲，突然宏任务队列有了任务，所以立即取宏任务队列的第一个任务在 JS主执行栈执行，即开始执行新的宏任务 `timer200`。

- 执行 `timer200` 回调，输出 40，再接着执行 resolve 方法，此时 `P1-t2` 中 return 的 `new Promise` 实例状态改为了成功态 `Fulfilled` ，并执行其实例中的缓存，即 `P1-t2返` 回调入微任务队列。

如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812060417634.png)

宏任务执行完毕，开始执行当前宏任务所产生的所有微任务。

- 执行微任务队列中的  `P1-t2返`  回调，修改 `P1-t2返`  实例的状态为成功态 `Fulfilled` ，执行其实例上的缓存，所以 `P1-t3` 入微任务队列。
- 接着执行微任务队列的  `P1-t3` 回调，输出 3。到这本轮微任务执行结束。

此时程序状态如下图：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210812061113544.png)

由于宏任务队列没有任务，此时主线程空闲，（1000ms-500ms-200ms） 后，定时器触发线程的 `timer1000` 执行有了结果后将其回调送入宏任务队列。

宏任务队列有了任务，所以立即取宏任务队列的第一个任务在 JS主执行栈执行，即开始执行新的宏任务 `timer1000`。

- 执行 `timer1000` 回调，输出 20，没有产生微任务，所以本轮执行结束。

由于宏任务队列没有任务，此时主线程空闲，（2000ms-1000ms） 后，定时器触发线程的 `timer2000` 执行有了结果后将其回调送入宏任务队列。

宏任务队列有了任务，所以立即取宏任务队列的第一个任务在 JS主执行栈执行，即开始执行新的宏任务 `timer2000`。

- 执行 `timer2000` 回调，输出 10，没有产生微任务，所以本轮执行结束。

到此整个程序结束，最终输出：

```js
// 1 1-1 30 2 2-1 40 3 20 10
```

Get 到了吗？



## 写在最后

那么，看懂了吗？看得懂最好了，看不懂也没必要懊恼，只要理解 JS运行机制以及 Promise 的核心概念对一些简单的执行顺序可以做出准确的分析即可，本文的内容对实际开发帮助不大，因为真的不敢想象开发中如果出现了这种基于复杂的调用顺序而写的代码是一件多么糟糕的事情，奈何还真有很多企业面试时会问这些无聊的问题，所以了解这些，从此就不用担心这类面试题了。

不清楚的地方请评论区留言，欢迎指错勘误！

最后，码字不易，画图更不易，点赞、点赞、点赞！欢迎关注 [「硬核JS」](https://juejin.cn/column/6960559453037199391) 专栏，Get 更多 JS 知识哦！！
