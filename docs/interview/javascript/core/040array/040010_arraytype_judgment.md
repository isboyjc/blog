# JS 判断数组类型的方式有哪些？

## 题干

数组类型判断

## 题解

### Array.isArray()

`Array.isArray()` 方法用于确定传递的值是否是一个 `Array`。

```js
Array.isArray([1,2,3]) // true
Array.isArray("hello") // false
```



### instanceof

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

```js
console.log([] instanceof Array) // true
console.log(new Date() instanceof Date) // true
```

### `Object.prototype.toString.call()` 方法

`Object.prototype.toString.call()` 方法返回一个表示对象的字符串。

```js
console.log(Object.prototype.toString.call([])) // [object Array]
```