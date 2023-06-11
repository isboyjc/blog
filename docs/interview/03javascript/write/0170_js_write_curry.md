# JS 实现柯里化 curry 方法

## 题干

- 柯里化 curry 

## 题解

柯里化是一种将多个参数的函数转换为一系列单参数函数的技术，具体实现如下：

```js
// 定义一个 curry 函数，接受一个函数 fn 作为参数
function curry(fn) {
  // 返回一个新函数，接受任意个参数
  return function curried(...args) {
    // 如果传入的参数个数不小于 fn 的形参个数，就直接执行 fn 并返回结果
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      // 否则，返回一个新函数，接受剩余的参数，并缓存之前的参数
      return function (...rest) {
        return curried(...args, ...rest);
      };
    }
  };
}
```

`curry` 函数可以将任意元的函数转换为柯里化后的函数，实现参数复用、延迟计算和函数组合等功能。

🌰：

```js
// 定义一个三元函数，求三个数的和
function add(a, b, c) {
  return a + b + c;
}

// 使用 curry 函数转换为柯里化后的函数
let curriedAdd = curry(add);

// 测试不同的调用方式
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
```

## 相关

[什么是柯里化，应用场景](../core//050function/050040_function_currying.md)