---
title: Vue 基础面试题
tags: [Vue, 面试]
categories: 面试
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
banner_img: /blog/img/banner/b033.jpg
date: 2019-06-10 19:00:00
---

# Vue 基础面试题

### 1. MVVM&&MVC

#### 1.1 MVVM

```js
MVVM -> Model-View-ViewModel
Model 代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。
View 代表UI组件，它负责将数据模型转化成UI展现出来。
ViewModel 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步View 和 Model的对象，连接Model和View。
在MVVM架构下，View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互，Model 和 ViewModel 之间的交互是双向的， 因此View 数据的变化会同步到Model中，而Model 数据的变化也会立即反应到View 上。
ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。
```

#### 1.2 MVC

```JS
MVC是Model-View- Controller的简写，即模型-视图-控制器，M和V和MVVM中的M和V是一样的，C是Controller即页面义务逻辑
使用MVC的目的就是为了M和V代码分离。MVVM的VM并不是完全取代C，VM存在的目的是抽离C中的业务逻辑
```

#### 1.3 MVVM&&MVC 区别

```js
MVC是单向的数据传递。MVVM是双向数据绑定，主要解决了MVC中大量的DOM操作使页面的渲染性能降低，加载速度变慢，影响用户体验
```

### 2. Vue 生命周期

#### 2.1 什么是生命周期

```js
Vue 实例从创建到销毁的过程，就是生命周期。从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、销毁等一系列过程，称之为 Vue 的生命周期
```

#### 2.2 生命周期的作用

```js
生命周期中有多个事件钩子，在控制整个Vue实例的过程时更容易形成好的逻辑
```

#### 2.3 生命周期阶段

```js
它可以总共分为8个阶段：创建前/后, 载入前/后,更新前/后,销毁前/销毁后

beforeCreate （创建前） 在数据观测和初始化事件还未开始
created	     （创建后） 完成数据观测，属性和方法的运算，初始化事件，$el属性还没有显示出来
beforeMount  （载入前） 在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。注意此时还没有挂载html到页面上。
mounted      （载入后） 在el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html页面中。此过程中进行ajax交互。
beforeUpdate （更新前） 在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
updated      （更新后） 在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
beforeDestroy（销毁前） 在实例销毁之前调用。实例仍然完全可用。
destroyed    （销毁后） 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。
```

#### 2.4 第一次加载会触发哪些钩子

```js
会触发beforeCreate, created, beforeMount, mounted
```

#### 2.5 DOM 渲染在哪个周期中就已经完成

```js
DOM 渲染在 mounted 中就已经完成
```

### 3. 双向绑定原理

#### 3.1 原理

```js
Object.defineProperty()

vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty（）来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果
```

#### 3.2 js 实现双向数据绑定

```html
<body>
  <div id="app">
    <input type="text" id="txt" />
    <p id="show"></p>
  </div>
</body>
<script type="text/javascript">
  var obj = {}
  Object.defineProperty(obj, "txt", {
    get: function () {
      return obj
    },
    set: function (newValue) {
      document.getElementById("txt").value = newValue
      document.getElementById("show").innerHTML = newValue
    },
  })
  document.addEventListener("keyup", function (e) {
    obj.txt = e.target.value
  })
</script>
```

### 4. Vue 组件传参

#### 4.1 父与子传参

```js
子组件通过props方法接受数据
```

#### 4.2 子与父传参

```js
$emit方法传递参数
```

#### 4.3 非父子&&兄弟间传参

```js
eventBus，创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。项目比较小时，这个比较合适。
也可以直接使用用VUEX，具体来说看需求
```

### 5. Vue 路由

#### 5.1 路由跳转

```js
声明式(标签式)
<router-link :to="index">

编程式
router.push({path:'/',query:{}})
```

#### 5.2 路由实现：hash 模式 和 history 模式

```js
hash模式：
在浏览器中符号“#”，#以及#后面的字符称之为hash，用window.location.hash读取；
特点：hash虽然在URL中，但不被包括在HTTP请求中；用来指导浏览器动作，对服务端安全无用，hash不会重加载页面。
hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 http://www.xxx.com，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

history模式：
history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。
history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.xxx.com/items/id。后端如果缺少对 /items/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”
```

#### 5.3 Vue 路由守卫(路由钩子)

全局守卫

```js
beforeEach，afterEach 路由钩子函数，也叫路由守卫

beforeEach 全局前置守卫，当一个导航触发时，全局前置守卫按照创建顺序调用
参数：
to：route即将要进入的目标路由对象
from：route当前导航正要离开的路由
next：function一定要调用该方法resolve这个钩子。执行效果依赖next方法的调用参数。可以控制网页的跳转
	next()：跳转下一个页面
	next(false): 中断当前的导航，返回原来页面
	next({path:'/'})：跳转到一个不同的地址，当前的导航被中断，进行一个新的导航
注意：一定要调用next(),否则钩子就不会被 resolved，页面会卡在那，一般用于对路由跳转前进行拦截

afterEach 全局后置钩子
router.afterEach((to, from) => {})
和前置守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
```

局部(组件)守卫

```js
组件中路由钩子
beforeRouteEnter(to,from,next){} 路由跳转时
注：此钩子在beforeCreate之前执行，但是next在组件mounted周期之后,无法直接调用this访问组件实例，可用next访问vm实例，修改数据

beforeRouteLeave(to,from,next){...next()} 离开路由时
注意：可以直接访问this,next不可回调

beforeRouteUpdate 路由切换时
```

