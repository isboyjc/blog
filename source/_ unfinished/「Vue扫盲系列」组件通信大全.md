---
title: 「Vue扫盲系列」组件通信大全
tags: [Vue]
categories: Vue扫盲系列
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
banner_img: /blog/img/banner/b034.jpg
date: 2019-09-12 20:30:00
---

# 「Vue 扫盲系列」组件通信大全

### 前言

说起 Vue 组件通信，可能都以为是个基础的话题，但是这个基础的东西你可能了解的不太透彻

参考工作中及 Vue 文档，写了市面上的所有的组件通信方式，如有遗漏欢迎补充

将来如果面试或者技术交流中有人问你组件通信，可以以此回怼

中间也穿插了一些和内容相关的我们不经常用却非常实用的小技巧，仔细阅读，会有点收获的

不知道为什么，好多人宁愿看看贴子，也不愿意仔细读文档，其实官方文档啥都有

估计大部分人都觉得看文档太慢了，认为搜一篇贴子读完 2 分钟比看文档 10 分钟学到的多

其实也对，但是官方文档上很全面而且绝对正确，这是贴子比不了的，所以还是有必要读一读文档的

最后来一句：请仔细阅读我们的 Vue 文档，哈哈

好了，进入正题

### No.1-prop

> props 属性是开发中最常用的一种组件通信通讯方式 , 父组件中在组件标签上定义属性 , 子组件内定义 props 接收，用大家基本上都会用，但是如果你仔细阅读文档的话，它有很多技巧
>
> 注意 prop 是单向的，它只能父传子不能子传父

#### 基础用法

- 父组件传值

```html
<tempalte>
	<Child msg="hello word"></Child>
</template>
```

- 子组件接收

```html
<tempalte>
	<h1>{{msg}}</h1>
</template>
<script>
  export default{
    props:["msg"]
  }
</script>
```

#### prop 值大小写

HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符，当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名

其实就是如果你使用短横线分隔命名方式传个值，接收时要转为驼峰写法

- 父组件

```html
<tempalte>
	<Child child-data="hello word"></Child>
</template>
```

- 子组件

```html
<tempalte>
	<h1>{{msg}}</h1>
</template>
<script>
  export default{
    props:["childData"]
  }
</script>
```

#### 关于父组件传值

##### 传入的 prop 无值

不知道你有没有见过 prop 没有值的情况，反正我被坑过，prop 在没有值的情况下其实就是意味着值为 true

```html
<child isBool></child>
```

上述等同于

```html
<child isBool="true"></child>
```

##### 传入一个对象的所有属性

如果你想要将一个对象的所有属性都作为 prop 传入，可以使用不带参数的`v-bind`简写，可以理解为展开了对象的所有属性值，如下

如果我想把对象 obj 的所有属性都传进去

```js
obj = {
  aa: 1,
  bb: "omg",
  cc: [1, 2, 3],
}
```

可简写为

```html
<child v-bind="obj"></child>
```

等价于

```html
<child :aa="obj.aa" :bb="obj.bb" :cc="obj.cc"></child>
```

#### 关于子组件接收值

##### prop 的校验

```html
<script>
  export default {
    // props可以以字符串数组形式列出，但是不推荐使用这种
    // props:["msg","data"]

    // 以对象形式接收值，每一个key做为一个值，可带有校验
    // 推荐使用带有校验的方式，代码更清晰
    props: {
      // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
      // type的默认类型有 [String,Number,Boolean,Object,Date,Function,Symbol]
      // 另外 type 还可以是一个自定义的构造函数，比如自定义了一个Person构造方法，校验时则会通过instanceof判断该值是不是通过 new Person 创建的
      aa: Number,
      // 多个可能的类型
      bb: [String, Number],
      // required，是否为必填项
      cc: {
        type: String,
        required: true,
      },
      // default，带有默认值
      dd: {
        type: Number,
        default: 100,
      },
      // 带有默认值的对象
      ee: {
        type: Object,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return { message: "hello" }
        },
      },
      // 自定义验证函数
      ff: {
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return ["success", "warning", "danger"].indexOf(value) !== -1
        },
      },
    },
  }
</script>
```

当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告

##### 非 prop 的特性

###### 继承

