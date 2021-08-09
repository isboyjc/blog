# 「硬核JS」解Promise迷惑行为—JS运行机制补充

## 写在前面

Promise用起来很简单，JavaScript运行机制其实也不难，但是运行机制和 Promise 挂钩之后，往往就能把人迷的晕头转向，如果你也是如此，那此文就能解惑。

事情的起因是前几天有小伙伴看了我 2 年前写的 [「硬核JS」一次搞懂JS运行机制](https://juejin.cn/post/6844904050543034376) 后私信给我提出的疑问，说是运行机制是懂了，可是关于 Promise  的种种迷惑行为（各种嵌套输出、链式 `then` 等等）还是不太懂。其实那篇文章的核心本来就只是运行机制，而对于 Promise 迷惑行为拿捏不准的小伙伴是因为对 Promise 的整体实现机制不太了解导致的。

此文算是对 Promise+运行机制的一个梳理与补充

列了 5 种 Promise 题型，几乎涵盖所有 Promise 难搞题型了，总之，跟着思路走，目的只有一个：彻底搞明白 Promise+运行机制的各种迷惑行为。。。



## JS运行机制简单回顾

JavaScript 中有同步/异步任务的概念，同步任务在主线程上执行，会形成一个 `执行栈`，主线程之外，事件触发线程管理着一个 `任务队列`，只要异步任务有了运行结果，就在 `任务队列` 之中放一个事件回调。一旦 `执行栈` 中的所有同步任务执行完毕，就会读取 `任务队列`，将可运行的异步任务（任务队列中的事件回调，只要任务队列中有事件回调，就说明可以执行）添加到执行栈中，开始执行

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

简单来说，一段完整的 JS 代码，浏览器会将整体的 script（作为第一个宏任务）开始执行，所有代码分为`同步任务`、`异步任务`两部分；

同步任务直接进入主线程执行栈依次执行，异步任务会再分为普通异步任务（也是宏任务），和特殊异步任务（即微任务）；

普通的异步任务等有了运行结果其回调就会进入事件触发线程管理的 `任务队列`（可理解为宏任务队列）；

特殊的异步任务也就是微任务的回调会立即进入一个微任务队列；

当主线程内的任务执行完毕，即主线程为空时，会检查微任务队列，如果有任务，就全部执行，如果没有就执行下一个宏任务（事件触发线程管理的 `任务队列` 中）；

上述过程会不断重复，这就是Event Loop，事件循环；

浏览器中加上渲染的话就是先执行一个宏任务，再执行当前所有的微任务，接着开始执行渲染，然后再执行下一个宏任务，这样子循环。。。

简单回顾，详细请看 👉 [「硬核JS」一次搞懂JS运行机制](https://juejin.cn/post/6844904050543034376) 



## Promise手写实现

### Promises/A+

Promises/A+标准是一个开放、健全且通用的 JavaScript Promise 标准，由开发者制定，供开发者参考

很多 Promise 三方库都是按照 Promises/A+标准实现的

so，此次实现我们严格 Promises/A+标准，包括完成后我们会使用开源社区提供的测试包来测试

简单来说，测试通过的话，足以证明代码符合 Promises/A+标准，是合法的、完全可以上线提供给他人使用的



### 构造方法核心基础搭建

- Promise 有三种状态进行中（Pending）、已完成（Resolved/Fulfilled）和已失败 （Rejected）
- Promise 是一个构造方法，实例化 Promise 时传入一个函数作为处理器
  - 处理器函数有两个参数（resolve 和 reject）分别将结果变为成功态和失败态
  - Promise 对象执行成功了要有一个结果，通过 resolve 传递出去，失败的话失败原因通过 reject 传递出入
- Promise 的原型上定义着 then 方法

那么根据我们上面的这些已知需求我们可以写出一个基础的结构（写法千千万，喜欢 class 也可以用 class）

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

如上所示，我们创建了一个 Promise 构造方法，`state` 属性保存了 Promise 对象的状态，使用 `value` 属性保存 Promise 对象执行成功的结果，失败原因使用 `reason` 属性保存，这些命名完全贴合 Promises/A+标准

接着我们在构造函数中创建了 `resolve` 和 `reject` 两个方法，然后在构造函数的原型上创建了一个 `then` 方法，以备待用

### 初始化实例 executor 立即执行

我们知道，在创建一个 Promise 实例时，处理器函数 `executor` 是会立即执行的，所以我们更改代码

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

Promises/A+ 规范中规定，当 Promise 对象已经由 pending 状态改变为成功态 `resolved` 或失败态 `rejected` 后不可再次更改状态，也就是说成功或失败后状态不可更新已经凝固

因此我们更新状态时要判断，如果当前状态是等待态 `pending` 才可更新，由此我们来完善 `resolve` 和 `reject` 方法

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

如上所示，首先我们在 Promise 构造函数内部用变量 `_this` 托管构造函数的 `this`

接着我们在 `resolve` 和 `reject` 函数中分别加入了判断，因为只有当前态是 pending 才可进行状态更改操作

同时将成功结果和失败原因都保存到对应的属性上

然后将 state 属性置为更新后的状态

### then 方法基础实现

接着我们来简单实现 `then` 方法

首先 `then` 方法有两个回调，当 Promise 的状态发生改变，成功或失败会分别调用 `then` 方法的两个回调

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

如上所示，由于 `onFulfilled & onRejected` 两个参数都不是必选参，所以我们在判断状态后又判断了参数类型，当参数不为函数类型，就不执行，因为在 Promises/A+规范中定义非函数类型可忽略

### 让 Promise 支持异步

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

setTimeout 函数让`resolve`变成了异步执行，有延迟，调用`then`方法的时候，此刻状态还是等待态 `pending`，`then`方法即没有调用`onFulfilled`也没有调用`onRejected`

嗯，清楚原因开始改造。

我们可以在执行`then`方法时如果还在等待态 `pending`，就把回调函数临时寄存到队列（就是一个数组）里，当状态发生改变时依次从数组中取出执行就好了

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

如上所示，我们改写`then`方法，除了判断成功态 `resolved`、失败态 `rejected`，我们又加了一个等待态 `pending` 判断，当状态为等待态时，异步代码还没有走完，那么我们把对应的回调先存入准备好的数组中即可

最那么，就差最后一步执行了，我们在 `resolve` 和 `reject` 方法中调用即可

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

到了这里，我们已经完成了 Promise 的异步支持



### 实现 Promise 经典的链式调用

Promise 的`then`方法可以链式调用，这也是 Promise 的精华之一，在实现起来也算是比较复杂的地方了

首先我们要理清楚`then`的需求是什么，这需要仔细看 Promises/A+ 规范中对`then`方法的返回值定义及 Promise 解决过程，当然你如果仔细阅读了上文`then`方法的使用大概也清楚了，我们在这里再次总结下

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

当然还没有，我们都知道，Promise 中处理器函数是同步执行，而`then`方法是异步且是个微任务，但是我们完成这个还是同步

解决这个问题其实也很简单，我们可以使用 `queueMicrotask` 方法实现一个微任务，在`then`方法内执行处的所有地方使用 `queueMicrotask` 变为微任务即可，`queueMicrotask` API有兼容性问题，大多数 Promise 库中此处的实现是递进的策略，简单说就是有好几种微任务实现方案，依次向下，如果都不兼容的话最后使用 `setTimeout`，如下

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

实现了最复杂的`then`方法后，`catch`实现非常简单，一看就懂了

```js
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```

### 代码测试

开源社区提供了一个包用于测试我们的代码是否符合 Promises/A+规范：`promises-aplus-tests`

首先我们要为该测试包提供一个 `deferred` 钩子，用于测试

如下，将下面代码防止我们的 `Promise.js` 文件末尾即可

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

其他的 resolve/reject/race/all 等比较简单，不在这里描述了

给大家贴个我这边 Promise 多个方法实现的地址，大家有兴趣自行看代码吧，注释写的很详细了，也就大概 200 多行代码

- [Promise/A+实现](https://github.com/isboyjc/promise) 



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
```





## Promise嵌套执行





## 嵌套返回新Promise





## 特殊情况Promise.resolve()





## async/await+Promise执行





























