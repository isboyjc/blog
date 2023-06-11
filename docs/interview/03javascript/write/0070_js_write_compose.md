# JS 实现 compose 方法

## 题干

在使用 `redux` 的过程中，经常会用到中间件，那就免不了使用 `compose` 方法来解决中间件层层嵌套的问题，那么 `redux` 中的 `compose` 方法是怎样实现的呢?

`​compose​​` 核心是执行一系列的任务（函数），在函数式编程中是一个很重要的工具函数。

`compose​​` 有三个特点：

- 第一个函数是多元的（可接受多个参数），后面的函数都是单元的（只接受一个参数）
- 执行顺序自右向左
- 所有函数的执行都是同步的


### 🌰.01

```js
function power(x) {
  return Math.pow(x, 10)
}
function add(x) {
  return x + 5
}

// 简写
const compose = (fn1, fn2) => x => fn1(fn2(x))
compose(power,  add)(5)  // 1000
```


### 🌰.02

```js
function fn1(x) {
  return x + 1;
}
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}
// fn...

// ???
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1 = 11
```


## 题解

```js
function compose(...fn) {
  if (!fn.length) return (v) => v;
  if (fn.length === 1) return fn[0];
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}

const add1 = x => x + 1
const mul3 = x => x * 3
const div2 = x => x / 2

const operate = compose(div2, mul3, add1, add1)
console.log(operate(0)) //=>相当于div2(mul3(add1(add1(0))))
console.log(operate(2)) //=>相当于div2(mul3(add1(add1(2))))
```