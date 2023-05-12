# JS 判断数组类型的方式有哪些？

## 题干

数组类型判断

## 题解

### `Array.isArray()` 方法

- `Array.isArray()` 方法用于确定传递的值是否是一个 `Array`。
- 例如
  - `Array.isArray([1,2,3])` 返回 `true`
  - `Array.isArray(“hello”)` 返回 `false`



### `instanceof` 运算符

- `instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上
- 例如
  - `[] instanceof Array` 返回 `true`
  - `new Date() instanceof Date` 返回 `true`



### `Object.prototype.toString.call()` 方法

- `Object.prototype.toString.call()` 方法返回一个表示对象的字符串。
- 例如
  - `Object.prototype.toString.call([])` 返回 `[object Array]`