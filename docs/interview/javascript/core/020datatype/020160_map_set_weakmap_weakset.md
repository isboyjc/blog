# JS 中 map、set 与 weakMap、weakSet 区别？

## 题干

- map、set

- weakMap、weakSet

## 题解

在 `JS` 中，`Map` 和 `Set` 是两种常用的数据结构，`WeakMap` 和 `WeakSet` 则是它们的 "弱化" 版本，它们之间的区别主要有以下几点：

- `Map` 和 `Set` 是强引用，而 `WeakMap` 和 `WeakSet` 是弱引用。也就是说，如果一个对象被 `Map` 或 `Set` 引用，即使这个对象在其他地方没有被引用，它也不会被垃圾回收。但是，如果一个对象只被 `WeakMap` 或 `WeakSet` 引用，那么它会被垃圾回收，不会产生内存泄漏。

- `WeakMap` 和 `WeakSet` 只能引用对象，而 `Map` 和 `Set` 可以引用任何类型的值。

- `WeakMap` 和 `WeakSet` 不支持迭代，因为它们的成员可能随时被垃圾回收。

- `WeakMap` 和 `WeakSet` 不能直接获取其大小，因为其成员可能随时被垃圾回收。

总之，`WeakMap` 和 `WeakSet` 主要用于需要引用对象但又不想影响垃圾回收的场景，比如缓存、事件监听等。而 `Map` 和 `Set` 则适用于一般的数据结构需求。