一个非 prop 特性是指传向一个组件，但是该组件并没有相应 prop 定义的特性

其实意思就是我们在使用一个组件时，传了很多值，但是其中有些值在子组件中并没有定义 props 接收，那么这些值会自动继承到子组件的根元素上

- 父组件

```html
<Child aaa="111" bbb="222" ccc="333" ddd="444"></Child>
```

- 子组件

```html
<tempalte>
	<div>
    <h1>{{aaa}}</h1>
  </div>
</template>
<script>
  export default{
    props:["aaa"]
  }
</script>
```

如上述这个例子，我们在父组件中传了四个值，子组件中只接收了一个 aaa，那么其他的值会跑哪去了呢，未定义接收的值就会自动添加到子组件的跟元素上，子组件**编译渲染后**结果如下

```html
<div bbb="222" ccc="333" ddd="444">
  <h1>111</h1>
</div>
```

我们要怎样取到这些未定义接收的值呢，Vue 官方在 2.4 之后新增了`$attrs`，它就会继承所有的父组件属性（除了 prop 声明的属性、class 和 style ）

也就是说这些未定义接收的属性，会全在\$attrs 里面，这样我们取就很方便了，如下

```html
<tempalte>
	<div>
    <h1>{{aaa}}</h1>
    <p>{{$attrs.bbb}}{{$attrs.ccc}}{{$attrs.ddd}}</p>
  </div>
</template>
<script>
  export default{
    props:["aaa"],
    created(){
      console.log(this.$attrs)
    }
  }
</script>
```

###### 禁用继承

上面说到，未定义接收的属性值会被自动添加到组件根元素，我们看编译后的组件根元素就可以看到，这样不太美观，那有没有办法不让他自动继承到根元素呢

Vue 官方为我们提供了`inheritAttrs`属性，它接受一个布尔值，用于控制组件是否会在根元素自动继承父组件的属性值(在 props 中未定义接收的)，它默认为 true，所以我们上面才可以看到编译后的根组件上有那些属性值，我们把它改成 false，如下

```html
<tempalte>
	<div>
    <h1>{{aaa}}</h1>
    <p>{{$attrs.bbb}}{{$attrs.ccc}}{{$attrs.ddd}}</p>
  </div>
</template>
<script>
  export default{
    inheritAttrs:false,
    props:["aaa"]
  }
</script>
```

这样就不会继承到根组件啦

有时候我们在写组件时，父组件中传了很多值，我们想不管子组件有没有接收，这些属性值都作为属性放在子组件某个元素上，这个时候我们可以参考上述 [prop 传值传一个对象的所有属性] 写法，使用`v-bind="$attr"`把未定义接收的值展开全放在一个元素上，因为`$attrs`也是一个对象，讲的不太明白，我们来看应用场景

如下面的 input 组件(只是组件名字写成了 el-input，它并不是 element-ui)

- 父组件中

```html
<el-input type="text" maxlength="10" placeholder="请输入姓名"></el-input>
```

- el-input 子组件

```html
<tempalte>
	<div>
    <input :type="type" v-bind="$attrs" />
  </div>
</template>
<script>
  export default{
    name:"elInput",
    inheritAttrs:false,
    props:{
      type:{
        type:String,
        default:'text'
      }
    }
  }
</script>
```

如上述，我们要自定义一个 input 组件，我们想对 input 做一些扩展，但是又不想改变原生的使用方式

就像上面，我们要对 type 值做扩展处理，就只接收了 type，传值时我传了原生 input 属性的 placeholder 和 maxlength，这两个我并不需要做扩展，所以没有定义接收，这个时候它会自动继承到子组件跟元素，这样不太好看，所以我设置了`inheritAttrs:false`，我想把这两个没定义接收的属性都放到 input 标签上，就在 input 标签上写了个`v-bind="$attrs"`，就是上面展开对象的写法，它就会把`$attrs`上所有属性值都展开到 input 元素属性上，大功告成，这只是其中一种使用场景，你 get 到了嘛

###### 替换/合并已有的特性

另外，如果你在父组件中传入了一个属性，子组件根元素上也有一个相同属性，由于会自动继承的关系，那么父组件传入的属性值会覆盖子组件跟元素的属性值，这之中只有 class 和 style 是个例外，class 和 style 会把两边的值合并起来，如下

