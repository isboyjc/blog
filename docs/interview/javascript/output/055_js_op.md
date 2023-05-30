# No.0055

# 题干

```js
var foo = function () {
  console.log("foo1")
}
foo()

var foo = function () {
  console.log("foo2")
}
foo()


function foo() {
  console.log("foo1")
}
foo()

function foo() {
  console.log("foo2")
}
foo()
```

# 题解

```js
// foo1 foo2 foo2 foo2
```

