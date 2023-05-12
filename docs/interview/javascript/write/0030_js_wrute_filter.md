# JS 实现数组 filter 方法

## 题干

`JavaScript` 数组原型方法 [filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 用于创建一个新的数组，其中包含所有通过指定函数测试的元素。

`filter` 方法使用指定函数检测数组中的元素：如果元素满足条件，则将其添加到新数组中。如果所有元素都不满足条件，则返回一个空数组。

语法如下：

```js
filter(callbackFn)
filter(callbackFn, thisArg)
```

- `callbackFn` -   必选，测试数组每个元素的函数。返 `true` 表示通过测试，保留该元素，`false` 反之，三个参数：
  - `element` -    数组中正在处理的当前元素
  - `index` -      数组中正在处理的当前元素的索引
  - `array` -      调用了 `filter` 的数组本身。

- `thisArg` -      可选，执行 `callbackFn` 函数时被用作 `this` 的值

- 返回值 -      一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。


### 🌰.01

下面是一个简单的例子，它创建一个新数组，其中包含所有大于等于18的元素：

```js
let ages = [32, 33, 16, 40];
function checkAdult(age) {
    return age >= 18;
}

ages.filter(checkAdult); // [32, 33, 40]
```

这个例子中，`filter` 方法对 `ages` 数组中的每个元素执行 `checkAdult` 函数。由于数组中有三个元素（32、33 和 40）大于等于 18，所以返回一个新数组，其中包含这三个元素。



## 题解

```js
Array.prototype.myFilter = function(callback, thisArg) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
}

// 测试
let ages = [32, 33, 16, 40];
function checkAdult(age) {
    return age >= 18;
}
ages.myFilter(checkAdult); // [32, 33, 40]
```