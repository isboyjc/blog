## 「算法与数据结构」JavaScript中的链表

## 写在前面

此文会先探讨下什么是链表以及在 JavaScript 中的链表，接着我们会使用 JavaScript 这门语言动手实现下各类链表的设计，最后我们会抛出一些常规疑问，并从各个方面一一解答，总之，目的就是完全搞定链表

搞定概念之后我们可以去力扣上选择链表分类，按照难易程度把它们刷完，其实力扣上链表的题目相对简单，只要你完整的看完了此文的链表设计，最起码可以轻松淦掉20题，同时链表题目数量也比较少，一共也就有50题左右，还有十来题需要会员，也就是说刷个40题，链表这种数据结构就可以初步掌握了，如果你不想找题排序，可以按照我的 GitHub 算法仓库库中的顺序刷题，有不太懂的题目或者概念可以看我写的题解，同时我也录制了视频，文末有链接，那么我们来开始学习链表，GO！



## 什么是链表

通常我们在程序中想要存储多个元素，数组可能是最常用的数据结构，数组这种数据结构非常方便，它甚至可以通过非常简单的方式即 `[]` 这种语法来访问其元素

而链表存储的也是有序的元素集合，但不同于数组的是，链表中的元素在内存中并不是连续的，每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也可以称为指针）组成

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227022306651.png)

我们接着再来看数组这种数据结构，它有一个缺点，在大多数语言中数组的大小是固定的，从数组的起点或中间插入或移除项的成本很高，因为需要移动元素，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227023740687.png)

上图数组删除索引为 2 值为 3 的元素，那么我们首先要删掉 3 这个元素，因为索引为 2 值为 3 的元素删除了，索引 2 就空了，所以接着，我们要把索引 3 也就是元素 4 向前移动一位，与此同时后面的元素 5 也需要向前移动一位，向数组中插入一个元素也是这个道理，只要数组中少了一位或者多了一位，那么后面的元素都要依次向前或向后移动一位，那么可想而之，当数组长度很大的时候，插入及删除的效率就会逐渐降低

我们再来看看链表

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227024501152.png)

同样是删除元素 3，链表这里只需要迭代到值为 3 的节点，将节点 2 指向节点 4 就行了，节点 3 没有了引用关系，就会被垃圾回收机制当作垃圾回收了，即使当节点非常多的情况下，依然只用改变一下引用关系即可删除元素，而插入元素则是反过来，即先断开插入位置两边的元素，然后让前一个元素指向插入元素，插入元素指向后一个元素即可，元素越多对比数组的效率就会越高

相对于传统的数组，链表的一个好处就在于，添加或移除元素的时候不需要移动其他元素，但是在数组中，我们可以直接访问任何位置的任何元素，链表中是不行的，因为链表中每个节点只有对下一个节点的引用，所以想访问链表中间的一个元素，必须要从起点（链表头部节点）开始迭代链表直到找到所需的元素，这点需要注意



## JavaScript中的链表

上面我们简单介绍了常规链表的概念，但是在 JavaScript 这门语言中，我们怎么表示链表呢？

由于 JS 中没有内置链表这种数据结构，所以我们需要使用对象来模拟实现链表，就如同我们上面介绍链表，它其实是一个单向链表，除此之外还有双向链表、环形链表等等，我们接下来会一一介绍并使用 JavaScript 来实现下



### 单向链表

我们先来看基础的单项链表，单向链表每个元素由一个存储元素本身的节点和一个指向下一个元素的指针构成，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227135703111.png)

要实现链表这种数据结构，关键在于保存 head 元素（即链表的头元素）以及每一个元素的 next 指针，有这两部分我们就可以很方便地遍历链表从而操作所有的元素，你可以把链表想象成一条铁链，铁链中的每一个节点都是相互连接的，我们只要找到铁链的头，整条铁链就都可以找到了，那么单向链表在 JS 中究竟要如何来模拟呢，我们一步一步来

首先，我们要创建一个类，这个类的作用就是描述链表的节点，它很简单，只需要有两个属性就可以了，一个用来保存此节点的值，一个用来保存指向下一个节点的指针，如下

```js
/**
 * @description: 创建链表单节点类
 * @param {*} val 节点值
 * @return {*}
 */
function ListNode(val) {
  this.val = val
  this.next = null
}
```

