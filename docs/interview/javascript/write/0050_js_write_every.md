# JS 实现数组 every 方法

## 题干

`JavaScript` 数组原型方法 [every](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every) 用于检测数组所有元素是否都符合指定条件（通过函数提供）。`every` 方法使用指定函数检测数组中的所有元素：如果数组中检测到有一个元素不满足，则整个表达式返回 `false`，且剩余的元素不会再进行检测。如果所有元素都满足条件，则返回 `true`。

语法：

```js
every(callbackFn)
every(callbackFn, thisArg)


// callbackFn   必选，为数组中每个元素执行的函数，使用三个参数：
//   element    数组中正在处理的当前元素
//   index      数组中正在处理的当前元素的索引
//   array      forEach 方法正在操作的数组

// thisArg      可选，执行 callbackFn 函数时被用作 this 的值

// 返回值：       如果 callbackFn 为每个数组元素返回真值，则为 true，否则为 false。
```


### 🌰.01

下面是一个简单的例子，它检查数组中的所有元素是否都大于等于 18：

```js
let ages = [32, 33, 16, 40];
function checkAdult(age) {
  return age >= 18;
}
ages.every(checkAdult); // false
```

这个例子中，`every()` 方法对 `ages` 数组中的每个元素执行 `checkAdult` 函数。由于数组中有一个元素（16）小于 18，所以整个表达式返回 `false`。


## 题解

```js
Array.prototype.myEvery = function(callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (!callback.call(thisArg, this[i], i, this)) return false;
  }
  return true;
}

// 测试
let ages = [32, 33, 16, 40];
function checkAdult(age) {
  return age >= 18;
}
ages.myEvery(checkAdult); // false
```