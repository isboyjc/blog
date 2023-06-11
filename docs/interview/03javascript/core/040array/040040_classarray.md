# 类数组是什么，和数组有什么区别，如何转化成数组？

## 题干

- 数组
- 类数组

## 题解

类数组是一种类似于数组的对象，它们具有数字索引和 `length` 属性，但它们并不具有数组对象的方法，例如 `push`、`pop`、`splice` 等。常见的类数组对象包括函数的 `arguments` 对象、`DOM` 元素集合（例如通过 `document.getElementsByTagName()` 获取的元素集合）等。


数组类&数组区别：

- 类数组的原型链上没有 `Array.prototype`，因此不能直接调用数组的方法，如 `push`、`pop` 等。

- 类数组的键名不一定是连续的数字，有时可能是任意的字符串。


类数组转数组：

- 使用 `Array.from` 方法，如 `Array.from(arguments)`。

- 使用扩展运算符（`...`），如[…arguments]。

- 使用 `Array.prototype.slice.call` 方法，如 `Array.prototype.slice.call(arguments)`。

- 使用 `Array.prototype.concat.apply` 方法，如 `Array.prototype.concat.apply([], arguments)`。



## 相关

[为什么函数的 arguments 参数是类数组而不是数组？如何遍历类数组?](./040050_arguments_is_classarray.md)