- 父组件

```html
<Child type="Number" class="aaa"></Child>
```

- 子组件

```html
<template>
  <input type="text" class="sss" />
</template>
```

这样子组件再编译时会编译成下面这种

```html
<input type="Number" class="aaa sss" />
```

注意`inheritAttrs: false` 选项可以关闭继承，但是不会影响 style 和 class 的绑定

### No.2-$emit & \$on -u

> \$emit 触发当前实例自定义事件 , 附加参数会传给监听器回调
>
> \$on 监听当前实例上的自定义事件。事件可以由 vm.\$emit 触发。监听器回调函数会接收所有传入事件触发函数的额外参数

#### \$emit

vm.\$emit( event, […args] )

emit 第一个参数则是所要派发的事件名，必须是 String 类型的，其他参数都会传给监听器

- 子组件

```vue
<tempalte>
	<button @click="onClick">lalala</button>
</template>
<script>
export default{
  data(){
    return {
      test:'我是子组件child的test'
    }
  },
  methods:{
    onClick(){
      this.$emit("childFn",'哈哈哈','omg')
    }
  }
}
</script>
```

- 父组件

```vue
<tempalte>
	<Child msg="hello word" @childFn="onChild"></Child>
</template>
<script>
export default{
  data(){
    return {}
  },
  methods:{
    onChild(a,b){
      console.log("父组件收到")
      console.log(a,b)
    }
  }
}
</script>
```

子组件 emit 一个`childFn`事件，父组件调用子组件`Child`时在其上自定义了一个相同的`childFn`事件来接收，上面这种用法想必大家最常用，用法不多做赘述

那么问题来了，子组件和父组件谁在派发事件，又是谁在监听事件，猜一猜？**(圈起来)**

#### \$on

### No.3-$attrs & ​\$listeners -u

### No.4-provide & inject -u

> provide 和 inject 为 2.2.0 新增主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
>
> 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。

### No.5-parent & children -u

### No.6-\$root

> \$root 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己

- main.js 中

```js
new Vue({
  data: {
    bar: "bar",
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
```

`this.$root`可获取到当前项目组件树的根 Vue 实例，也就是整个实例。。

如上我们在根实例创建时写了一个 data，里面放了一个 bar

那么我们在任何组件都可以通过`this.$root.bar`获取到 bar，也可以更改它

你可以吧所有想要跨级使用的数据放在根实例上，这也算是一种通讯方式，但是请不要在项目中使用，不然被人发现了，性命堪忧

因为你都放在这，项目稍微一大，你根本不知道数据的流向，不知道在哪使用了，也不知道在哪更改了它，就是所谓的强耦合，烂代码。。

### No.7-\$refs

> `ref` 被用来给元素或子组件注册引用信息，引用信息将会注册在父组件的 `$refs` 对象上
>
> 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例

平常我们大多数都是使用\$refs 获取 dom 元素，但是如果我们仔细看文档，其实它也可以获取子组件实例，如下

- 子元素

```html
<template>
  <div>{{msg}}</div>
</template>
<script>
  export default {
    data() {
      return {
        msg: "我是msg",
      }
    },
  }
</script>
```

- 父组件

```html
<template>
  <Child ref="aaa"></Child>
</template>
<script>
  export default {
    mounted() {
      setTimeout(() => {
        console.log(this.$refs.child)
        this.$refs.child.msg = "我是子组件中的msg，我被改变了"
      }, 5000)
    },
  }
</script>
```

注意：我们亲爱的文档说，ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在，所以上文是在 mounted 生命周期中获取的

如上所示，子组件中我定义了一个 msg，在父组件挂载完成 5 秒后更改了子组件中的 msg，我们看输出，输出的是 child 组件实例，**说明父组件中我通过\$refs 获取到了 child 实例**，可以看到，子组件的 msg 值在 5 秒后也被改变了。

啥子？它有啥用？你都获取到子组件的实例了，还不是想怎么玩怎么玩，你想在父组件中改子组件属性值调用子组件方法啥的都可以，你品，细品

### No.8-EventBus -u

### No.9-broadcast & dispatch -u

### No.10-solt -u

### No.11-路由传参 -u

### No.12-Vue.observable -u

### No.13-Vuex -u
