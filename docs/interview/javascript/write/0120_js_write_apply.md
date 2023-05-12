# JS 实现 apply 方法

## 题干



## 题解

```js
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('not funciton')
  }
  context = context || window
  context.fn = this
  let result
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```