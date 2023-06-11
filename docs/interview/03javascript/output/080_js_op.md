# No.0080

# 题干

```js
function foo1(){
  return {
    bar:"hello"
  }
};

function foo2(){
  return 
  {
    bar:"hello"
  }
}


var a = foo1();
var b = foo2(); 

console.log(a)
console.log(b)
```

# 题解

```js
console.log(a); // { bar: 'hello' } 
console.log(b); // undefined
```