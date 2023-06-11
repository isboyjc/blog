# {} 和 [] 的 valueOf 和 toString 结果是什么？

## 题干

- {} 和 [] 的 valueOf 和 toString

## 题解

对于 `{}` 对象，它的 `valueOf` 方法返回对象本身，`toString` 方法返回 `[object Object]` 字符串。

对于 `[]` 数组，它的 `valueOf` 方法返回数组本身，`toString` 方法返回由数组元素组成的逗号分隔的字符串。

我们可以通过以下代码验证：

```js
const obj = {};
console.log(obj.valueOf()); // {}
console.log(obj.toString()); // [object Object]

const arr = [];
console.log(arr.valueOf()); // []
console.log(arr.toString()); // ""
```

数组的 `toString` 方法返回的是由数组元素组成的字符串，如果数组元素是对象，那么 `toString` 方法会调用该对象的 toString 方法，如果数组元素是 `null` 或 `undefined`，那么它们会被转换成空字符串。