接着，我们需要先写一个链表类，其中 length属性 代表链表长度，head属性 代表链表头部节点

```js
/**
 * @description: 创建链表类
 * @param {*}
 * @return {*}
 */
function LinkedList() {
  this.length = 0
  this.head = null
}
```

我们思考下，既然是来模拟一个链表类，那么就应该把它所有可能会用到的特性都塞进这个类里，就比如数组有 `push/splice/indexOf/...` 等等这些好用的方法我们链表必须也得有啊，我们先仔细构思下要给链表添加哪些实用的特性或者说方法，先搭一个基础骨架，这里我列出了很多，我们来一一实现下，也欢迎补充

```js
// 向链表中追加节点
LinkedList.prototype.append = function (val) { }

// 在链表的指定位置插入节点
LinkedList.prototype.insert = function (index, val) { }

// 删除链表中指定位置的元素，并返回这个元素的值
LinkedList.prototype.removeAt = function (index) { }

// 删除链表中对应的元素
LinkedList.prototype.remove = function (val) { }

// 获取链表中给定元素的索引
LinkedList.prototype.indexOf = function (val) { }

// 获取链表中某个节点
LinkedList.prototype.find = function (val) { }

// 获取链表中索引所对应的元素
LinkedList.prototype.getElementAt = function (index) { }

// 判断链表是否为空
LinkedList.prototype.isEmpty = function () { }

// 获取链表的长度
LinkedList.prototype.size = function () { }

// 获取链表的头元素
LinkedList.prototype.getHead = function () { }

// 清空链表
LinkedList.prototype.clear = function () { }

// 序列化链表
LinkedList.prototype.join = function (string) { }
```



#### getElementAt(*index*)

我们先来实现获取链表中索引所对应的元素即 `getElementAt` 方法以及通过节点值获取链表元素即 `find` 方法，因为后面要多次用到它们，我们先说 `getElementAt` 方法，上面我们说想要找一个元素，我们必须从头迭代，所以我们直接根据传入的索引进行迭代即可

首先判断参数 `index` 的边界值，如果值超出了索引的范围（小于 0 或者大于 `length - 1`），则返回`null`，我们从链表的 `head` 节点开始，遍历整个链表直到找到对应索引位置的节点，然后返回这个节点，是不是很简单？和所有有序数据集合一样，链表的索引也是从 0 开始，只要有链表的头节点，就可以遍历找到索引所在位置的元素，所以我们在构造函数即 `LinkedList` 类中保存了 `head` 值

```js
// 获取链表中索引所对应的元素
LinkedList.prototype.getElementAt = function (index) {
  if (index < 0 || index >= this.length) return null

  let cur = this.head
  while (index--) {
    cur = cur.next
  }
  return cur
}
```



#### find(*val*)

`find` 方法和 `getElementAt` 方法类似，一个通过索引找元素，一个通过节点值找元素，所以我们直接迭代查找对比即可

```js
// 获取链表中某个节点
LinkedList.prototype.find = function (val) {
  let cur = this.head
  while (cur) {
    if (cur.val == val) return cur
    cur = cur.next
  }
  return null
}
```



#### append(*val*)

有了 `getElementAt` 方法后，接下来我们就可以很方便地实现 `append` 方法，此方法的作用是在链表末尾追加元素

此方法传入的是一个值，我们可以通过上面的构造函数 `ListNode` 来创建一个新节点

而后，我们需要考虑，如果链表的 `head` 为 `null` 时，这种情况表示链表为空，所以需要将 `head` 节点指向新添加的元素，以此来确保存储头节点，如果不为空，我们通过 `getElementAt` 方法找到链表的最后一个节点，最后一个节点的索引就是构造函数中的我们存的链表长度 `length` 属性减去 1，再将最后一个节点的 `next` 指针指向新添加的元素即可

新添加的元素 `next` 指针默认为 `null`，链表最后一个元素的 `next` 值也就为 `null`，另外，将节点挂到链表上之后，还需将链表的长度加 1，保证 `length` 属性等于链表长度，如下

```js
// 向链表中追加节点
LinkedList.prototype.append = function (val) {
  let node = new ListNode(val)

  if (!this.head) {
    this.head = node
  } else {
    let cur = this.getElementAt(this.length - 1)
    cur.next = node
  }
  this.length++
}
```



