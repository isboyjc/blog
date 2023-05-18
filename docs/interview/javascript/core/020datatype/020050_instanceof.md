# intanceof 操作符实现原理？

## 题干

- `intanceof` 操作符实现原理

## 题解

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。如果在实例对象的原型链上找到了该构造函数的 `prototype` 属性，则 `instanceof` 运算符返回 `true`，否则返回 `false`。

- 首先，获取实例对象的原型链。

- 然后，获取构造函数的 `prototype` 属性。

- 最后，使用递归检查构造函数的 `prototype` 属性是否出现在实例对象的原型链上。

- 如果在实例对象的原型链上找到了该构造函数的 `prototype` 属性，则 `instanceof` 运算符返回 `true`，否则返回 `false`。


🌰：
```js
function myInstanceof(left, right) {
  // 获取 right 的原型对象
  let prototype = right.prototype;
  // 获取 left 的原型链
  left = left.__proto__;
  // 判断 left 的原型链上是否存在 right 的原型对象
  while (true) {
    if (left === null) {
      return false;
    }
    if (left === prototype) {
      return true;
    }
    left = left.__proto__;
  }
}
```