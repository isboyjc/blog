# 数组去重的方式有哪些？


## 题干

- 数组去重

## 题解

### Set && Array.from

`Set` 是 `ES6` 新增的数据结构，它可以存储不重复的值，`Array.from` 可以将类数组对象转换为数组，结合起来就可以实现数组去重。

```js
let arr = [1, 2, 3, 4, 4, 5, 5];
function unique(arr) {
  return Array.from(new Set(arr));
}
console.log(unique(arr)); // [1, 2, 3, 4, 5]
```

### indexOf && filter

`indexOf` 方法可以返回数组中某个元素的第一个索引，`filter` 方法可以根据条件过滤数组元素，结合起来就可以实现数组去重。

```js
let arr = [1, 2, 3, 4, 4, 5, 5];
function unique(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log(unique(arr)); // [1, 2, 3, 4, 5]
```

### sort && reduce

`sort` 方法可以对数组进行排序，`reduce` 方法可以对数组进行累计操作，结合起来就可以实现数组去重。

```js
let arr = [1, 2, 3, 4, 4, 5, 5];
function unique(arr) {
  return arr.sort().reduce((prev, cur) => {
    if (prev.length === 0 || prev[prev.length - 1] !== cur) {
      prev.push(cur);
    }
    return prev;
  }, []);
}
console.log(unique(arr)); // [1, 2, 3, 4, 5]
```

### Map && forEach

`Map` 是 `ES6` 新增的数据结构，它可以存储键值对，`forEach` 方法可以遍历数组元素，结合起来就可以实现数组去重。

```js
let arr = [1, 2, 3, 4, 4, 5, 5];
function unique(arr) {
  let map = new Map();
  let result = [];
  arr.forEach(item => {
    if (!map.has(item)) {
      map.set(item);
      result.push(item);
    }
  });
  return result;
}
console.log(unique(arr)); // [1, 2, 3, 4, 5]
```

### 双层循环 && splice

外层循环遍历数组元素，内层循环比较元素是否有相同的值，如果有则用 `splice` 方法删除重复元素。

```js
let arr = [1, 2, 3, 4, 4, 5, 5];
function unique(arr) {
  for (let i = arr.length -1; i >=0; i--) {
    for (let j = i -1; j >=0; j--) {
      if (arr[i] === arr[j]) {
        arr.splice(j ,1);
      }
    }
  }
  return arr;
}
console.log(unique(arr)); // [1 ,2 ,3 ,4 ,5]
```

## 相关

[JS 实现数组去重方法](../../write/0190_js_write_array_deduplication.md)