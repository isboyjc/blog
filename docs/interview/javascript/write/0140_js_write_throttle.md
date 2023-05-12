# JS 实现节流 throttle 方法

### 题干

节流（`throttle`）是一种优化技术，它可以控制函数的执行频率。在指定的时间内，函数最多只能执行一次。这个技术常用于浏览器中的 `DOM` 事件，例如滚动、调整窗口大小、鼠标移动等。节流可以避免这些事件处理函数被过度调用，从而提高性能。

```js
function throttle (callback, delay) { }
```

`throttle` 函数接受两个参数：待执行函数和等待时间（以毫秒为单位）。

它返回一个新的函数，当这个新函数被连续调用时，在指定的时间内，函数最多只能执行一次。


## 题解

```js
// 时间戳版本
function throttle (callback, delay) {
  // 利用闭包保存时间
  let prev = Date.now()
  return function () {
    let context = this
    let arg = arguments
    let now = Date.now()
    if (now - prev >= delay) {
      callback.apply(context, arg)
      prev = Date.now()
    }
  }
}

// 定时器版本
function throttle(callback, delay) {
  let timer = null;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        callback.apply(this, arguments);
        timer = null;
      }, delay);
    }
  }
}

// 测试
window.onresize = throttle(() => {
  // TODO
}, 500);
```