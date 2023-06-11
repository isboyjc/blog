# No.0100

# 题干

```js
const nums = [ 1, 2, 3, 4, 5, 6 ];
let firstEven; 

nums.forEach(n => {
  if(n % 2 === 0){
    firstEven = n;
    return n
  }
}
)
console.log(firstEven);
```

# 题解

```js
console.log(firstEven); // 6
```