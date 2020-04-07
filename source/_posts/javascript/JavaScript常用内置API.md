---
title: JavaScript常用内置API
tags: [JavaScript]
index_img: /blog/img/blog_banner/js02.jpg
banner_img: /blog/img/banner/b043.jpg
date: 2019-03-10 23:30:00
---

# JavaScript 常用内置 API

### JS 简述

##### 三大对象

###### 本地对象

- 与宿主无关，独立于宿主环境的 ECMAScript 实现提供的对象
- 简单来说，本地对象就是 `ECMA-262` 定义的类（引用类型）
- 这些引用类型在运行过程中需要通过 `new` 来创建所需的实例对象

包括：

引用类型：`Object`、`Function`、`Array`、`Date`、`RegExp`

基本包装类型：`String`、`Boolean`、`Number`

其他类型：`Error`、`EvalError`、`RangeError`、`ReferenceError`、`SyntaxError`、`TypeError`、`URIError`等

###### 内置对象

- 与宿主无关，独立于宿主环境的 ECMAScript 实现提供的对象，在 ECMAScript 程序开始执行时出现
- 在 `ECMAScript` 程序开始执行前就存在，本身就是实例化内置对象，开发者无需再去实例化
- 内置对象是本地对象的子集
- 很多时候，会直接把本地对象和内置对象统称为内置对象，也被叫做单体内置对象

包含：

`Global`和`Math`

`ECMAScript5`中增添了`JSON`这个存在于全局的内置对象

###### 宿主对象

- 由 ECMAScript 实现的宿主环境提供的对象，包含两大类，一个是宿主提供，一个是自定义类对象
- 所有非本地对象都属于宿主对象
- 对于嵌入到网页中的 JS 来说，其宿主对象就是浏览器提供的对象，浏览器对象有很多，如`Window`和`Document`等
- 所有的`DOM`和`BOM`对象都属于宿主对象

包括：

1. 宿主提供的对象

   a. BOM&DOM 等

2. 自定义对象

   a. 对象直接量（字面量）

   b. new 操作符跟构造函数

   c. function 对象

##### 两大属性

###### 自有(实例)属性

也可叫实例属性：指对象自身的属性，也就是直接在对象中定义的属性

###### 私有(原型)属性

也可叫原型属性：指对象从原型中继承的属性，也就是在对象的原型对象中定义的属性

### String 对象

##### 属性

###### str.length

返回字符串的长度

##### 方法

###### charAt()

功能：返回指定位置的字符

参数：必须，为目标字符的下标位置

> 若参数 index 不在 0 与 string.length 之间，该方法将返回一个空字符串

###### charCodeAt()

功能：返回在指定位置的字符的 Unicode 编码

参数：必须，为目标字符的下标位置

> 若参数 index 不在 0 与 string.length 之间，该方法将返回 NaN

###### indexOf()

功能：检索字符串，返回指定子字符串在字符串中首次出现的位置。

参数 1：检索目标子字符串，必须

参数 2：在字符串中开始检索的位置，可选。省略该参数，则将从字符串的首字符开始检索

> indexOf() 方法对大小写敏感
>
> 如果要检索的字符串值没有出现，则该方法返回 -1

###### lastIndexOf()

功能：从后向前搜索字符串，返回指定子字符串在字符串中首次出现的位置

参数 1：检索目标子字符串，必须

参数 2：在字符串中开始检索的位置，可选。省略该参数，则将从字符串的最后一个字符开始检索

###### match()

功能：返回指定位置的字符

参数：必须，规定要检索的字符串值或待匹配的 RegExp 对象

返回值：存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g

> regexp 没有 g，match() 方法只执行一次匹配，如果没有找到任何匹配的文本， match() 将返回 null，否则，它将返回一个数组，其中存放了与它找到的匹配文本有关的信息，该数组的第 0 个元素存放的是匹配文本，返回的数组还含有两个对象属性：index 属性为 stringObject 中的索引，input 属性是对 stringObject 的引用
>
> regexp 具有标志 g，则 match() 方法将执行全局检索，找到 stringObject 中的所有匹配子字符串。若没有找到子串，返回 null。如果找到了一个或多个匹配子串，则返回一个数组。返回数组元素中存放的是 stringObject 中所有的匹配子串，没有 index 属性或 input 属性

