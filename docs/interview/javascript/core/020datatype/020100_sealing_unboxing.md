# 介绍基本数据类型的封箱与拆箱？

## 题干

- 封箱与拆箱

## 题解

`JS` 中有 `7` 种基本数据类型，它们不是对象，不能调用方法或属性。但是有时候我们可以看到像这样的代码：

```js
var s = "hello";
console.log(s.length); // 5
```

这里的 `s` 是一个字符串，它怎么能调用 `length` 属性呢？这就涉及到了装箱和拆箱的操作。

> 装箱就是把基本数据类型转换为对应的引用数据类型（也就是内置对象）的操作。

当我们读取或操作一个基本类型的值时，JS 会在后台自动创建一个对应的基本包装类型对象（比如 `String`，`Number`，`Boolean`），让我们能够调用一些方法或属性来处理这些数据。这个过程叫做 **隐式装箱**。


🌰：
```js
var s = "hello";
console.log(s.length); // 5
// 相当于
var s = new String("hello");
console.log(s.length); // 5
s = null;
```

我们也可以手动地创建基本包装类型对象，这叫做 **显式装箱**。

🌰：

```js
var n = new Number(123);
console.log(n.toFixed(2)); // 123.00
```

但注意，基本包装类型对象和基本类型的值是不一样的。前者是对象，后者是原始值。它们在比较、赋值、类型判断等方面有不同的表现。

🌰：

```js
var s1 = "hello";
var s2 = new String("hello");
console.log(typeof s1); // string
console.log(typeof s2); // object
console.log(s1 == s2); // true
console.log(s1 === s2); // false
```

> 拆箱就是把引用数据类型转换为基本数据类型的操作。

它通常发生在需要进行运算或比较的时候，JS 会自动调用引用数据类型的 `valueOf()` 或 `toString()` 方法来得到一个基本类型的值。

🌰：

```js
var n = new Number(123);
console.log(n + 1); // 124
// 相当于
console.log(n.valueOf() + 1); // 124

var s = new String("hello");
console.log(s > "a"); // true
// 相当于
console.log(s.toString() > "a"); // true
```

总之，装箱和拆箱是 JS 为了方便我们处理不同类型的数据而提供的一种机制，它们大多数时候是隐式地进行的，我们不需要关心细节。但是有时候也要注意它们可能带来的一些问题，比如类型判断、性能开销等。