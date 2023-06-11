# JS 实现浅拷贝方法

## 题干

- 浅拷贝 lightcopy

## 题解

浅拷贝只复制对象的引用，而不是对象本身，因此复制后的对象和原对象共享同一个引用类型的属性，修改其中一个对象的引用类型属性会影响到另一个对象的属性值。

实现浅拷贝有很多种方式

### Object.assign()

使用 `Object.assign()` 方法，它可以将一个或多个源对象的可枚举属性复制到目标对象，返回目标对象。

```js
function lightcopy(obj){
  return Object.assign({}, obj);
}

let obj = {a: 1, b: 2, c: {a: 3}};
let obj1 = lightcopy(obj)
obj1.c.a = 4;

console.log(obj); // {a: 1, b: 2, c: {a: 4}}
console.log(obj1); // {a: 1, b: 2, c: {a: 4}}
```

### 扩展运算符(…)

使用扩展运算符(…)，它可以将一个对象的所有可枚举属性复制到另一个对象中。

```js
function lightcopy(obj){
  return {...obj};
}

let obj = {a: 1, b: 2, c: {a: 3}};
let obj2 = lightcopy(obj);
obj2.c.a = 4;

console.log(obj); // {a: 1, b: 2, c: {a: 4}}
console.log(obj2); // {a: 1, b: 2, c: {a: 4}}
```

### 数组 - Array.prototype.slice()

使用 `Array.prototype.slice()` 方法，它可以返回一个数组的一部分浅拷贝到一个新数组对象，不会改变原数组。

```js
function lightcopy(arrObject){
  return arrObject.slice();
}

let arr = [1, 2, 3, [4, 5]];
let arr1 = lightcopy(arr);
arr1[3][0] = -1;

console.log(arr); // [1, 2, 3, [-1, 5]]
console.log(arr1); // [1, 2, 3, [-1, 5]]
```

### 数组 - Array.prototype.concat()

使用 `Array.prototype.concat()` 方法，它可以用于合并两个或多个数组，返回一个新的数组，不会改变原数组。

```js
function lightcopy(arrObject){
  return arrObject.concat();
}

let arr = [1, 2, 3, [4, 5]];
let arr2 = lightcopy(arr);
arr2[3][0] = -1;

console.log(arr); // [1, 2, 3, [-1, 5]]
console.log(arr2); // [1, 2, 3, [-1, 5]]
```

### 自定义函数

使用自定义函数实现浅拷贝，遍历对象，把属性和属性值都放在一个新的对象里。

```js
function lightcopy(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return;

  // 根据obj的类型判断是新建一个数组还是一个对象
  let newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    // 遍历obj，并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

let obj = {a: 1, b: 2, c: {a: 3}};
let obj3 = lightcopy(obj);
obj3.c.a = -4;

console.log(obj); // {a: 1, b: 2, c: {-4}}
console.log(obj3); // {a: 1, b: 2, c: {-4}}
```

## 相关

[介绍下深拷贝、浅拷贝，两者区别，object.assign 是哪种](../core/030object/030060_object_deepcopy_lightcopy.md)

[JS 实现深拷贝方法（考虑 Symbol 类型、循环引用）](./0260_js_write_deepclone.md)