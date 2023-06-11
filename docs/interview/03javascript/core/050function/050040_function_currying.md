# 什么是柯里化，应用场景？

## 题干

- 柯里化

## 题解

### 柯里化

柯里化（`Currying`）是一种函数式编程的技术，它指的是将一个接受多个参数的函数转化为一系列接受单一参数的函数的过程。也就是说，将一个多元函数转化为一元函数的过程。

🌰：

```js
// 普通的三元函数
function add(a, b, c) {
  return a + b + c;
}

// 柯里化后的函数
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
```

### 柯里化应用场景

- 参数复用
- 延迟执行
- 函数组合

参数复用是指柯里化可以固定一部分参数，生成一个更专用的函数，避免重复传入相同的参数。

🌰：

```js
// 普通的判断类型函数
function isType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

// 柯里化后的判断类型函数
function curriedIsType(type) {
  return function (value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

// 参数复用，生成专用函数
let isString = curriedIsType("String");
let isNumber = curriedIsType("Number");

console.log(isString("hello")); // true
console.log(isNumber(123)); // true
```

延迟执行是指柯里化可以将多个参数的计算分解为多个函数，延迟执行，直到真正需要结果时再求值。

🌰：

```js
// 普通的求和函数
function sum(...args) {
  return args.reduce((a, b) => a + b);
}

// 柯里化后的求和函数
function curriedSum(...args) {
  let total = args.reduce((a, b) => a + b);
  return function (...rest) {
    if (rest.length === 0) {
      // 没有参数时返回结果
      return total;
    } else {
      // 有参数时继续累加
      total += rest.reduce((a, b) => a + b);
      return curriedSum(total); // 返回新函数
    }
  };
}

let add = curriedSum(1, 2, 3); // 返回新函数，不求值
console.log(add()); // 6，真正需要结果时求值

add = add(4); // 返回新函数，不求值
console.log(add()); // 10，真正需要结果时求值

add = add(5, 6); // 返回新函数，不求值
console.log(add()); // 21，真正需要结果时求值
```

函数组合是指柯里化可以将多个函数组合起来，形成一个复合函数，实现更复杂的功能。

🌰：

```js
// 普通的组合函数，从右到左执行
function compose(...fns) {
  return function (x) {
    return fns.reduceRight((y, f) => f(y), x);
  };
}

// 柯里化后的组合函数，从右到左执行
function curriedCompose(...fns) {
  return function (x) {
    let result = x;
    for (let i = fns.length - 1; i >= 0; i--) {
      result = fns[i](result);
    }
    return result;
  };
}

// 定义一些简单的函数
function double(x) {
  return x * 2;
}

function square(x) {
  return x * x;
}

function addOne(x) {
  return x + 1;
}

// 组合成一个复合函数
let fn = curriedCompose(double, square, addOne);

console.log(fn(2)); // ((2 + 1) ^ 2) * 2 = 18
```


## 相关

[JS 实现柯里化 curry 方法](../../write/0170_js_write_curry.md)