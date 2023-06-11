# JS 实现深拷贝方法（考虑 Symbol 类型、循环引用）

## 题干

- 深拷贝 deepClone

## 题解

深拷贝则是创建一个新的对象，完全复制原对象的所有属性值，包括引用类型的属性值，因此修改其中一个对象的引用类型属性不会影响到另一个对象的属性值。

### JSON.parse(JSON.stringify(obj))

使用 `JSON.parse(JSON.stringify(objectToClone))`，但这种方法要求对象中的属性值不能是函数、`undefined` 以及 `symbol` 值，也无法拷贝对象原型链上的属性和方法，同时也不能存在循环引用的情况。

```js
function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

let obj = {a: 1, b: 2, c: {a: 3}, d: Symbol('d'), [Symbol('e')]: 4};
let obj1 = deepClone(obj)
obj1.c.a = 4;
console.log(obj); // {a: 1, b: 2, c: {a: 3}, d: Symbol(d), Symbol('e'): 4}
console.log(obj1); // {a: 1, b: 2, c: {a: 4}}
```

### lodash 库 cloneDeep

使用 `lodash` 库的 `cloneDeep` 方法，这种方法可以处理各种类型的属性值，包括函数、`undefined` 和 `symbol`，同时也可处理循环引用。

```js
let obj = {a: 1, b: 2, c: {a: 3}, d: Symbol('d'), [Symbol('e')]: 4};
obj.loop = obj; // 设置循环引用
let obj2 = _.cloneDeep(obj);
obj2.c.a = -4;
console.log(obj); // {a: 1, b: 2, c: {a: 3}, d: Symbol(d), Symbol('e'): 4, loop: [Circular]}
console.log(obj2); // {a: 1, b: 2, c: {-4}, d: Symbol(d), Symbol('e'): 4, loop: [Circular]}
```

### 自定义函数

使用递归自定义函数实现深拷贝，这种方法需要遍历对象的所有属性，并判断属性值是否为对象或数组，如果是则递归调用自身进行深拷贝。为了处理 `Symbol` 类型属性，可以使用 `Reflect.ownKeys` 方法来获取对象的所有键，包括 `Symbol` 类型的键。为了支持循环引用，可以使用 `Map` 来存储已经拷贝过的对象，避免重复拷贝。

```js
function deepClone(obj, map = new Map()) {
  // 只拷贝对象
  if (typeof obj !== 'object' || obj === null) return obj;
  // 根据obj的类型判断是新建一个数组还是一个对象
  let newObj = Array.isArray(obj) ? [] : {};
  // 获取对象的所有键，包括Symbol类型的键
  let keys = Reflect.ownKeys(obj);
  for (let key of keys) {
    // 遍历obj，并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 如果属性值是对象，则递归调用自身进行深拷贝
      if (typeof obj[key] === 'object') {
        // 如果已经拷贝过该对象，则直接返回该对象
        if (map.has(obj[key])) {
          newObj[key] = map.has(obj[key]);
        } else {
          // 否则继续深拷贝，并将该对象存入WeakMap中
          map.set(obj[key], newObj[key]);
          newObj[key] = deepClone(obj[key], map);
        }
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}


let obj = {a: 1, b: 2, c: {a: 3}, d: Symbol('d'), [Symbol('e')]: 4};
obj.loop = obj; // 设置循环引用
let obj3 = deepClone(obj);
obj3.c.a = -8;
console.log(obj); // {a: 1, b: 2, c: {a: 3}, d: Symbol(d), Symbol('e'): 4, loop: [Circular]}
console.log(obj3); // {a: 1, b: 2, c: {-8}, d: Symbol(d), Symbol('e'): 4, loop: [Circular]}
```

## 相关

[介绍下深拷贝、浅拷贝，两者区别，object.assign 是哪种](../core/030object/030060_object_deepcopy_lightcopy.md)

[JS 实现浅拷贝方法](./0250_js_write_lightclone.md)