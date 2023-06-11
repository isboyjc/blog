# JS 实现 new 操作符

## 题干

`JavaScript` 中的 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符用于创建一个指定类型的新对象。它通常与构造函数一起使用，用于创建一个特定类型的对象。

当使用 `new` 操作符调用构造函数时，会执行以下步骤：

1. 创建一个空对象。

2. 将这个空对象的原型（`[[Prototype]]` 即 `__proto__属性`）指向构造函数的 `prototype` 属性，实现继承。

3. 将构造函数的 `this` 绑定到新对象，并调用构造函数，传入指定的参数。

4. 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象。

### 🌰.01

下面是一个简单的例子，它使用 `new` 操作符创建一个 `Person` 类型的对象：

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

let p = new Person('John', 30);
console.log(p.name); // 'John'
console.log(p.age); // 30
```
这个例子中，我们定义了一个 `Person` 构造函数，它接受两个参数：`name` 和 `age`。然后我们使用 `new` 操作符调用 `Person` 构造函数，创建一个新的 `Person` 对象即实例对象。最后我们可以访问实例对象的 `name` 和 `age` 属性。


## 题解

```js
function myNew(constructor, ...args) {
    let obj = {}
    // obj.__proto__ = constructor.prototype === Object.setPrototypeOf(obj, constructor.prototype)
    obj.__proto__ = constructor.prototype
    let result = constructor.apply(obj, args)
    return (typeof result === 'object' && result !== null) ? result : obj
}

// 测试
function Person(name, age) {
    this.name = name;
    this.age = age;
}
let p = myNew(Person, 'John', 30);
console.log(p.name); // 'John'
console.log(p.age); // 30
```