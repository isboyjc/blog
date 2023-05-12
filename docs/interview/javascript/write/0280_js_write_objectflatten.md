# JS 实现对象压平方法

## 题干

```js
const obj = {
  a: {
    b: 1,
    c: 2,
    d: {
      e: 3
    }
  },
  b: [ 4, 5, { a: 6, b: 7} ],
  c: 8
}

function objectFlatten(obj){
  // TODO...
}

objectFlatten(obj)
// 输出如下：
// {
//   'a.b': 1,
//   'a.c': 2,
//   'a.d.e': 3,
//   'b[0]': 4,
//   'b[1]': 5,
//   'b[2].a': 6,
//   'b[2].b': 7,
//   'c': 8
// }
```


## 题解

```js
function objectFlatten(obj){
  // TODO...
}
```