#### 5.4 动态渲染路由 addRoutes

```js
addRoutes
用于动态添加路由

常用场景：页面级权限控制，服务端存储路由对象，登录后页面加载时根据不同权限动态渲染路由
```

### 6. Vue 计算属性

#### 6.1 为什么使用计算属性(优点)

```js
模板中放入太多的逻辑会让模板过重且难以维护，在需要对数据进行复杂处理，且可能多次使用的情况下，尽量采取计算属性的方式
优点：
1. 使得数据处理结构清晰
2. 依赖于数据，数据更新，处理结果自动更新
3. 计算属性内部this指向vm实例
4. 在template调用时，直接写计算属性名即可
5. methods不管依赖的数据变不变，都会重新计算，computed依赖数据不变时缓存中获取，不会重新计算
```

### 7. Vuex

#### 7.1 简述

```js
vue中状态管理器，实现组件间的数据共享
通过状态（数据源）集中管理驱动组件的变化，应用级的状态集中放在store中； 改变状态的方式是提交mutations，这是个同步的事物； 异步逻辑应该封装在action中
在main.js引入store，注入。新建了一个目录store，... export
```

### 8. 浅谈 keep-alive

```js
keep-alive是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染，相当于强缓存
vue 2.1.0 版本之后，keep-alive新加入了两个属性: include(包含的组件缓存) 与 exclude(排除的组件不缓存，优先级大于include)

```

示例：

```html
<keep-alive include="include_components" exclude="exclude_components">
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>

<keep-alive
  ><router-view v-if="”$route.meta.keepAlive”"></router-view
></keep-alive>
<router-view v-if="”$route.meta.keepAlive”"></router-view>
```

参数：

```js
include - 字符串或正则表达式，只有名称匹配的组件会被缓存
exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要使用v-bind
```

示例：

```html
<!-- 逗号分隔字符串，只有组件a与b被缓存。 -->
<keep-alive include="a,b">
  <component></component>
</keep-alive>

<!-- 正则表达式 (需要使用 v-bind，符合匹配规则的都会被缓存) -->
<keep-alive :include="/a|b/">
  <component></component>
</keep-alive>

<!-- Array (需要使用 v-bind，被包含的都会被缓存) -->
<keep-alive :include="['a', 'b']">
  <component></component>
</keep-alive>
```

### 9. Vue 自定义指令

```js
vue.directive,可以写在组件内部，也可以写在外部作为全局的使用
它的钩子有bind，inserted，update等
```

### 10. Vue 两大核心是什么

```js
1. 数据驱动
2. 组件系统
```

### 11. \$route 和\$router 的区别

```js
$route是<路由信息对象>，包括path，params，hash，query，fullPath，matched，name等路由信息参数

$router是<路由实例>对象包括了路由的跳转方法，钩子函数等
```

### 12. Vue 常用修饰符

```js
.prevent: 提交事件不再重载页面
.stop   : 阻止单击事件冒泡
.self   : 当事件发生在该元素本身而不是子元素的时候会触发
.capture: 事件侦听，事件发生的时候会调用
```

### 13. Vue 中 v-on 怎样绑定多个事件

```js
方法名后加 () => 调用方法 多个方法用 ; 隔开
例：
<div @click="one();two();three()"></div>
```

### 14. vue 中 key 值的作用

```js
当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。key的作用主要是为了高效的更新虚拟DOM

简单来说：为了避免重复渲染，高效更新渲染DOM
```

### 15. Vue 中 css 怎样只在当前组件起作用

```html
style标签中写入scoped即可 例如：<style scoped></style>
```

### 16. v-if 和 v-show 区别

```js
v-if按照条件是否渲染，如果为false不会渲染

v-show是相当于display的block或none，为false是还是会渲染，只不过隐藏了
```

### 17. 为什么避免 v-if 和 v-for 用在一起

```js
vue处理指令时，v-for比v-if具有更高的优先级，通过v-if移动到容器的元素，不会在重复遍历列表中的每个值，取而代之的是，我们只检查它一次，且不会v-if为否的时候运算v-for
```

### 18. 单页面(SPA)和多页面的区别(优缺点)

```js
单页面：
整个项目中只有一个完整的HTML页面，其它"页面"只是一段HTML片断而已
优: 请求少
缺: 不利于搜索引擎优化，首次加载时间长
页面跳转本质：把当前DOM树中某个DIV删除，下载并挂载另一个div片断

多页面：
项目中有多个独立的完整的HTML页面
缺: 请求次数多，效率低
页面跳转本质: 删除旧的DOM树，重新下载新的DOM树
```

### 19. Vue 的优缺点是什么

```js
优点：低耦合，可重用性，独立开发，可测试，渐进式

缺点：不利于SEO，社区维护力度不强，相比还不够成熟
```

### 20. vue 和 react 区别

```js
相同点：
都鼓励组件化，都有props的概念，都有自己的构建工具，React与Vue只有框架的骨架，其他的功能如路由、状态管理等是框架分离的组件

不同点：
React：单向数据流，语法—JSX，在React中你需要使用setState()方法去更新状态
Vue：双向数据流，语法--HTML，state对象并不是必须的，数据由data属性在Vue对象中进行管理。适用于小型应用，对于大型应用而言不太适合
```
