# No.0140

# 题干

```js
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res);
});

Promise.resolve().then(() => {
  console.log(1);
}).then(() => { 
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() => {
  console.log(6);
});
```

# 题解

```js
// 0
// 1
// 2
// 3
// 4
// 5
// 6
```