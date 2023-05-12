# JS 实现 instanceof 操作符

## 题干

`JavaScript` 中的 [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符用于检测 `constructor.prototype` 是否存在于参数 `object` 的原型链上。如果是，返回 `true`，否则返回 `false`。

特点：

- `instanceof` 检测的是原型，在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，如果存在返回 `true` 否则返回 `false`。
- `instanceof` 可以比较一个对象是否为某一个构造函数的实例，递归查找左侧对象的 `__proto__` 原型链，判断是否等于右侧构造函数的 `prototype`。 
- 能够准确的判断复杂数据类型，但是不能正确判断基本数据类型。

### 🌰.01

```js
console.log(12 instanceof Number);                // false 
console.log("22" instanceof String);              // false 
console.Log(true instanceof Boolean);             // false 
console.log(null instanceof Object);              // false 
console.log(undefined instanceof Object);         // false
console.log(function a(){} instanceof Function);  // true 
console.Log([] instanceof Array);                 // true
console.Log({a:1} instanceof Object)              // true 
console.log(new Date()instanceof Date)            // true
```

### 🌰.02

```js
function C(){}
function D(){}

var o = new C();

console.log(o instanceof C); // true，Object.getPrototypeOf(o) === C.prototype
console.log(o instanceof D); // false，D.prototype 不在 o 的原型链上
```


## 题解

```js
function myInstanceof(left, right) {
  // left.__proto__ === Object.getPrototypeOf(left)
  let leftProto = left.__proto__
  
  while (true) {
    if (leftProto === null) return false
    if (leftProto === right.prototype) return true

    // 原型链遍历
    leftProto = leftProto.__proto__
  }
}

console.log(myInstanceof([], Array));     // true
console.log(myInstanceof([], Object));    // true
console.log(myInstanceof([], Function));  // false
```