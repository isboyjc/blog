# 如果 new 一个箭头函数的会怎样？

## 题干

- new 一个箭头函数

## 题解

如果 `new` 一个箭头函数，会抛出一个 `TypeError` 异常，因为箭头函数没有 `prototype` 属性，也没有 `[[Construct]]` 内部方法，不能作为构造函数使用。

🌰：

```js
const Foo = () => {};
const foo = new Foo(); // TypeError: Foo is not a constructor
```

## 相关

[箭头函数与普通函数的区别](./050010_arrow_function.md)