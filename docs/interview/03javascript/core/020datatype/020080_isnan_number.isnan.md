# isNaN 和 Number.isNaN 函数的区别？

## 题干

- `isNaN` 和 `Number.isNaN` 函数区别

## 题解

`isNaN` 函数会先将参数转换成数值，然后再判断是否是 `NaN`。如果参数不能转换成数值，也会返回 `true`。

🌰：
```js
isNaN(undefined);   // true
isNaN({});          // true
isNaN("foo");       // true
```

`Number.isNaN` 函数不会转换参数，只有当参数是数值类型并且等于 `NaN` 时，才会返回 `true`。

🌰：
```js
Number.isNaN(undefined);  // false
Number.isNaN({});         // false
Number.isNaN("foo");      // false
Number.isNaN(NaN);        // true
```

如果想判断一个值是否是 `NaN`，建议使用 `Number.isNaN` 函数，因为它更准确和可靠。

## 扩展


### polyfill

`Number.isNaN` 函数是 `ES6` 引入的，如果需要兼容老版本的浏览器，可以使用一个 `polyfill` 或者结合 `typeof` 和 `isNaN` 来判断。

🌰：
```js
function isReallyNaN(x) {
  return typeof x === "number" && isNaN(x);
}
```