示例：

```js
let s = "hello23 world23"
console.log(s.match(/\d{2}/)) //[ '23', index: 5, input: 'hello21 world21' ]

let s = "hello23 world23"
console.log(s.match(/\d{2}/g)) //[ '23', '23' ]
```

###### replace()

功能：在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。

参数 1：regexp/substr，必须，规定子字符串或要匹配的 RegExp 对象

参数 2：replacement，必须，用于替换的字符串值

返回值：替换后的一个新字符串

示例：

```js
var s = "hello world hello"
console.log(s.replace("hello", "hi")) //hi world hello
console.log(s.replace(/hello/, "hi")) //hi world hello
console.log(s.replace(/hello/g, "hi")) //hi world hi
```

> 方法返回一个新字符串，不会修改原字符串

###### search()

功能：检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串

参数：regexp/substr，必须，规定子字符串或要匹配的 RegExp 对象

返回值：原字符串中第一次匹配到目标字符串的起始位置

示例：

```js
var s = "hello world hello"
console.log(s.search("hello")) //0
console.log(s.search(/hello/g)) //0
console.log(s.search(/hello2/)) //-1
```

> 方法不执行全局匹配，它将忽略标志 g。也就是说，它只匹配一次。若没匹配到结果，则返回-1

toLowerCase()

功能：把字符串转换为小写

返回值：一个新字符串

示例：

```js
var s = "Hello World"
console.log(s.toLowerCase()) //hello world
```

toUpperCase()

功能：把字符串转换为大写

返回值：一个新字符串

示例：

```js
var s = "Hello World"
console.log(s.toUpperCase()) //HELLO WORLD
```

###### concat()

功能：用于连接两个或多个字符串

语法：stringObject.concat(stringX,stringX,...,stringX)

返回值：衔接后的新字符串

> concat 方法不会修改原字符串
>
> stringObject.concat() 与 Array.concat() 很相似
>
> 通常使用 " + " 运算符来进行字符串的连接运算通常会更简便一些

示例：

```js
var s1 = "hello "
var s2 = "world "
var s3 = "001"
console.log(s1.concat(s2, s3)) //hello world 001
```

###### split()

功能：把一个字符串分割成字符串数组，Array.join( ) 的逆操作

参数 1：separator，必须，字符串或正则表达式，从该参数指定的地方分割原字符串

参数 2：howmany，可选，指定返回数组的最大长度

返回值：一个字符串数组

示例：

```js
var s = "he llo"
console.log(s.split("")) //[ 'h', 'e', ' ', 'l', 'l', 'o' ]
console.log(s.split(" ")) //[ 'he', 'llo' ]
console.log(s.split("l")) //["he ", "", "o"]
```

###### slice()

功能：截取字符串的某个部分

参数 1：截取的起始位置，必须

参数 2：截取的结束位置，可选

返回值：截取部分，一个新的字符串

> String.slice() 与 Array.slice() 相似
>
> slice 方法的两个参数接受负值，若为负数，则该参数规定的是从字符串的尾部开始算起的位置。也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推。 未指定第二个参数，则默认截取至字符串的末尾。 slice 方法不修改原字符串

示例：

```js
var s = "he llo"
console.log(s.slice(3)) //llo
console.log(s.slice(1, 5)) //e ll
console.log(s.slice(-5)) //e llo
console.log(s.slice(-5, -1)) //e ll
```

###### substr()

功能：截取从指定下标开始的指定数目的字符

参数 1：start，必须，截取的起始位置，接受负值

参数 2：length，可选，截取字符串的长度，未指定，则默认截取到原字符串的末尾

返回值：截取部分，一个新的字符串

> ECMAscript 中未对该方法进行标准化，不建议使用

示例：

```js
var s = "he llo"
console.log(s.substr(3)) //llo
console.log(s.substr(3, 2)) //ll
console.log(s.substr(-3, 2)) //ll
```

###### substring()

功能：截取字符串中介于两个指定下标之间的字符

参数 1：start，必须，截取的起始位置

参数 2：end，可选，截取的结束位置，未指定，则默认截取到原字符串的末尾

返回值：截取部分，一个新的字符串

示例：

