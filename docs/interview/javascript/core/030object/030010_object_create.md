# 对象创建的方式有哪些，有什么区别？

## 题干

- 对象创建方式

## 题解

在 `JS` 中，创建对象的方式有以下几种：

- 对象字面量：使用花括号 `{}` 创建对象，可以直接定义对象的属性和方法。

```js
const obj = {
  name: 'isboyjc',
  age: 18,
  sayHello() {
    console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
  }
};
```

- `new Object()`：使用 `Object` 构造函数创建对象，对象的属性和方法用点号、方括号赋值或者直接在 `Object` 构造函数中以字面量的方式传入。

```js
const obj = new Object({name: "isboyjc"}); 
obj["age"] = 18;

obj.sayHello = function () {
  console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
}
```

- 构造函数：使用构造函数创建对象，可以通过 `new` 关键字创建对象实例。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.sayHello = function() {
    console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
  }
}

const obj = new Person('isboyjc', 18);
```

- `Object.create()` 方法：使用 `Object.create()` 方法创建对象，可以指定对象的原型。

```js
const obj = Object.create(Object.prototype, {
  name: {
    value: 'isboyjc',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 18,
    writable: true,
    enumerable: true,
    configurable: true
  },
  sayHello: {
    value: function() {
      console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
    },
    writable: true,
    enumerable: true,
    configurable: true
  }
});
```

这些创建对象的方式各有不同：

- 对象字面量是最简单的创建对象的方式，使用方便，但不适用于创建大量相似的对象。

- `new Object()` 这种方式与对象字面量类似，但是会更冗长，没有字面量方式简单。

- 构造函数可以创建多个相似的对象，可以使用原型来共享方法，但需要注意 `this` 的指向问题。

- `Object.create()` 方法可以指定对象的原型，可以创建复杂的对象，但需要手动设置属性的特性。