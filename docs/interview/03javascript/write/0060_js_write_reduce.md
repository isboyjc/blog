# JS 实现数组 reduce 方法

## 题干

`JavaScript` 中数组原型方法 [reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 方法对数组中的每个元素执行一个由您提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值。

其语法为：

```js
reduce(callbackFn)
reduce(callbackFn, initialValue)

function reducer(previousValue, currentValue, currentIndex, arr){}

// callbackFn:       必须，reducer 函数
//   previousValue:  必需。上一次调用 callbackFn 时的返回值
//   currentValue:   必需。数组中正在处理的元素
//   currentIndex:   可选。数组中正在处理的元素的索引
//   arr:            可选。用于遍历的数组
// initialValue:     可选。传递给函数的初始值，相当于 previousValue 的初始值
```

简单来说就是对一个 `array` 执行 `reduce` 方法，就是把其中的 `function()` 挨个地作用于 `array` 中的元素上，而且上一次的输出会作为下一次的一个输入。

注意：`reduce` 对于空数组是不会执行回调函数的。


### 🌰.01

下面是一个 `reduce` 方法示例：

```js
let array = [1, 2, 3, 4, 5];
array.reduce((sum, curr) => sum + curr, 0); // 15
```


## 题解

```js
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue === undefined ? undefined : initialValue;
  for (let i = 0; i < this.length; i++) {
    if (accumulator !== undefined) {
      // 如果初始值不为 undefined，则将其赋值给累加器；否则，将数组的第一个元素赋值给累加器。
      accumulator = callback.call(undefined, accumulator, this[i], i, this);
    } else {
      accumulator = this[i];
    }
  }
  return accumulator;
};

console.log([1,2,3,4,5].myReduce((pre, cur, curIdx, arr) => pre + cur)) // 15
console.log([1,2,3,4,5].myReduce((pre, cur, curIdx, arr) => pre + cur, 10)) // 25
```