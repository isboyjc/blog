# 箭头函数与普通函数的区别？

## 题干

- 箭头函数
- 普通函数

## 题解

- 箭头函数的语法更简洁，可以省略 `function` 关键字，参数的括号和返回值的 `return`。

- 箭头函数没有自己的 `this`，它的 `this` 继承自定义时所在的上下文，而不是调用时所在的上下文。因此，箭头函数不能用作构造函数，也不能使用 `call`、`apply`、`bind` 等方法改变 `this` 的指向。

- 箭头函数没有 `arguments` 对象，如果需要访问函数的参数，可以使用剩余参数（`…args`）代替。

- 箭头函数没有 `prototype` 属性，因此不能使用 `new` 关键字生成实例。

- 箭头函数不能使用 `yield` 关键字，因此不能作为生成器函数。


🌰：

```js
// 普通函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 普通函数的this
function Person() {
  this.age = 0;
  setInterval(function growUp() {
    // this指向window对象
    this.age++;
  }, 1000);
}

// 箭头函数的this
function Person() {
  this.age = 0;
  setInterval(() => {
    // this指向Person实例
    this.age++;
  }, 1000);
}

// 普通函数的arguments
function foo() {
  console.log(arguments[0]); // 1
}

// 箭头函数的剩余参数
const foo = (...args) => {
  console.log(args[0]); // 1
}

// 普通函数可以用作构造函数
function Person(name) {
  this.name = name;
}

const p = new Person('isboyjc'); // 正常

// 箭头函数不能用作构造函数
const Person = (name) => {
  this.name = name;
}

const p = new Person('isboyjc'); // 报错

// 普通函数可以使用yield关键字
function* gen() {
  yield 1;
  yield 2;
}

const g = gen(); // 正常

// 箭头函数不能使用yield关键字
const gen = () => {
  yield 1;
  yield 2;
}

const g = gen(); // 报错
```

## 相关

[如果 new 一个箭头函数的会怎样](./050020_new_arrow_function.md)