#### insert(*index*, *val*)

接下来我们要实现 `insert` 方法，即在链表的任意位置添加节点

在指定位置插入元素，首先我们还是需要先判断下传入 `index` 索引是否超出边界

接着我们分两种情况考虑

当 `index` 的值为 0 时，表示要在链表的头部插入新节点，将新插入节点的 `next` 指针指向现在的 `head`，然后更新 `head` 的值为新插入的节点即可，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227172151358.png)

当 `index` 的值不为 0 时，即插入的节点在链表的中间或者尾部，我们首先找到待插入位置的前一个节点 `prevNode`，然后将新节点 `newNode` 的 `next` 指针指向 `prevNode` 的 `next` 所对应的节点，再将 `prevNode` 的 `next` 指针指向 `newNode`，这样就把新节点插入链表中了，当插入的节点在链表的尾部，这种方法也同样适用，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227172716975.png)

最后，我们插入了节点，还需要将链表的长度即 `length` 长度加 1，代码如下

```js
// 在链表的指定位置插入节点
LinkedList.prototype.insert = function (index, val) {
  if (index < 0 || index > this.length) return false

  let node = new ListNode(val)

  if (index === 0) {
    node.next = this.head
    this.head = node
  } else {
    let prev = this.getElementAt(index - 1)
    node.next = prev.next
    prev.next = node
  }

  this.length++
  return true
}
```



#### removeAt(*index*)

相同的方式，我们可以很容易地写出 `removeAt` 方法，用来删除链表中指定位置的节点

依然还是先判断下传入 `index` 索引是否超出边界

还是分两种情况

如果要删除的节点是链表的头部，将 `head` 移到下一个节点即可，如果当前链表只有一个节点，那么下一个节点为 `null`，此时将 `head` 指向下一个节点等同于将 `head` 设置成 `null`，删除之后链表为空

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227180334649.png)

如果要删除的节点在链表的中间部分，我们需要找出 `index` 所在位置的前一个节点，将它的 `next` 指针指向 `index` 所在位置的下一个节点，总之，删除节点只需要修改相应节点的指针，断开删除位置左右相邻的节点再重新连接上即可

![image-20201227180444604](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227180444604.png)

被删除的节点没有了引用关系，JavaScript 垃圾回收机制会处理它，关于垃圾回收机制，同样不在此文讨论范围内，知道即可，删除节点元素，我们还需将链表的长度减 1，最终代码如下

```js
// 删除链表中指定位置的元素，并返回这个元素的值
LinkedList.prototype.removeAt = function (index) {
  if (index < 0 || index >= this.length) return null

  let cur = this.head

  if (index === 0) {
    this.head = cur.next
  } else {
    let prev = this.getElementAt(index - 1)
    cur = prev.next
    prev.next = cur.next
  }

  this.length--
  return cur.val
}
```



#### indexOf(*val*)

获取链表中给定元素的索引，这个比较简单，直接迭代即可，匹配到了返回对应索引，匹配不到返回 -1

```js
// 获取链表中给定元素的索引
LinkedList.prototype.indexOf = function (val) {
  let cur = this.head

  for (let i = 0; i < this.length; i++) {
    if (cur.val === val) return i
    cur = cur.next
  }

  return -1
}
```



#### remove(*val*)

删除链表中对应的元素，有了之前的铺垫，这里就比较简单了，我们可以直接用 `indexOf` 方法拿到对应索引，再使用 `removeAt` 方法删除节点即可

```js
// 删除链表中对应的元素
LinkedList.prototype.remove = function (val) {
  let index = this.indexOf(val)
  return this.removeAt(index)
}
```



#### isEmpty()

判断链表是否为空，只需要我们判断一下链表长度 `length` 等不等于 0 即可

```js
// 判断链表是否为空
LinkedList.prototype.isEmpty = function () {
  return !this.length
}
```



#### size()

获取链表长度就是取其 `length` 

```js
// 获取链表的长度
LinkedList.prototype.size = function () {
  return this.length
}
```



#### getHead()

 获取链表的头元素即返回 `head` 属性即可

```js
// 获取链表的头元素
LinkedList.prototype.getHead = function () {
  return this.head
}
```



#### clear()

清空链表，我们只需要将 `head` 置空，然后让 `length` 等于 0，等待垃圾回收机制回收无引用的废弃链表即可