```js
var s = "he llo"
console.log(s.substring(3)) //llo
console.log(s.substring(3, 5)) //ll
console.log(s.substring(5, 3)) //ll
console.log(s.substring(3, 3)) //''
```

> 与 slice() 和 substr() 方法不同的是，substring() 不接受负的参数
>
> 如果参数 start 与 stop 相等，那么该方法返回的一个空串
>
> 如果 start 比 stop 大，那么该方法在提取子串之前会先交换这两个参数

###### trim()

功能：去除字符串的头尾空格

### Array 对象

##### 属性

###### length

返回数组中元素的数目

> 设置 length 属性可改变数组的大小。如果设置的值比其当前值小，数组将被截断，其尾部的元素将丢失。如果设置的值比它的当前值大，数组将增大，新的元素被添加到数组的尾部，它们的值为 undefined

###### constructor

数组对象构造器，返回对创建此对象的数组函数的引用

###### prototype

数组对象原型，用于向对象添加属性和方法

##### 方法

###### concat()

用于拼接数组，不会改变原有数组

> 如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组

###### join()

把数组中的所有元素放入一个字符串，元素是通过指定的分隔符进行分隔的

> 若省略了分隔符参数，则默认使用逗号作为分隔符

示例：

```js
let arr = [1, 2, 3]
arr.join() // '1,2,3'
arr.join(0) // '10203'
```

###### push()

向数组的末尾添加一个或多个元素，返回新的数组长度

###### pop()

用于删除数组的最后一个元素，把数组长度减 1，返回被删除元素

> 如果数组已经为空，则 pop() 不改变数组，并返回 undefined

###### shift()

用于把数组的第一个元素从其中删除，并返回被移除的这个元素

> 如果数组是空的，那么 shift() 方法将不进行任何操作，返回 undefined
>
> 该方法直接修改原数组

###### unshift()

向数组的开头添加一个或更多元素，并返回新的数组长度

> 该方法直接修改原数组

###### reverse()

用于反转数组中元素顺序

该方法直接修改原数组，不会创建新数组

###### sort()

用于对数组的元素进行排序

该排序直接修改原数组

该方法接受一个可选参数，若未使用参数，将按字母顺序对数组元素进行排序，说得更精确点，是按照字符编码的顺序进行排序。要实现这一点，首先应把数组的元素都转换成字符串（如有必要），以便进行比较。

如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：

- 若 a 小于 b，排序后 a 应该在 b 之前，则返回一个小于 0 的值
- 若 a 等于 b，则返回 0。
- 若 a 大于 b，则返回一个大于 0 的值

示例：

```js
arr1 = ["tom", "array", "obj", "string", "bool"]
arr1.sort() // ["array", "bool", "obj", "string", "tom"] 按照字母顺序

arr2 = [1, 20, 90, 21, 1000, 300]
arr2.sort() // [1, 1000, 20, 21, 300, 90]

arr2.sort((a, b) => {
  return a - b
}) // [1, 20, 21, 90, 300, 1000]

arr2.sort((a, b) => {
  return b - a
}) // [1000, 300, 90, 21, 20, 1]
```

###### slice()

参数：start [,end]

截取原数组从 start 到 end 位置（不包含它）元素组成的子数组

> 该方法返回一个新数组，不会修改原数组
>
> 若未指定 end 参数，那么截取 start 直到原数组最后一个元素（包含它）

###### splice()

参数：index,howmany [,item1,item2...]

删除从 index 处开始的 hownamy 个元素，并且用可选参数列表中声明的一个或多个值来替换那些被删除的元素

> 该方法返回的是含有被删除的元素组成的数组，若无被删元素，则返回空数组。
>
> 若参数只有 index，那么原数组将从 index 开始删除直至结尾。
>
> 该方法直接修改原数组

###### includes()

参数:1:必须,要判断的元素 2:可选,表示判断的起始位置,可为负数

返回值:true||false

> ES6 数组方法
>
> 判断数组是否包含某一元素
>
> 它直接返回 true 或者 false 表示是否包含元素，对 NaN 一样能有有效

###### forEach((v,i,a)=>{})

作用：让数组的每一项都执行一次给定的 callback

参数：callback v 表示当前项的值，i 表示当前索引，a 表示数组本身

