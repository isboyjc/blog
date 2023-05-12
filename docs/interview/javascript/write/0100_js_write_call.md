# JS 实现 call 方法

## 题干

`JavaScript` 中的 `call` 方法，可以用来调用一个函数，并指定函数内部 `this` 的值。

语法如下：

```js
fun.call(thisArg, arg1, arg2, ...)
```

其中，`fun` 是需要调用的函数，`thisArg` 是指定的 `this` 值，`arg1, arg2, ...` 是传递给 `fun` 函数的参数。

### 🌰.01

下面是一个简单的例子：

```js
const person = {
  name: 'Alice',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

person.greet(); // 输出: Hello, my name is Alice

const anotherPerson = {
  name: 'Bob'
};

person.greet.call(anotherPerson); // 输出: Hello, my name is Bob
```

在上面的例子中，我们定义了一个 `person` 对象，它有一个 `greet` 方法。当我们调用 `person.greet()` 时，控制台会输出 “Hello, my name is Alice”。

然后，我们定义了另一个对象 `anotherPerson`。这个对象没有 `greet` 方法，但我们可以使用 `call` 方法来调用 `person.greet` 方法，并将 `this` 值指定为 `anotherPerson`。

这样，当我们调用 `person.greet.call(anotherPerson)` 时，控制台会输出 “Hello, my name is Bob”。



## 题解

```js
Function.prototype.myCall = function(thisArg, ...args) {
  const fn = Symbol('fn');
  thisArg[fn] = this;

  const result = thisArg[fn](...args);
  delete thisArg[fn];
  return result;
}
```

在上面的代码中，我们定义了一个 `myCall` 方法，并将其添加到 `Function.prototype` 上。这样，所有的函数都可以使用这个方法。

这个方法接受两个参数：第一个参数是指定的 `this` 值，剩余的参数是传递给函数的参数。在方法内部，我们首先在 `thisArg` 对象上定义一个临时属性 `fn`，并将其值设置为当前函数（也就是调用 `myCall` 方法的函数）。然后，我们调用这个临时方法，并传入参数。最后，我们删除这个临时属性，并返回结果。