```js
// 清空链表
LinkedList.prototype.clear = function () {
  this.head = null
  this.length = 0
}
```



#### join(*string*)

序列化链表即使用指定格式输出链表，类似于数组中 `join` 方法，此举旨在便于我们测试

```js
// 序列化链表
LinkedList.prototype.join = function (string) {
  let cur = this.head
  let str = ''
  while (cur) {
    str += cur.val

    if (cur.next) str += string

    cur = cur.next
  }
  return str
}
```

那么到此，我们的单向链表类就设计完成了，快来测试一下吧，我们输入下面代码进行测试

```js
let linkedList = new LinkedList()
linkedList.append(10)
linkedList.append(20)
linkedList.append(30)

console.log(linkedList.join("--"))

linkedList.insert(0, 5)
linkedList.insert(2, 15)
linkedList.insert(4, 25)
console.log(linkedList.join("--"))

console.log(linkedList.removeAt(0))
console.log(linkedList.removeAt(1))
console.log(linkedList.removeAt(2))
console.log(linkedList.join("--"))

console.log(linkedList.indexOf(20))

linkedList.remove(20)

console.log(linkedList.join("--"))

console.log(linkedList.find(10))

linkedList.clear()
console.log(linkedList.size())
```

最终输出如下

```js
// 10--20--30
// 5--10--15--20--25--30
// 5
// 15
// 25
// 10--20--30
// 1
// 10--30
// ListNode { val: 10, next: ListNode { val: 30, next: null } }
// 0
```

上面代码中少了一些参数校验，不过够我们学习用了，完成代码文末附链接





### 双向链表

上面我们说了单向链表，接下来我们来说双向链表，那么什么是双向链表呢？其实听名字就可以听出来，单向链表中每一个元素只有一个 `next` 指针，用来指向下一个节点，我们只能从链表的头部开始遍历整个链表，任何一个节点只能找到它的下一个节点，而不能找到它的上一个节点，双向链表中的每一个元素拥有两个指针，一个用来指向下一个节点，一个用来指向上一个节点，双向链表中，除了可以像单向链表一样从头部开始遍历之外，还可以从尾部进行遍历，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201227215932114.png)

同单向链表，我们首先创建链表节点类，不同的是，它需要多一个 `prev` 属性用来指向前一个节点

```js
/**
 * @description: 创建双向链表单节点类
 * @param {*} val 节点值
 * @return {*}
 */
function ListNode(val) {
  this.val = val
  this.next = null
  this.prev = null
}
```

双向链表类同单向链表多增加了一个尾部节点 `tail`

```js
/**
 * @description: 创建双向链表类
 * @param {*}
 * @return {*}
 */
function DoubleLinkedList() {
  this.length = 0
  this.head = null
  this.tail = null
}
```

接下来我们来实现双向链表的原型方法



#### getElementAt(*index*)

首先就是，获取双向链表中索引所对应的元素，双向链表由于可以双向进行迭代查找，所以这里 `getElementAt` 方法我们可以进行优化，当索引大于链表长度 `length/2` 时，我们可以从后往前找，反之则从前向后找，这样可以更快找到该节点元素

```js
// 获取双向链表中索引所对应的元素
DoubleLinkedList.prototype.getElementAt = function (index) {
  if (index < 0 || index >= this.length) return null
	
  let cur = null
  if(index > Math.floor(this.length / 2)){
    // 从后往前
    cur = this.tail
    let i = this.length - 1
    while (i > index) {
      cur = cur.prev
      i--
    }
  }else{
    // 从前往后
    cur = this.head
    while (index--) {
      cur = cur.next
    }
  }
  return cur
}
```



#### find(*val*)

`find` 方法和 `getElementAt` 方法是类似的，`getElementAt` 方法可以优化，那么 `find` 再变成双向链表后也可优化，我们想，既然双向都可以进行迭代，那么我们两边同时迭代岂不是更快，双向迭代的情况下，只有找不到时才会迭代整个链表，效率更高

```js
// 获取双向链表中某个节点
DoubleLinkedList.prototype.find = function (val) {
	let curHead = this.head
  let curTail = this.tail
  while (curHead) {
    if (curHead.val == val) return curHead
    curHead = curHead.next

    if (curTail.val == val) return curTail
    curTail = curTail.prev
  }
  return null
}
```



