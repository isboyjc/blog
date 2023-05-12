# JS 实现数组 some 方法

## 题干

`JavaScript` 数组原型方法 [some](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 用于检测数组中是否有元素符合指定条件（通过函数提供）。`some` 方法使用指定函数检测数组中的元素：如果数组中检测到有一个元素满足条件，则整个表达式返回 `true`，且剩余的元素不会再进行检测。如果所有元素都不满足条件，则返回 `false`。

语法：

```js
some(callbackFn)
some(callbackFn, thisArg)


// callbackFn   必选，用来测试每个元素的函数，使用三个参数：
//   element    数组中正在处理的当前元素
//   index      数组中正在处理的当前元素的索引
//   array      forEach 方法正在操作的数组

// thisArg      可选，执行 callbackFn 函数时被用作 this 的值

// 返回值：       数组中有至少一个元素通过回调函数的测试就会返回 true，所有元素都没有通过回调函数的测试返回值才会为 false。
```

### 🌰.01

下面是一个简单的例子，它检查数组中是否有元素大于等于18：

```js
let ages = [3, 10, 18, 20];
function checkAdult(age) {
  return age >= 18;
}

ages.some(checkAdult); // true
```

这个例子中，`some` 方法对 `ages` 数组中的每个元素执行 `checkAdult` 函数。由于数组中有一个元素（18）大于等于 18，所以整个表达式返回 `true`。


## 题解

```js
Array.prototype.mySome = function(callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) return true;
  }
  return false;
}

// 测试
let ages = [3, 10, 18, 20];
function checkAdult(age) {
  return age >= 18;
}
ages.mySome(checkAdult); // true
```