> forEach 遍历的范围在第一次调用 callback 前就会确定。调用 forEach 后添加到数组中的项不会被 callback 访问到。如果已经存在的值被改变，则传递给 callback 的值是 forEach 遍历到他们那一刻的值。已删除的项不会被遍历到

###### map()

参数：map(callback, thisValue)

> callback 为必须项，(currentValue,index,arr)=>{}
>
> _currentValue_ 必须。当前元素的值
>
> _index_ 可选。当前元素的索引值
>
> _arr_ 可选。当前元素属于的数组对象
>
> thisValue 可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。 如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象

示例：

```js
var numbers = [4, 9, 16, 25]
numbers.map(Math.sqrt) // 2,3,4,5
```

### Number 对象

##### toExponential()

把对象的值转换为指数计数法

示例：

```js
var num = 5.56789
var n = num.toExponential() // 5.56789e+0
```

##### toFixed()

把数字转换为字符串，结果的小数点后有指定位数的数字

示例：

```js
var num = 5.56789
var n = num.toFixed(2) // 5.57
```

##### toPrecision()

把数字格式化为指定的长度

示例：

```js
var num = new Number(13.3714)
var n = num.toPrecision(2) // 13
```

### JSON 对象

##### JSON.parse()

功能：将字符串反序列化成对象

参数：JSON 字符串

返回值：对象

##### JSON.stringify()

功能：将一个对象解析为 JSON 字符串

参数：对象

返回值：JSON 字符串

> 该字符串应该符合 JSON 格式，并且可以被 JSON.parse 方法还原
>
> JSON.stringify(obj, selectedProperties)还可以接受一个数组
>
> 作为第二个参数，指定需要转成字符串的属性
>
> 还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性
>
> 如果是数字，表示每个属性前面添加的空格（最多不超过 10 个）
>
> 如果是字符串（不超过 10 个字符），则该字符串会添加在每行前面

### Math 对象

##### 属性

###### Math.E

常数 e

###### Math.LN2

2 的自然对数

###### Math.LN10

10 的自然对数

###### Math.LOG2E

以 2 为底的 e 的对数

###### Math.LOG10E

以 10 为底的 e 的对数

###### Math.PI

常数 Pi

###### Math.SQRT1_2

0.5 的平方根

###### Math.SQRT2

2 的平方根

##### 数学方法

###### Math.abs()

返回参数的绝对值

###### Math.ceil()

向上取整，接受一个参数，返回大于该参数的最小整数

###### Math.floor()

向下取整

###### Math.max(n,n1,...)

可接受多个参数，返回最大值

###### Math.min(n,n1,..)

可接受多个参数，返回最小值

###### Math.pow(n,e)

指数运算, 返回以第一个参数为底数、第二个参数为幂的指数值

###### Math.sqrt()

返回参数值的平方根。如果参数是一个负值，则返回 NaN

###### Math.log()

返回以 e 为底的自然对数值

###### Math.exp()

返回 e 的指数，也就是常数 e 的参数次方

###### Math.round()

四舍五入

###### Math.random()

返回 0 到 1 之间的一个伪随机数，可能等于 0，但是一定小于 1。

##### 三角函数方法

###### Math.sin()

返回参数的正弦

###### Math.cos()

返回参数的余弦

###### Math.tan()

返回参数的正切

###### Math.asin()

返回参数的反正弦（弧度值）

###### Math.acos()

返回参数的反余弦（弧度值）

###### Math.atan()

返回参数的反正切（弧度值）

### Date 对象

##### Date()

返回当日的日期和时间

##### getDate()

从 Date 对象返回一个月中的某一天 (1 ~ 31)

##### getDay()

从 Date 对象返回一周中的某一天 (0 ~ 6)

##### getMonth()

从 Date 对象返回月份 (0 ~ 11)

##### getFullYear()

从 Date 对象以四位数字返回年份

##### getYear()

ECMAScript v3 开始，JavaScript 的实现就不再使用该方法， 请使用 getFullYear() 方法代替

##### getHours()

返回 Date 对象的小时 (0 ~ 23)

##### getMinutes()

返回 Date 对象的分钟 (0 ~ 59)

##### getSeconds()

返回 Date 对象的秒数 (0 ~ 59)

