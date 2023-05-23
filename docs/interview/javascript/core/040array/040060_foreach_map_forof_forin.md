# for...of、 for...in 和 forEach、map 的区别？

## 题干

- for...of 
- for...in
- forEach
- map

## 题解

`for...of`、`for...in`、`forEach` 和 `map` 都是 `JS` 中用于遍历数组的方法，但它们的用法和效果略有不同。


### for...of

`for...of` 是 `ES6` 新增的遍历语法，具有迭代器（`iterator`）接口，就可以用其循环遍历它的成员 (属性值 `value`)。可以中断该循环。

注：对于普通的对象，`for...of` 结构不能直接使用，因为普通对象不具备迭代器（`iterator`）接口。

原生具备 `Iterator` 接口的数据结构有：

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象
- ES6 的数组、Set、Map

`for...of` 循环的语法结构如下：

```js
for (let item of iterable) {
  // 循环体
}
```


### for...in

`for...in` 循环是遍历对象自身的和继承的可枚举的属性，也就是说会包括那些 **原型链上的属性** 。如果想要仅迭代自身的属性，那么在使用 `for...in` 的同时还需要配合 `getOwnPropertyNames()` 或 `hasOwnProperty()`。可以中断该循环。

它的语法结构如下：

```js
for (let key in object) {
  // 循环体
}
```


### forEach()

`forEach()` 方法是数组原型上的一个方法，只能遍历数组，没有返回值，无法链式调用。`forEach()` 函数参数为回调函数，该回调函数有三个参数：数组元素、元素的索引和数组本身。该循环不能被中断。

它的语法结构如下：

```js
array.forEach(function callback(currentValue, index, array) {
  // 循环体
});
```


### map()

`map()` 方法也是数组原型上的一个方法，所以同样只能遍历数组，该方法返回值是修改后的数组。`map()` 函数调用方式及参数同 `forEach()`。但是传递给 `map()` 的回调函数应有返回值。注意，`map()` 返回的是新数组。该循环不能被中断。

它的语法结构如下：

```js
let newArray = array.map(function callback(currentValue, index, array) {
  // 循环体
});
```


### 对比

- `for...of`、`for...in` 可中断循环，`forEach`、`map` 不可中断。

- `for...of` 只可迭代拥有迭代器（`iterator`）的对象，普通对象无迭代器，不可遍历（可搭配 `Object.keys()` 使用）。

- `for...in` 除遍历自身外，还会遍历原型链上的属性。

- `for...in` 循环出的是 `key`，`for...of` 循环出的是 `value`。

- `forEach` 无返回值，`map` 有返回值且返回一个新的数组。

## 相关

[如何使用 for...of 遍历普通对象](../030object/030050_forof_in_object.md)

[手写实现让普通对象支持 for...of 遍历](../../write/0300_js_write_object_support_forof.md)