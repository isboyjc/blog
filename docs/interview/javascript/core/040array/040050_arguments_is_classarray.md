# 为什么函数的 arguments 参数是类数组而不是数组？如何遍历类数组?

## 题干

- 函数的 arguments 参数
- 类数组
- 数组
- 遍历类数组

## 题解

函数的 `arguments` 参数是一个类数组对象，它包含了函数调用时传入的所有参数。它之所以被称为类数组对象，是因为它的结构类似于数组，但并不是一个真正的数组，因为它没有数组的特有方法和属性。

`arguments` 为什么是类数组，这是一件很有意思的事情，网上有一份 JS 作者 `Brendan Eich` 本人探讨 `arguments` 的资料，是一份 [arguments 录音](https://web.archive.org/web/20110822021124/http://minutewith.s3.amazonaws.com/amwb-20101115.mp3) ，大致意思是，`Brendan Eich` 本人也承认 `arguments` 的设计是因为当时只花了十天所以整得太糙了。在正式规范化 JS 的时候，`Microsoft` 曾经有人提出把 `arguments` 改成真正的 `Array`，`Brendan Eich` 本人甚至都打算动手改实现了，但是 `Microsoft` 那边回去商量了下又回来觉得多一事不如少一事，不改了。于是这个糟糕的设计就从此成为了规范...1997 年的第一版 ES 规范中 `arguments` 就作为正牌军存在了。


遍历类数组：

- 使用普通 `for` 循环，根据 `length` 属性和索引访问每个元素。

- 使用数组原型方法 `Array.prototype.forEach`，通过 `call` 方法打针，把类数组作为 `this` 值传入。

- 使用 `Array.from` 、扩展运算符（`…`）等方法先把类数组转化成真正的数组，然后再使用数组的遍历方式。

🌰：

```js
function foo() {
  // 使用for循环
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
  
  // 使用Array.prototype.forEach.call
  Array.prototype.forEach.call(arguments, function(arg) {
    console.log(arg);
  });

  // 使用Array.from或扩展运算符
  let args = Array.from(arguments); // 或 let args = [...arguments];
  args.forEach(function(arg) {
    console.log(arg);
  });
}

foo(1, 2, 3); // 都会打印出 1 2 3
```

## 相关

[类数组是什么，和数组有什么区别，如何转化成数组？](./040040_classarray.md)