##### getMilliseconds()

返回 Date 对象的毫秒(0 ~ 999)

##### getTime()

返回 1970 年 1 月 1 日至今的毫秒数

##### getTimezoneOffset()

返回本地时间与格林威治标准时间 (GMT) 的分钟差

##### getUTCDate()

根据世界时从 Date 对象返回月中的一天 (1 ~ 31)

##### getUTCDay()

根据世界时从 Date 对象返回周中的一天 (0 ~ 6)

##### getUTCMonth()

根据世界时从 Date 对象返回月份 (0 ~ 11)

##### getUTCFullYear()

根据世界时从 Date 对象返回四位数的年份

##### getUTCHours()

根据世界时返回 Date 对象的小时 (0 ~ 23)

##### getUTCMinutes()

根据世界时返回 Date 对象的分钟 (0 ~ 59)

##### getUTCSeconds()

根据世界时返回 Date 对象的秒钟 (0 ~ 59)

##### getUTCMilliseconds()

根据世界时返回 Date 对象的毫秒(0 ~ 999)

##### parse()

返回 1970 年 1 月 1 日午夜到指定日期（字符串）的毫秒数

##### setDate()

设置 Date 对象中月的某一天 (1 ~ 31)

##### setMonth()

设置 Date 对象中月份 (0 ~ 11)

##### setFullYear()

设置 Date 对象中的年份（四位数字）

##### setYear()

请使用 setFullYear() 方法代替

##### setHours()

设置 Date 对象中的小时 (0 ~ 23)

##### setMinutes()

设置 Date 对象中的分钟 (0 ~ 59)

##### setSeconds()

设置 Date 对象中的秒钟 (0 ~ 59)

##### setMilliseconds()

设置 Date 对象中的毫秒 (0 ~ 999)

##### setTime()

以毫秒设置 Date 对象

##### setUTCDate()

根据世界时设置 Date 对象中月份的一天 (1 ~ 31)

##### setUTCMonth()

根据世界时设置 Date 对象中的月份 (0 ~ 11)

##### setUTCFullYear()

根据世界时设置 Date 对象中的年份（四位数字）

##### setUTCHours()

根据世界时设置 Date 对象中的小时 (0 ~ 23)

##### setUTCMinutes()

根据世界时设置 Date 对象中的分钟 (0 ~ 59)

##### setUTCSeconds()

根据世界时设置 Date 对象中的秒钟 (0 ~ 59)

##### setUTCMilliseconds()

根据世界时设置 Date 对象中的毫秒 (0 ~ 999)

##### toSource()

返回该对象的源代码

##### toString()

把 Date 对象转换为字符串

##### toTimeString()

把 Date 对象的时间部分转换为字符串

##### toDateString()

把 Date 对象的日期部分转换为字符串

##### toGMTString()

请使用 toUTCString() 方法代替

##### toUTCString()

根据世界时，把 Date 对象转换为字符串

##### toLocaleString()

根据本地时间格式，把 Date 对象转换为字符串

##### toLocaleTimeString()

根据本地时间格式，把 Date 对象的时间部分转换为字符串

##### toLocaleDateString()

根据本地时间格式，把 Date 对象的日期部分转换为字符串

##### UTC()

根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数

##### valueOf()

返回 Date 对象的原始值

### Global 对象

> 全局对象只是一个对象，而不是类。既没有构造函数，也无法实例化一个新的全局对象

##### 属性

###### Infinity

代表正的无穷大的数值

###### NaN

代表非数字

###### Undefined

代表未定义的值

示例：

```js
var a
var b = ""
var c = null

console.log(a === undefined) //true
console.log(b === undefined) //false
console.log(c == undefined) //true
```

##### 方法

###### encodeURI(URIString)

功能：将字符串作为 URI 进行编码，返回值为 URIstring 的副本

参数：URIString(必须)，一个待编码的字符串

> 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - \_ . ! ~ \* ' ( ) 。
>
> 该方法的目的是对 URI 进行完整的编码，因此对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：;/?:@&=+\$,#
>
> 如果 URI 组件中含有分隔符，比如 ? 和 #，则应当使用 encodeURIComponent() 方法分别对各组件进行编码

示例：

