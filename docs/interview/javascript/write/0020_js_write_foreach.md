# JS 实现数组 forEach 方法

## 题干

`JavaScript` 中数组原型方法 [forEach](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 可以用于遍历数组并对每个元素执行指定操作。

`forEach` 方法不会返回新的数组，而是在原始数组上执行指定操作。

语法如下：

```js
forEach(callbackFn)
forEach(callbackFn, thisArg)
```

- `callbackFn` -   必选，为数组中每个元素执行的函数，并会丢弃它的返回值，三个参数
  - `element` -    数组中正在处理的当前元素
  - `index` -      数组中正在处理的当前元素的索引
  - `array` -      `forEach` 方法正在操作的数组

- `thisArg` -      可选，执行 `callbackFn` 函数时被用作 `this` 的值

- 返回值 -       `undefined`


## 题解

```js
Array.prototype.myForEach = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
};
```