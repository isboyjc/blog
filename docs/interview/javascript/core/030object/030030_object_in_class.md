# 如何判断一个对象是否属于某个类？

## 题干

- 判断对象是否属于某个类

## 题解

在 JS 中，可以使用 `instanceof` 操作符来判断一个对象是否属于某个类。`instanceof` 操作符可以用于判断一个对象是否是某个类的实例，它的语法如下：

```js
object instanceof constructor
```

其中，`object` 是要判断的对象，`constructor` 是类的构造函数。如果 `object` 是 `constructor` 的实例，`instanceof` 操作符返回 `true`，否则返回 `false`。


🌰：

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('Tom', 20);

console.log(person instanceof Person); // 输出 true
console.log(person instanceof Object); // 输出 true，因为所有对象都是 Object 类的实例
```

在上面的示例中，我们定义了一个 `Person` 类，然后创建了一个 `person` 对象。最后，我们使用 `instanceof` 操作符来判断 `person` 是否是 `Person` 类的实例，结果返回 `true`。