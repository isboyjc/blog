# 如何使用 for...of 遍历普通对象？

## 题干

- for...of 遍历对象

## 题解

`for...of` 是 `ES6` 新增的遍历语法，具有迭代器（`iterator`）接口，就可以用其循环遍历它的成员 (属性值 `value`)。可以中断该循环。

普通的对象，`for...of` 结构迭代不能直接使用，因为普通对象不具备迭代器（`iterator`）接口。

使普通对象支持 `for...of` 遍历，需在对象中定义迭代器（`iterator`）接口。

定义迭代器（`iterator`）接口，即为对象添加一个名为 `Symbol.iterator` 的方法（一个专门用于使对象可迭代的内建 `symbol`）。

1. 当 `for..of` 循环启动时，它会调用 `Symbol.iterator` 方法（如果没找到，就会报错）。这个方法必须返回一个迭代器（`iterator`） ，迭代器即一个有 `next` 方法的对象。

2. 从此开始，`for..of` 仅适用于这个被返回的对象。

3. 当 `for..of` 循环希望取得下一个数值，它就调用这个对象的 `next()` 方法。

4.`next()` 方法返回的结果的格式必须是 `{done: Boolean, value: any}`，当 `done=true` 时，表示循环结束，否则 `value` 是下一个值。


🌰：

```js
let obj = {a: 1, b: 2, c: 3}

obj[Symbol.iterator] = function() {
  const self = this;
  const keys = Object.keys(self);
  let index = 0;
  return {
    next() {
      if(index < keys.length) {
        return {
          value: self[keys[index++]],
          done: false
        }
      } else {
        return {value: undefined, done: true}
      }
    }
  }
}

for(let item of obj) {
  console.log(item); 
}
```

## 相关

[for...of、 for...in 和 forEach、map 的区别](../040array/040060_foreach_map_forof_forin.md)

[手写实现让普通对象支持 for...of 遍历](../../write/0300_js_write_object_support_forof.md)