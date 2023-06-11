# JS 实现防抖 debounce 方法

## 题干

防抖（`debounce`）是一种常用的技术，用于限制函数在短时间内被频繁调用。它的基本思想是：如果在一段时间内连续触发同一个事件，只执行最后一次触发的事件。

防抖通常用于处理诸如窗口大小调整、页面滚动、输入框内容改变等事件。例如，当用户在输入框中输入内容时，我们可能希望在用户停止输入一段时间后再执行搜索操作，而不是每次输入都执行搜索。这时，我们就可以使用防抖技术来实现这个需求。


```js
function debounce (callback, delay) { }
```

`debounce` 函数接受两个参数：待执行函数和等待时间（以毫秒为单位）。

它返回一个新的函数，当这个新函数被连续调用时，只有在最后一次调用后的等待时间内没有再次被调用，才会执行原函数。


## 题解

```js
function debounce (callback, delay) {
  // 利用闭包保存定时器
  let timer = null
  return function () {
    let context = this
    let arg = arguments
    // 在规定时间内再次触发会先清除定时器后再重设定时器
    clearTimeout(timer)
    timer = setTimeout(function () {
      callback.apply(context, arg)
    }, delay)
  }
}


// 测试
let input = document.querySelector('input');
let debouncedSearch = debounce(search, 500);

input.addEventListener('input', debouncedSearch);

function search(event) {
  // TODO
} 
```