```js
console.log(encodeURI("http://www.baidu.com/my m?:@&=+$#"))
// http://www.baidu.com/my%20m?:@&=+$#
```

###### decodeURI()

功能：上述解码

###### encodeURIComponent(URIString)

功能：将字符串作为 URI 组件进行编码，返回值为 URIstring 的副本

参数：URIString(必须)，一个待编码的字符串

> 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - \_ . ! ~ \* ' ( )
>
> 其他字符（比如 ：;/?:@&=+\$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的

> encodeURI 和 encodeURIComponent 的区别：
>
> 它们都是编码 URL，唯一区别就是编码的字符范围，其中 encodeURI 方法不会对下列字符编码 ASCII 字母、数字、~!@#\$&_()=:/,;?+'
> encodeURIComponent 方法不会对下列字符编码 ASCII 字母、数字、~!_()'
> 所以 encodeURIComponent 比 encodeURI 编码的范围更大。
> 实际例子来说，encodeURIComponent 会把 http:// 编码成 http%3A%2F%2F 而 encodeURI 却不会。

示例：

```js
console.log(encodeURI('http://www.baidu.com/home/some other thing')
//编码后为：http://www.baidu.com/home/some%20other%20thing 空格被编码成了%20

console.log(encodeURIComponent('http://www.baidu.com/home/some other thing'))
//http%3A%2F%2Fwww.baidu.com%2Fhome%2Fsome%20other%20thing    "/"被编码，无法使用

var param = "http://www.baidu.com/home/"	 //param为参数
param = encodeURIComponent(param)
var url = "http://www.baidu.com?next=" + param
console.log(url) //'http://www.baidu.com?next=http%3A%2F%2Fwww.baidu.com%2Fhome%2F'
// 参数中的 "/" 被编码了，如果用encodeURI会出问题，因为后面的/是需要编码的
```

###### decodeURIComponent()

功能：上述解码

###### escape(string)

功能：对字符串进行编码，把中文变乱码

> 会转义除了`@*_+-./`以外的所有字符
>
> 已经从 Web 标准中废弃。绝大多数情况都可以使用`encodeURI`和`encodeURIComponent`来代替

示例：

```js
var aaa = "中国123,"
escape(aaa) // "%u4E2D%u56FD123%2C"
```

###### unescape()

功能：上述反编译

###### parseInt(string,radix)

功能：解析一个字符串，并返回一个整数。

参数：

- string(必须)：待解析的字符串
- radix(可选)：表示要解析的数字的基数。该值介于 2 ~ 36 之间，如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN

> 开头和结尾的空格是允许的
>
> 如果字符串的第一个字符不能被转换为数字，那么 parseFloat() 会返回 NaN
>
> 当参数  *radix*  的值为 0，或没有设置该参数时，parseInt() 会根据  *string*  来判断数字的基数 。如果 string 以 "0x" 开头，parseInt() 会把 string 的其余部分解析为十六进制的整数。如果 string 以 0 开头，那么 ECMAScript v3 允许 parseInt() 的一个实现把其后的字符解析为八进制或十六进制的数字。如果 string 以 1 ~ 9 的数字开头，parseInt() 将把它解析为十进制的整数

示例：

```js
parseInt("10") //返回 10
parseInt("19", 10) //返回 19 (10+9)
parseInt("11", 2) //返回 3 (2+1)
parseInt("17", 8) //返回 15 (8+7)
parseInt("1f", 16) //返回 31 (16+15)
parseInt("010") //未定：返回 10 或 8
parseInt("0x0011") //17
```

###### parseFloat(string)

功能：解析一个字符串，并返回一个浮点数

参数：string(必须)，待解析的字符串

> 该函数指定字符串中的首个字符是否是数字。如果是，则对字符串进行解析，直到到达数字的末端为止

示例：

```js
parseFloat("10") //10
parseFloat("10.00") //10
parseFloat("10.33") //10.33
parseFloat(" 60 ") //60 首尾空格会忽略
parseFloat("23 34 45") //23 中间空格不会忽略，会中断
parseFloat("23 years") //23
parseFloat("i am 23") //NaN
```

###### isFinite(number)

功能：用于检查其参数是否是无穷大

参数：

- number(必须)：待检测数字
  如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false

示例：

