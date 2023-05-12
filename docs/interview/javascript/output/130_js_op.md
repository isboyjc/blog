# No.0130

# 题干

```js
let i;

for(i = 0; i < 3; i++){
  setTimeout(() => console.log(i), 100);
}
for (let i = 0; i < 3; i++){
  setTimeout(() => console.log(i), 100);
}
```

# 题解

```js
// 3
// 3
// 3
// 0
// 1
// 2
```