#### append(*val*)

又来到了我们的追加节点元素，双向链表追加与单向链表还是有些区别的

当链表为空时，除了要将 `head` 指向当前添加的节点外，还要将 `tail` 也指向当前要添加的节点

当链表不为空时，直接将 `tail` 的 `next` 指向当前要添加的节点 `node`，然后修改 `node` 的 `prev` 指向旧的 `tail`，最后修改 `tail` 为新添加的节点

双向链表的追加操作我们不需要从头开始遍历整个链表，通过 `tail` 可以直接找到链表的尾部，这一点比单向链表的操作更方便，最后将 `length` 值加 1，修改链表的长度即可

```js
// 向双向链表中追加节点
DoubleLinkedList.prototype.append = function (val) {
  let node = new ListNode(val)

  if (this.head === null) {
    // 链表为空，head 和 tail 都指向当前添加的节点
    this.head = node
    this.tail = node
  }
  else {
    // 链表不为空，将当前节点添加到链表的尾部
    this.tail.next = node
    node.prev = this.tail
    this.tail = node
  }

  this.length++
}
```



#### insert(*index*, *val*)

接着是插入节点元素方法，同样思路一致，并不困难，我们注意 `tail` 及 `prev` 指针分情况讨论，插入后长度加 1 即可

```js
// 在双向链表的指定位置插入节点
DoubleLinkedList.prototype.insert = function (index, val) {
  if (index < 0 || index > this.length) return false

  // 插入到尾部
  if (index === this.length) {
    this.append(val)
  } else {
    let node = new ListNode(val)

    if (index === 0) { // 插入到头部
      if (this.head === null) {
        this.head = node
        this.tail = node
      } else {
        node.next = this.head
        this.head.prev = node
        this.head = node
      }
    } else { // 插入到中间位置
      let curNode = this.getElementAt(index)
      let prevNode = curNode.prev
      node.next = curNode
      node.prev = prevNode
      prevNode.next = node
      curNode.prev = node
    }
    this.length++
  }
  return true
}
```



#### removeAt(*index*)

删除双向链表中指定位置的元素，同样是注意 `tail` 及 `prev` 指针分情况讨论，最后删除后长度减 1 即可

```js
// 删除双向链表中指定位置的元素，并返回这个元素的值
DoubleLinkedList.prototype.removeAt = function (index) {
  if (index < 0 || index >= this.length) return null

  let current = this.head
  let prevNode

  if (index === 0) { // 移除头部元素
    this.head = current.next
    this.head.prev = null
    if (this.length === 1) this.tail = null
  } else if (index === this.length - 1) { // 移除尾部元素
    current = this.tail
    this.tail = current.prev
    this.tail.next = null
  } else { // 移除中间元素
    current = this.getElementAt(index)
    prevNode = current.prev
    prevNode.next = current.next
    current.next.prev = prevNode
  }

  this.length--
  return current.val
}
```



#### indexOf(*val*)

在双向链表中查找元素索引，有了上面的 `find` 方法做铺垫，这里就简单了，思路一致，

```js
// 获取双向链表中给定元素的索引
DoubleLinkedList.prototype.indexOf = function (val) {
  let curHead = this.head
  let curTail = this.tail
  let idx = 0
  while (curHead !== curTail) {
    if (curHead.val == val) return idx
    curHead = curHead.next

    if (curTail.val == val) return this.length - 1 - idx
    curTail = curTail.prev

    idx++
  }
  return -1
}
```



#### join*string*)

序列化链表我们还是和上面单向链表一致即可

```js
// 序列化双向链表
DoubleLinkedList.prototype.join = function (string) {
  let cur = this.head
  let str = ''
  while (cur) {
    str += cur.val

    if (cur.next) str += string

    cur = cur.next
  }
  return str
}
```

双向链表我们就介绍这么多，剩下的方法比较简单，就不赘述了，文末双向链表案例中有完整代码

同样，我们来简单测试一下对与否

