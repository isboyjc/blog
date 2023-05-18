# JS 数据类型判断的方式有哪些？

## 题干

- 类型判断

## 题解

### typeof

- 基本类型（除 `null、undefined` 外）通过字面量创建的值打印类型后还是原来的基本类型，而使用内置对象方式创建的值打印类型都是对象。

- 引用类型通过字面量或者是内置对象的方式创建值打印类型都是对象

- 打印 `null` 的类型结果是对象（ JS 中不同的对象在计算机底层都是二进制表示的，而在 JS 中二进制前三位都为 0 的话会被判定为 `object` 类型，`null` 的二进制全是0，自然前三位都是 0，所以 `typeof` 判定时也会返回 `object`）

- 打印 `undefined` 返回 `undefined` 自身


🌰：
```js
console.log(typeof "");             // string 
console.log(typeof 1);              // number 
console.log(typeof NaN);            // number 
console.log(typeof true);           // boolean
console.log(typeof undefined);      // undefined 
console.log(typeof function (){});  // function 
console.log(typeof isNaN);          // function 
console.log(typeof Symbol());       // symbol 
console.log(typeof 123n);           // bigint 
console.log(typeof [])              // object 
console.log(typeof {})              // object 
console.log(typeof null);           // object 
console.log(typeof new Date());     // object 
console.log(typeof new RegExp());   // object
```


### instanceof

- `instanceof` 检测的是原型，`instanceof` 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，如果存在返回 `true` 否则返回 `false`。

- `instanceof` 可以比较一个对象是否为某一个构造函数的实例，递归查找左侧对象的 `__proto__` 原型链，判断是否等于右侧构造函数的 `prototype`。 

- 能够准确的判断复杂数据类型，但是不能正确判断基本数据类型。

- 需要注意的是：跨框架（`cross-frame`）页面中创建的数组不会相互共享其 `prototype` 属性。
  - 比如页面中有 `iframe` ，那么就存在了 2 个全局执行环境，就会产生问题。


🌰：
```js
console.log(12 instanceof Number);                // false 
console.log("22" instanceof String);              // false 
console.log(true instanceof Boolean);             // false 
console.log(null instanceof Object);              // false 
console.log(undefined instanceof Object);         // false

console.log(function a(){} instanceof Function);  // true 
console.log([] instanceof Array);                 // true
console.log({ a: 1 } instanceof Object);          // true 
console.log(new Date() instanceof Date);          // true
```


### constructor

- JS 中，每个对象都有一个 `constructor` 属性，`constructor` 属性表示原型对象与构造函数之间的关联关系。

- 当一个函数 `F` 被定义时，JS 引擎会为 `F` 添加 `prototype` 原型，然后在 `prototype` 上添加一个 `constructor` 属性，并让其指向 `F` 的引用，`F` 利用原型对象的 `constructor` 属性引用了自身，当 `F` 作为构造函数创建对象时，原型上的 `constructor` 属性被遗传到了新创建的对象上，从原型链角度讲，构造函数 `F` 就是新对象的类型。这样做的意义是，让对象诞生以后，就具有可追溯的数据类型。

- 注意，`null` 和 `undefined` 没有 `constructor` 属性。

- 同上 `instanceof` ，因为涉及到 `prototype`，跨框架（`cross-frame`）页面中创建的数组不会相互共享其 `prototype` 属性。
  - 比如页面中有 `iframe`，那么就存在了 2 个全局执行环境，就会产生问题。

- 很多情况下可以使用 `instanceof` 运算符或对象的 `constructor` 属性来检测对象是否为数组，但是由于跨框架（`cross-frame`）问题，目前通常使用 `ES5` 新增的 `Array.isArray()` 方法来判断数组或类数组。


🌰：
```js
console.log(true.constructor === Boolean);            // true
console.log(12.constructor === Number);               // true
console.log('12'.constructor === String);             // true
console.log([].constructor === Array);                // true
console.log({}.constructor === Object);               // true
console.log((function(){}).constructor === Function); // true

function Fn(){}
let fn = new Fn()
console.log(fn.constructor === Fn)                    // true
```

还需要注意一点，当 **重写** 原型时，原型原有的 `constructor` 会丢失，这时判断也就不生效了。

🌰：
```js
function Fn() {};

Fn.prototype = {
  aaa: "isboyjc"
};
let fn = new Fn();
console.log(fn.constructor === Fn)                     // false
console.log(fn.constructor)                            // Object
```

如上，我们打印 `fn.constructor`，可看到是一个 `Object`。

为什么呢？

这是因为在重新定义原型时，传入的是一个字面量对象 `{}` ，因此会将 `Object` 原型上的 `constructor` 传递给 `{}` ，所以 `fn.constructor` 也就打印出了 `Object`。


### toString()

- `Object.prototype.toString()` 方法返回一个表示对象的字符串。但是，由于 `toString()` 方法是 `Object` 的原型方法，因此它也可以被其他对象继承。为了确保 `toString()` 方法返回正确的结果，必须使用 `call()` 或 `apply()` 方法将其绑定到要检查其类型的对象上。

- 适用于所有类型判断

🌰：
```js
console.log(Object.prototype.toString.call(1))              // [object Number]
console.log(Object.prototype.toString.call(1n))             // [object BigInt]
console.log(Object.prototype.toString.call('123'))          // [object String.]
console.log(Object.prototype.toString.call(true))           // [object Boolean]
console.log(Object.prototype.toString.call(undefined))      // [object Undefined]
console.log(Object.prototype.toString.call(null))           // [object Null]
console.log(Object.prototype.toString.call({}))             // [object Object]
console.log(Object.prototype.toString.call([]))             // [object Array]
console.log(Object.prototype.toString.call(function a(){})) // [object Function]
console.log(Object.prototype.toString.call(Symbol()))       // [object Symbol]
console.log(Object.prototype.toString.call(Math))           // [object Math]
console.log(Object.prototype.toString.call(JSON))           // [object JSON]
console.log(Object.prototype.toString.call(new Date()))     // [object Date]
console.log(Object.prototype.toString.call(new RegExp()))   // [object RegExp]
console.log(Object.prototype.toString.call(new Error))      // [object Error]
console.log(Object.prototype.toString.call(window))         // [object Window]
console.log(Object.prototype.toString.call(document))       // [object HTMLDocument]
```



### 总结

- `typeof` 使用简单，但是只适用于判断基础类型数据。

- `instanceof` 能判断引用类型，不能检测出基本类型，且不能跨 `iframe` 使用。

- `constructor` 基本能判断所有类型，除了 `null` 和 `undefined` ，但是 `constructor` 容易被修改，也不能跨 `iframe` 使用。

- `toString` 适用于所有类型判断。


## 扩展

### 类型判断方法

```js
function DataType(tgt, type) {
    const dataType = Object.prototype.toString.call(tgt).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    return type ? dataType === type : dataType;
}

DataType("isboyjc");      // "string"
DataType(212121);     // "number"
DataType(true);         // "boolean"
DataType([], "array");  // true
DataType({}, "array");  // false
```