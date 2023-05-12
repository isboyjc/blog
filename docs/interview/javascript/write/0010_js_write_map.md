# JS 实现数组 map 方法

## 题干

`JavaScript` 中数组原型方法 [map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 可以用于遍历数组并返回一个新数组，新数组中的元素为原始数组调用函数处理过后的值。

`map` 方法返回一个新数组，这个新数组由原数组中的每个元素调用一个指定方法后的返回值组成。

`map` 不会对空数组进行检测，也不会改变原始数组。

语法如下：

```js
map(callbackFn)
map(callbackFn, thisArg)
```

- `callbackFn` -      必选，生成新数组元素的函数，三个参数
  - `element` -       数组中正在处理的当前元素
  - `index` -         数组中正在处理的当前元素的索引
  - `array` -         `map` 方法调用的数组
  
- `thisArg` -         可选，执行 `callbackFn` 函数时被用作 `this` 的值

- 返回值 -           新数组



## 题解

```js
Array.prototype.myMap = function (callback, thisArg) {
  let newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback.call(thisArg, this[i], i, this));
  }
  return newArr;
};
```