```js
let doubleLinkedList = new DoubleLinkedList()
doubleLinkedList.append(10)
doubleLinkedList.append(15)
doubleLinkedList.append(20)
doubleLinkedList.append(25)
console.log(doubleLinkedList.join("<->"))

console.log(doubleLinkedList.getElementAt(0).val)
console.log(doubleLinkedList.getElementAt(1).val)
console.log(doubleLinkedList.getElementAt(5))

console.log(doubleLinkedList.join("<->"))
console.log(doubleLinkedList.indexOf(10))
console.log(doubleLinkedList.indexOf(25))
console.log(doubleLinkedList.indexOf(50))

doubleLinkedList.insert(0, 5)
doubleLinkedList.insert(3, 18)
doubleLinkedList.insert(6, 30)
console.log(doubleLinkedList.join("<->"))

console.log(doubleLinkedList.find(10).val)
console.log(doubleLinkedList.removeAt(0))
console.log(doubleLinkedList.removeAt(1))
console.log(doubleLinkedList.removeAt(5))
console.log(doubleLinkedList.remove(10))
console.log(doubleLinkedList.remove(100))

console.log(doubleLinkedList.join("<->"))
```

上面代码输出如下

```js
// 10<->15<->20<->25
// 10
// 15
// null
// 10<->15<->20<->25
// 0
// 3
// -1
// 5<->10<->15<->18<->20<->25<->30
// 10
// 5
// 15
// null
// 10
// null
// 18<->20<->25<->30
```

嗯，没有报错，简单对比一下，是正确的，No Problem



### 环形链表

我们再来看另一种链表，环形链表，顾名思义，环形链表的尾部节点指向它自己的头节点

环形链表有单向环形链表，也可以有双向环形链表，如下图

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201228203035921.png)

单双环形链表这里我们就不再一一的写了，你可以尝试自己写一下，对比上面我们环形链表只需要注意下尾部节点要指向头节点即可





## 为什么JavaScript中不内置链表？

根据我们上面所说，链表有这么多优点，那么为什么 `JavaScript` 这门语言不内置链表这种数据结构呢？

其实 JS 中，数组几乎实现了链表的所有功能，所以没那个必要去再麻烦一次了，听到这里你可能会疑惑，上面不是说，数组在某些情况（例如头部插入等等）下性能不如链表吗？

我们来用事实说话，现在我们用上面完成的单向链表类 `LinkedList`，同原生数组做一个简单的的时间测试

```js
let linkedList = new LinkedList()
let arr = []

// 测试 分别尝试 「总数100 插入节点50」/「总数100000 插入节点50000」
let count = 100
let insertIndex = 50
// let count = 100000
// let insertIndex = 50000

console.time('链表push操作')
for (let i = 0; i < count; i++) {
  linkedList.append(i)
}
console.timeEnd('链表push操作')

console.time('数组push操作')
for (let i = 0; i < count; i++) {
  arr.push(i)
}
console.timeEnd('数组push操作')


console.time('链表insert操作')
linkedList.insert('test节点', insertIndex)
console.timeEnd('链表insert操作')

console.time('数组insert操作')
arr.splice(insertIndex, 0, 'test节点')
console.timeEnd('数组insert操作')


console.time('链表remove操作')
linkedList.removeAt(insertIndex)
console.timeEnd('链表remove操作')

console.time('数组remove操作')
arr.splice(insertIndex, 1)
console.timeEnd('数组remove操作')
```

我们来看下结果

追加 100 个数据，在索引 50 插入元素，再删除插入的元素

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201228210751995.png)

追加 100000 个数据，在索引 50000 插入元素，再删除插入的元素

