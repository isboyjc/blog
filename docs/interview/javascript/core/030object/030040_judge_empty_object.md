# 如何判断对象是否为空？

## 题干

- 判断对象是否为空

## 题解

`JSON.stringify()` 将 JS 对象值转换为 `JSON` 字符串，再判断该字符串是否为 `'{}'`

```js
let data = {};
let b = (JSON.stringify(data) == "{}");
console.log(b);   // true 为空， false 不为空`
```

使用 `ES6` 方法 `Object.keys()`，返回对象的属性名组成的数组，如果数组长度为 0，则为空对象。

```js
let data = {};
let arr = Object.keys(data);
console.log(arr.length == 0); // true 为空， false 不为空
```

使用 `Object.getOwnPropertyNames()` 方法，返回对象的属性名组成的数组，如果数组长度为 0，则为空对象。

```js
let data = {};
let arr = Object.getOwnPropertyNames(data);
console.log(arr.length == 0); // true 为空， false 不为空
```


使用 `for...in` 循环判断

```js
let obj = {};
let b = function() {
    for(let key in obj) {
        return false;
    }
return true;
}
console.log(b()); // true 为空， false 不为空
```