```js
console.log(isFinite(123)) //true
console.log(isFinite(-1.23)) //true
console.log(isFinite(6 - 3)) //true
console.log(isFinite(0)) //true
console.log(isFinite(0 / 0)) //false
console.log(isFinite("Hello")) //false
```

###### isNaN(number)

功能：用于检查其参数是否为非数字值

参数：

- number(必须)：待检测数字
  如果 number 是非数字值 NaN（或者能被转换成 NaN），返回 true，否则返回 false

示例：

```js
console.log(isNaN(123)) //false
console.log(isNaN(-1.23)) //false
console.log(isNaN(6 - 3)) //false
console.log(isNaN(0)) //false
console.log(isNaN(0 / 0)) //true
console.log(isNaN("Hello")) //true
```

###### Number(object)

功能：把对象的值转换为数字

参数：

- object(必须)：待转换的对象
  如果参数是 Date 对象，Number() 返回从 1970 年 1 月 1 日至今的毫秒数，即时间戳。如果对象的值无法转换为数字，那么 Number() 函数返回 NaN

示例：

```js
console.log(Number(true)) // 1
console.log(Number(false)) // 0
console.log(Number(new Date())) // 1506266494726
console.log(Number("999")) // 999
console.log(Number("999 888")) // NaN
```

###### String(object)

功能：把对象的值转换为字符串

参数：object(必须)，待转换的对象

示例：

```js
console.log(String(true)) // 'true'
```

###### getClass()

返回一个 JavaObject 的 JavaClass

###### eval(string)

功能：可计算某个字符串，并执行其中的的 JavaScript 代码

参数：必需，要计算的字符串，其中含有要计算的 JavaScript 表达式或要执行的语句

返回值：通过计算 string 得到的值

### Console 对象

##### console.log(text,text2,...)

用于在 console 窗口输出信息

> 它可以接受多个参数，将它们的结果连接起来输出
>
> 如果第一个参数是格式字符串（使用了格式占位符）
>
> console.log 方法将依次用后面的参数替换占位符，然后再进行输出

##### console.info()

在 console 窗口输出信息，同时，会在输出信息的前面，加上一个蓝色图标

##### console.debug()

在 console 窗口输出信息，同时，会在输出信息的前面，加上一个蓝色图标

##### console.warn()

输出信息时，在最前面加一个黄色三角，表示警告

##### console.error()

输出信息时，在最前面加一个红色的叉，表示出错，同时会显示错误发生的堆栈

##### console.table()

可以将复合类型的数据转为表格显示

##### console.count()

用于计数，输出它被调用了多少次

##### console.dir()

用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示

##### console.dirxml()

用于以目录树的形式，显示 DOM 节点

##### console.assert()

接受两个参数，第一个参数是表达式，第二个参数是字符串

> 只有当第一个参数为 false，才会输出第二个参数，否则不会有任何结果

##### console.time()

##### console.timeEnd()

这两个方法用于计时，可以算出一个操作所花费的准确时间

> time 方法表示计时开始，timeEnd 方法表示计时结束, 它们的参数是计时器的名称
>
> 调用 timeEnd 方法之后，console 窗口会显示“计时器名称: 所耗费的时间”

##### console.profile()

用来新建一个性能测试器（profile），它的参数是性能测试器的名字

##### console.profileEnd()

用来结束正在运行的性能测试器

##### console.group()

##### console.groupend()

上面这两个方法用于将显示的信息分组。它只在输出大量信息时有用，分在一组的信息，可以用鼠标折叠/展开

##### console.groupCollapsed()

用于将显示的信息分组，该组的内容，在第一次显示时是收起的（collapsed），而不是展开的

##### console.trace()

显示当前执行的代码在堆栈中的调用路径

##### console.clear()

用于清除当前控制台的所有输出，将光标回置到第一行

> 本文参考：
>
> <https://segmentfault.com/a/1190000011467723#articleHeader1>
>
> <https://www.runoob.com/js/js-tutorial.html>
>
> 您可以克隆到本地，随时随地翻阅，md 格式文档，推荐使用 typora
>
> 本文是为了熟悉下 JS 的 API 所写，只是些常用的，不如手册全面
>
> 如需全面的 api 文档，请移步菜鸟教程等 JS 手册