![](https://cdn.jsdelivr.net/gh/isboyjc/PictureBed/other/image-20201228210701979.png)

What？？？？？？

我们从测试结果可以看到不论基数为 100 这样的小量级或者基数为 100000 这样一个很大的量级时，原生 Array 的性能都依然碾压链表

也就是说链表效率高于数组效率这种话，事实上在 JS 中是不存在的，即使你创建一个长度为 1 亿的数组，再创建一个长度为 10 的数组，并且向这两个数组的中间添加元素，`console.time` 时间出来看看，你会发现所用时间与数组长度长度无关，这说明 JS 数组达到了链表的效率要求

而且数组中我们也可以用 `splice()` 方法向数组的指定位置去添加和删除元素，经测试，所需时间同样与数组长度无关，也能达到链表的要求，而数组的下标完全可以取代链表的 `head,tail,next,prev` 等方法，并且大多数情况下会更方便些，再加上工作中链表这种数据结构的使用场景不是太多，所以可以说 JS 中的数组是完爆链表的

当然，这只局限于 JavaScript 这门语言中，这和 JS 内部的数组实现机制有关，其实 JS 中的数组只是叫数组而已，它和常规语言中的数组概念就不同，那么关于数组概念以及内部实现，不在我们此章节讨论范围之内，先留一个疑问，过几天有空了再另起一篇 JS 数组相关的文章吧，其实自己找去答案最好了，我们说 JS 是一门解释型高级语言，它的底层实现并不像我们看起来那么简单循规，有点打破常规的意思

讲的这里，你可能会吐槽这一篇文章好不容易看完了，现在你给我说没用。。。不要着急，收好臭鸡蛋



## JavaScript中链表无用？

如我们上面所说，难道 `JavaScript` 中的链表当真就毫无作用了吗？

其实也不是，就比如三大法宝之一 `React` 中的 `Fiber` 架构，就用到了链表这种数据结构

`Fiber` 在英文中的意思为 `纤维化`，即细化，将任务进行细化，它把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会，`React` 中的 `Fiber` 就把整个 `VDOM` 的更新过程碎片化

在之前 `React` 中的 `render()` 方法会接收一个 `虚拟DOM` 对象和一个真实的 `容器DOM` 作为 `虚拟DOM` 渲染完成后的挂载节点，其主要作用就是将 `虚拟DOM` 渲染为 `真实DOM` 并挂载到容器下，这个方法在更新的时候是进行递归操作的，如果在更新的过程中有大量的节点需要更新，就会出现长时间占用 JS 主线程的情况，并且整个递归过程是无法被打断的，由于 JS 线程和 GUI 线程是互斥的（详看👉[「硬核JS」一次搞懂JS运行机制](https://juejin.cn/post/6844904050543034376)），所以大量更新的情况下你可能会看到界面有些卡顿

`Fiber` 架构其实就解决两个问题，一是保证任务在浏览器空闲的时候执行，二是将任务进行碎片化，接下来我们简单说下 `Fiber` 

JS 中有一个实验性质的方法 `requestIdleCallback(callback)` ，它可以传入一个回调函数，回调函数能够收到一个 `deadline` 对象，通过该对象的 `timeRemaining()` 方法可以获取到当前浏览器的空闲时间，如果有空闲时间，那么就可以执行一小段任务，如果时间不足了，则继续 `requestIdleCallback`，等到浏览器又有空闲时间的时候再接着执行，这样就实现了浏览器空闲的时候执行

但是 `虚拟DOM` 是树结构，当任务被打断后，树结构无法恢复之前的任务继续执行，所以需要一种新的数据结构，也就是我们的链表，链表可以包含多个指针，`Fiber` 采用的链表中就包含三个指针，`parent` 指向其父 `Fiber`  节点，`child` 指向其子 `Fiber` 节点，`sibling` 指向其兄弟 `Fiber` 节点，一个 `Fiber` 节点对应一个任务节点，这样就可以轻易找到下一个节点，继而也就可以恢复任务的执行

这简简单单的一段，就是大名鼎鼎的 `Fiber` 架构，那么你说链表有用吗？

说了这么多，其实对于普通需求，我们 JS 确实不需要用到链表，数组能完爆它，但是特殊需求里，链表独具它一定的优势，总之三个字，看需求，再者，我们现在是在用 JS 来阐述链表，但是其它常规语言可没有 JS 中的数组这么强悍，而且学会了链表，我们下一个学习树结构时就更加得心应手了



## 最后

文中的案例完整代码地址如下 👇

[单双链表DEMO](https://github.com/isboyjc/DailyAlgorithms/tree/master/demo/algorithm) 

此文介绍数据结构之一的链表，作为链表刷题前的小知识

上班摸鱼水群不如摸鱼刷道算法，百利无一害，坚持每天刷题吧，加油

GitHub建了个算法仓库，从零更算法题/文字/视频 题解ing，一块来刷吧 👉 [GitHub传送门](https://github.com/isboyjc/DailyAlgorithms)  

此文视频版本详见 👉 [B站传送门](https://www.bilibili.com/video/BV1aV411q7WF) 

看到这里了，来个三连吧，如有错误请指正，也欢迎大家关注公众号「不正经的前端」，和算法群的朋友们组团刷算法，效率更高







