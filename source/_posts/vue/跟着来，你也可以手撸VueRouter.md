---
title: 跟着来，你也可以手写VueRouter
tags: [Vue, VueRouter, 源码]
categories: Vue相关
index_img: https://gitee.com/IsboyJC/PictureBed/raw/master/other/vue01.jpg
date: 2021-08-02 18:00:00
---


## 写在前面

VueRouter，无疑是每个 Vue 开发者时时刻刻都在使用的东西了，但对于它的源码，你了解多少呢？

相信大部分前端说起路由，都可以说出其核心有 `hash` 和 `history` 两种模式，`hash` 模式通过监听 `hashchange` 事件实现，`history` 模式通过监听 `popstate` 事件再使用 `pushstate` 修改 URL 来实现，你以为这就懂了？还是说你真的以为懂这些就算接触到 VueRouter 精髓了？No，far from it！！！

其实我和大多数人一样，之前根本没把 VueRouter 放在心上，认为这是一个很简单的东西。但当我开始读 VueRouter 源码时，并不是像我想的那样容易。VueRouter源码的整体架构其实很简单，但想读懂细节还是有难度的，各种谜一样的函数分离以及一些细节实现都让我想当无语，于是我就边读源码边照虎画猫，想通过这种方式深度学习，没成想直接淦了两个大夜才到预期目标。



## 本文重点

话不多说，我们看下读完这篇文章你可以学到什么？

介绍了关于 Router 的一些常识，并手写了一个精简版的 VueRouter（大部分核心特性），和绝大多数手写文章不同的是，这里的代码是完全以源码为标准一步一步实现的，包括整体架构、API等等都是一致的，跟着此文来一遍，除了能彻底搞懂核心源码之外，后期想看源码细节可无缝接入，看起真正的源码可以毫不夸张的说：纵享丝滑！



## 阅前提示

本文基于最新最稳定的 VueRouter V3.5.2 版本，4.0+ 还是 next，所以不在本文讨论范围之内。

源码文章很枯燥也没有多少人看是因为难理解以及没有实践乐趣，So，建议拿出编辑器跟着手敲比较快乐。

关于本文对 VueRouter 的手写实现，主要包括：

- hash/history模式路由
- 嵌套路由
- router-view/router-link组件
- $router/$route
- push/replace/go/back等方法
- addRoute/addRoutes/getRouters
- router hook

没实现的部分，也会做大致介绍，并且我将一份刚 clone 下来的源码做好了注释，放到了手写源码项目的目录里（文末链接），大家手写完觉得不过瘾想磕细节就可以直接去看源码了，一套组合拳，不错，come on～

开始前，大家可以简单看下整个 VueRouter 对应的三个流程图解，看不懂也关系，有个大致印象即可，文末还会有此图。

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210725173152169.png)



## 前端路由实现原理

前端路由，指由前端监听 URL 改变从而控制页面中组件渲染做到无刷新式页面跳转，用户虽感觉是一组不同的页面，但其实都在一个页面内。想要实现前端路由，我们需要考虑两个点：

- URL 改变但页面不刷新？
- 监测 URL 改变？

接下来我们分别看看 Hash 和 History 这两种模式是怎么解决的。



### Hash路由简单实现

Hash 模式其实就是通过改变 URL 中 # 号后面的 hash 值来切换路由，因为在 URL 中 hash 值的改变并不会引起页面刷新，再通过 hashchange 事件来监听 hash 的改变从而控制页面组件渲染，看一个小例子：

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <a href="#/home">home</a>
  <a href="#/about">about</a>
  <!-- 渲染路由模块 -->
  <div id="view"></div>
</body>
<script>
  let view = document.querySelector("#view")

  let cb = () => {
    let hash = location.hash || "#/home";

  }
  window.addEventListener("hashchange", cb)
  window.addEventListener("load", cb)
</script>
</html>
```

如上，通过两个 a 标签来改变路由 hash 值，相当于 `router-link` 组件，页面中 `id=view` 的 div 我们可以把它理解为 `router-view` 组件，页面加载完毕先执行一下 cb 函数为 hash 和路由模块进行初始化赋值，点击 a 标签路由改变后，会被 hashchange 监听到从而触发路由模块更新。



### History路由简单实现

还有一种不带 # 号的方式，那就是 history，它提供了 pushState 和 replaceState 两个方法，使用这两个方法可以改变 URL 的路径还不会引起页面刷新，同时它也提供了一个 popstate 事件来监控路由改变，但是 popstate 事件并不像 hashchange 那样改变了就会触发。

- 通过浏览器前进后退时改变了 URL 会触发 popstate 事件
- js 调用 historyAPI 的 back、go、forward 等方法可以触发该事件

来看它怎么实现路由监听：

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <a href='/home'>home</a>
  <a href='/about'>about</a>
  <!-- 渲染路由模块 -->
  <div id="view"></div>
</body>
<script>
  let view = document.querySelector("#view")

  // 路由跳转
  function push(path = "/home"){
    window.history.pushState(null, '', path)
    update()
  }
  // 更新路由模块视图
  function update(){
    view.innerHTML = location.pathname
  }

  window.addEventListener('popstate', ()=>{
    update()
  })
  window.addEventListener('load', ()=>{
    let links = document.querySelectorAll('a[href]')
    links.forEach(el => el.addEventListener('click', (e) => {
      // 阻止a标签默认行为
      e.preventDefault()
      push(el.getAttribute('href'))
    }))
    push()
  })
</script>
</html>

```

如上，a 标签为 `router-link` 组件，div 为 `router-view` 组件。

由于 popstate 事件只能监听浏览器前进回退和使用 history 前进后退 API，所以除了在事件监听中要做更新操作，还要在跳转时手动做路由模块更新。

这样就可以做到和 hash 一样的效果了，同时由于 a 标签存在默认点击跳转行为，所以我们阻止了此行为。同时我们可以直接在浏览器中改变URL刷新，但在这个例子是不支持的，因为这就需要后端来配合了。

上面就是 hash模式和 history 模式的精简原理了，知道这些基础我们就可以开始写 VueRouter 了



## 从使用分析VueRouter

手写 VueRouter 之前，我们要从它的使用层面分析，看它都有什么，先回顾一下它的使用：

- 路由配置文件中引入 VueRouter 并作为一个插件 use 一下
- 路由配置文件中配置路由对象生成路由实例并导出
- 将配置文件导出的 router 实例挂载到 Vue 的根实例上

整个步骤如下所示：

```js
// router/index.js
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component,
  },
  {
    path: "/about",
    name: "About",
    component,
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

在项目 main.js 文件中：

```js
// main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```

可看出，VueRouter 作为一个类可以被实例化同时它也作为一个 Vue 插件被加载。

实例化好理解，但是为什么要加载插件呢？

我们在使用 VueRouter 时，经常会使用到 `router-link` 和 `router-view` 两个组件，这两个组件我们没有发现哪里引入了，有没有想过为什么可以全局使用？其实就是在 VueRouter 作为插件初始化时全局注册的。

在使用过程中，我们可以使用 `this.$router` 获取路由实例，同时实例上还会有一些像 `push/go/back` 等方法，还可以通过 `this.$route` 来获取一个只读的路由对象，其中包括我们当前的路由以及一些参数等。



## 手写前的准备

### 项目搭建

创建一个 Vue 项目，使用终端输入下面命令构建一个 Vue 项目：

```bash
vue create hello-vue-router
```

注意构建时选上 VueRouter 哦！

构建完成直接 `yarn serve` 跑起来，如下，一个非常熟悉的界面：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210720011259726.png)

接着我们在 `src/` 下新建一个文件夹 `hello-vue-router/` ，此文件夹下就放我们自己写的 VueRouter 代码。

先新建一个 `index.js` 文件，导出一个空 VueRouter 类：

```js
/*
 * @path: src/hello-vue-router/index.js
 * @Description: 入口文件 VueRouter类
 */

export default class VueRouter(){
  constructor(options){}
}
```

然后来到路由配置文件 `src/router/index.js` ，将引入的 VueRouter 换成我们自己的，并将路由模式改为 hash，因为我们要先实现 hash 模式，如下：

```js
import Vue from 'vue'
import VueRouter from '@/hello-vue-router/index'
// import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [...]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
```

那现在页面就变成了空白，并且控制台报着下面的错：

```bash
Cannot call a class as a function
```

控制台的错误说不能将 class 作为函数调用！！！

诶，哪里讲 class 作为函数调用了？

其实是 `Vue.use(VueRouter)` 这，说到这，我们就不得不介绍下这个 Vue 安装插件的 API 了



### Vue.use()源码解析

如下，其实说白了，这个方法接收一个类型为函数或对象的参数。如果参数是对象，那它就必须有一个 install 属性方法。不论参数是函数还是对象，在执行 install 方法或者函数本身的时候都会把构造函数 Vue 作为第一个参数传进去。

这样我们在写插件时，写一个函数或者一个有 install 函数属性的对象，都可以接收到构造函数 Vue，也就可以使用它来做一些事情了，很 easy 吧！

```js
Vue.use = function (plugin: Function | Object) {
  // installedPlugins为已安装插件列表，若 Vue 构造函数不存在_installedPlugins属性，初始化
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  // 判断当前插件是否在已安装插件列表，存在直接返回，避免重复安装
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

	// toArray方法将Use方法的参数转为数组并删除了第一个参数（第一个参数就是我们的插件）
  const args = toArray(arguments, 1)
  // use是构造函数Vue的静态方法，那这里的this就是构造函数Vue本身
  // 把this即构造函数Vue放到参数数组args的第一项
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    // 传入参数存在install属性且为函数
    // 将构造函数Vue和剩余参数组成的args数组作为参数传入install方法，将其this指向插件对象并执行install方法
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    // 传入参数是个函数
    // 将构造函数Vue和剩余参数组成的args数组作为参数传入插件函数并执行
    plugin.apply(null, args)
  }
  // 像已安装插件列表中push当前插件
  installedPlugins.push(plugin)
  return this
}
```





## 初步构建install方法

接下来开始手写代码了！既然知道 Vue 如何加载插件，那就容易了，因为我们导出的是一个 VueRouter 类，也是一个对象，所以为其添加一个 install 方法就行。

稍微改变下 `index.js` ，为 VueRouter 类添加静态方法 install：

```JS
/*
 * @path: src/hello-vue-router/index.js
 * @Description: 入口文件 VueRouter类
 */
import { install } from "./install";

export default class VueRouter(){
  constructor(options){}
}
VueRouter.install = install;
```

接着在 `src/hello-vue-router/` 目录下创建一个 `instal.js` ，导出一个 install 方法，我们看过 `Vue.use()` 方法源码了那肯定晓得这个方法的第一个参数是构造函数 Vue，如下：

```js
/*
 * @path: src/hello-vue-router/install.js
 * @Description: 插件安装方法install
 */
export function install(Vue){}
```

上面也分析过，插件安装时 install 方法会在 Vue 全局挂载两个组件，`router-view` 和 `router-link` 。

要知道，我们在 router 的配置文件中只做了初始化 VueRouter 插件和生成 VueRouter 实例 2 件事情，那我们平常在项目中直接使用的 `this.$router & this.$route` 是哪来的呢？

首先 `$router` 是 VueRouter 的实例对象，`$route` 是当前路由对象，`$route` 其实也是 `$router` 的一个属性，这两个对象在 Vue 所有的组件中都可以使用。

可能有小伙伴还记得在项目的入口文件 `main.js` 中，我们把导出的 router 实例挂载到了 Vue 根实例上，如下：

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
```

但问题又来了，我们只是挂载到了根实例上，并没有每个组件都挂，况且直接在 Vue 实例上挂载的对象，Vue 都会给我们放到当前实例的 `$options` 属性上，结合我们只挂载到了根实例上，那我们想要访问 router 实例对象只能采取 `this.$root.$options.router` 来获取，这里 `this.$root` 获取到的即根实例。

显然，外部并不是这样调用的。

所以，`$router & $route` 这两个属性只可能是在 VueRouter 组件内挂载的，并且还需要在 Vue 项目开发过程中能让所有组件都使用。

细品，VueRouter 组件里怎么获取它的实例对象（在这个类里怎么拿到new VueRouter对象）？

可能有小伙伴想到了，这个 router 实例在 Vue 根实例挂载了啊，没错，就是在 new Vue 的时候传入的那个 router 。想办法拿就可以了，怎么拿呢？

上面也说了，我们可以先获取到 Vue 根实例，接着可以用 `$options.router` 来获取实例上挂载的 router 属性，也就是说目前考虑的是如何在 VueRouter 中拿到 Vue 组件实例（有组件实例就可以拿到根组件实例从而访问它的 `$options` 属性）

诶，好像又想到了， VueRouter 的 install 方法会传进来一个 Vue 构造函数，它能搞事情吗？

构造函数就是构造函数，它当然不是实例，但是构造函数 Vue 有 `mixin` 方法啊，没错就是 `混入` 

> **小** **Tips：Vue.mixin**
>
> 估摸着很多人都知道这个方法，但还是有必要介绍一下。
>
> 混入分为全局混入和组件混入，我们直接使用构造函数 Vue.mixin 这种是全局混入，它接收一个对象参数，在这个对象参数里，我们可以写任何 Vue 组件里的东西，然后我们写的这堆东西会被混入（也可以理解为合并）到 Vue 每一个组件上。
>
> 比如写一个生命周期，里面写了个逻辑，那么在所有的 Vue 组件中这个生命周期开始前都会先执行我们混入的逻辑。还不懂？再比如，我们写了个 `methods` ，里面写了个函数，那这个函数会被混入到所有的 Vue 组件的 `methods` 中，所有组件都可直接调用。

Vue.mixin 可以直接写组件那套，这就简单了，写一个生命周期全局混入到组件就 OK 了。

那么问题又又来了，在哪个生命周期里写呢？其实也简单，只要看在哪个生命周期 `$options` 可以构建好就行了，`beforeCreate` 这个周期 `$options` 就构建好了，也就是在这个生命周期后都可以使用 `$options`，还用问吗？肯定越早越好，就是 `beforeCreate` 这个生命周期了。

再捋一遍，install 方法可以传过来一个参数构造函数 Vue，使用构造函数 Vue 的静态方法 mixin 为我们所有组件的 `beforeCreate` 生命周期混入一段逻辑，这段逻辑就是为其挂载上 `$router & $route` 属性

根据我们上面的逻辑，先上完整代码再逐步解释：

```js
/*
 * @path: src/hello-vue-router/install.js
 * @Description: 插件安装方法install
 */

export let _Vue;

export function install(Vue){
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._route = {};
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    },
  });

  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });
  
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('RouterView', {});
  Vue.component('RouterLink', {});  
}
```

来逐块解释：

```js
export _Vue;

export function install(Vue){
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;
}
```

诶？ install 文件中不止导出了一个 install 方法，还导出了一个 _Vue 变量，它是什么？

在初始化插件的时候会执行 install 方法，在此方法里会把行参也就是 Vue 的构造函数赋值给变量 _Vue 并导出，其实这个 _Vue 它有两个作用：

第一就是通过它防止插件多次注册安装，因为插件安装方法 install 里我们给此方法添加了一个 installed 属性，当此属性存在且为 true 且 _Vue 已被赋值为构造函数 Vue 时 return，代表已经注册过该插件，无需重复注册。

第二个作用就是构造函数 Vue 上面挂载了很多实用 API 可供我们在 VueRouter 类里使用，当然也可以通过引入 Vue 来使用它的 API，但是一旦引入包使用，打包的时候也会将整个 Vue 打包进去，即然 install 里会把这个构造函数作为参数传过来，恰巧我们写 router 配置文件时，安装插件（Vue.use）是写在初始化 VueRouter 实例前面的，也就是 install 执行较早，这个时候我们把构造函数参数赋值给一个变量在 VueRouter 类里使用简直完美，还不理解就看图 ⬇️

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210721134755896.png)

接着来看混入这块，其实说白了就是挂载 `$router & $route` ：

```js
export function install(Vue){  
  // 全局注册混入，每个 Vue 实例都会被影响
  Vue.mixin({
    // Vue创建前钩子，此生命周期$options已挂载完成
    beforeCreate() {
      // 通过判断组件实例this.$options有无router属性来判断是否为根实例
      // 只有根实例初始化时我们挂载了VueRouter实例router（main.js中New Vue({router})时）
      if (this.$options.router) {
        this._routerRoot = this;
        // 在 Vue 根实例添加 _router 属性（ VueRouter 实例）
        this._router = this.$options.router;
        this._route = {};
      } else {
        // 为每个组件实例定义_routerRoot，回溯查找_routerRoot
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    },
  });

  // 在 Vue 原型上添加 $router 属性( VueRouter )并代理到 this._routerRoot._router
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });
  
  // 在 Vue 原型上添加 $route 属性( 当前路由对象 )并代理到 this._routerRoot._route
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });
}
```

我们看看都做了什么：

首先写一个mixin，全局注册混入，让每个 Vue 实例都会被影响。混入里写一个 beforeCreate 钩子，因为此生命周期 $options 最早挂载完成。又因全局混入，所以 beforeCreate 钩子里我们写了一个通过组件实例中的 this.$​options 有无 router 属性来判断是否为根实例，只有根实例初始化时才挂载 VueRouter 实例 router（就是 main.js 中 New Vue({router}) 时）。

> **是根实例：**
>
> 是根实例就为其添加 _router 属性，值为 VueRouter 实例，同时添加一个 _routerRoot 属性将 this 也就是根实例也挂载上去
>
> 上面分析过，这里还应有 route 对象，所以最后还为其添加了 _route 属性，暂且将它设置成空对象，后面再完善
>
> **不是根实例：**
>
> 不是根实例，那就是子组件实例了，找它的父实例判断其父实例有没有 _routerRoot 属性，没有就为其加上引用，确保每一个组件实例都可以有 _routerRoot 属性，也就是让每个组件中都可以引用并访问到根实例，注意并不是反复赋值，对象间的引用而已

最后为了让每个组件都可以访问到 `$router $ $route` 对象，我们在 Vue 原型上添加了 $router 属性并代理到 `this._routerRoot._router`，也在 Vue 原型上添加了 `$route` 属性并代理到 `this._routerRoot._route`，剩下就是创建全局组件了：

```js
// 全局注册组件router-view
Vue.component('RouterView', {});
// 全局注册组件router-link
Vue.component('RouterLink', {}); 
```

这块暂时比较简单，使用 Vue.component 全局注册了两个组件，配置对象都直接为空。下面简单的配置一下这两个全局组件，让项目跑起来，毕竟现在运行还在报错。



## 初步构建RouterView、RouterLink组件

稍微分离一下，我们在 `src/hello-vue-router/` 目录下新建一个 `components/` 文件夹

在 `components` 文件夹下新建 `view.js` 和 `link.js` 两个文件，随后还是要先改变一下 install 方法：

```js
/*
 * @path: src/hello-vue-router/install.js
 * @Description: 插件安装方法install
 */
import View from "./components/view";
import Link from "./components/link";

export function install(Vue){
  // 全局注册组件router-view
  Vue.component('RouterView', view);

  // 全局注册组件router-link
  Vue.component('RouterLink', link);  
}
```

可以看到我们把两个组件的配置对象单独拉出去了两个文件来写，其实就是每个文件导出一个组件配置对象。

先看 `link.js` ，link 组件类似 a 标签，其实它默认就会渲染一个 a 标签，组件接收一个 to 参数，可以为对象，也可以为字符串，用作跳转。

```html
<router-link to="/home">
<router-link :to="{path: '/home'}">
```

看实现：

```js
/*
 * @path: src/hello-vue-router/components/link.js
 * @Description: router-link
 */
export default {
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      require: true
    }
  },
  render(h) {
    const href = typeof this.to === 'string' ? this.to : this.to.path
    const router = this.$router
    let data = {
      attrs: {
        href: router.mode === "hash" ? "#" + href : href
      }
    };
    return h("a", data, this.$slots.default)
  }
}
```

首先是 props 接收参数 to，必选项，可为对象或字符串类型，在 render 函数中首先判断了参数 to 的类型，并把它统一做成了对象。

接着访问了根实例中的 `$router`，这里的 this 其实是一个 Proxy，输出一下就会知道，这个 Proxy 代理到了 VueComponent 实例，而我们在 install 给每个组件实例都加上了指向根实例的属性 _routerRoot，这里其实想要访问 router 对象有好多种。

```js
// this._self._routerRoot._router
// this._routerRoot._router
// this.$router
```

> 用啥都可以，但是源码用的第三种，我们也就用这个了，可能是字符最少

接着就是返回一个 VNode 了，其实 render 的 h 参数就是 createElement 函数，作用就是创建一个 VNode，它的参数看官网描述：

```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

这里我们想要返回一个 a 标签，所以第一个参数就是字符串 a，第二个参数就是标签 attribute 对应的数据对象，要给他带上 href 属性，属性值就是 to 参数，需要注意的是模式问题，hash 模式下要给所有的跳转路径前加上一个 # 号，所以需要 `router.mode` 判断一下模式，第三个参数就是子节点了，也就是 `router-link` 组件中包含的值，其实使用默认插槽即可拿到， `this.$slots.default` 获取默认插槽。

OK，到这 `router-link` 组件就差不多完成了，只是在 history 模式下还有问题，我们后面再说。

再来看 `view.js` ，其实我们并不需要 RouterView 组件渲染什么东西，它充其量就是一个占位符，用来替换我们的组件模块UI，所以一不需要生命周期，二不需要状态管理，三不需要各种监听，通俗点就是没必要创造一个实例，作为一个三无组件，函数式组件最符合了。

```js
/*
 * @path: src/hello-vue-router/components/view.js
 * @Description: router-view
 */
export default {
  name: "RouterView",
  functional: true, // 函数式组件
  render(h) {
    return h('div', 'This is RoutePage')
  }
}
```

如上，直接先设置成函数式组件，然后 render 函数直接返回一个 div，内容为 `'This is RoutePage'`（h 函数即 createElement 函数没有无第二个参数可省略），这里只是初步搭建一下结构，逻辑后面再说，先让页面跑起来，现在你再打开浏览器会发现无报错了，导航也有了，还可以点击切换路由，就是路由模块组件即 `router-view` 永远都只显示 `This is RoutePage` ，如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210721024752049.png)

## 初步构建VueRouter类

install 方法我们暂时可以告一段落，思考一下 VueRouter 类里，我们需要做什么？

首先，接收到参数肯定要对参数进行一个分析，传进来的是一个对象，其中主要的就是两个属性：

- mode 路由模式
- routes 路由配置数组

其实 base 属性也比较重要，不过可以先不考虑这个，逻辑跑通后有时间再完善

思考 mode 配置，我们需要根据 mode 传入的路由模式来初始化对应模式的一些东西，从而实现对该模式下的路由监听。

那再思考一下关于 routes 数组，我们需要做什么？

其实，此数组中配置的最重要的就是路由 path 以及 path 对应的路由组件，当然还有一些重定向、动态路由、路由名称、路由别名的配置，这些也都暂时不考虑，后期逐步完善。

问题来了，监听到路由发生了变化我们需要做什么？

当然是拿到改变的路由 path ，在 routes 数组中找到匹配的 path 配置，获取它的组件，然后把拿到的组件渲染到对应的 `router-view` 中去。

对于 routes 配置，目的很明确了，因为这是一个树结构的数组对象，我们是基于 path 匹配的，很不方便，所以需要提前将此配置解析为 `{key : value}` 这种结构，当然 key 就是我们的 path ，而 value 则是此路由的配置项。分析完毕，开始敲代码：

```js
/*
 * @path: src/hello-vue-router/index.js
 * @Description: 入口文件 VueRouter类
 */
import { install } from "./install";
import { createMatcher } from "./create-matcher";
import { HashHistory } from "./history/hash";
import { HTML5History } from "./history/html5";
import { AbstractHistory } from "./history/abstract";
const inBrowser = typeof window !== "undefined";

export default class VueRouter(){
  constructor(options) {
    // 路由配置
    this.options = options;
    // 创建路由matcher对象，传入routes路由配置列表及VueRouter实例，主要负责url匹配
    this.matcher = createMatcher(options.routes);

    let mode = options.mode || "hash";

    // 支持所有 JavaScript 运行环境，非浏览器环境强制使用abstract模式，主要用于SSR
    if (!inBrowser) {
      mode = "abstract";
    }

    this.mode = mode;

    // 根据不同mode，实例化不同history实例
    switch (mode) {
      case "history":
        this.history = new HTML5History(this);
        break;
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "abstract":
        this.history = new AbstractHistory(this);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          throw new Error(`[vue-router] invalid mode: ${mode}`);
        }
    }
  }
}
VueRouter.install = install;
```

其实 VueRouter 这个类的 constructor 里的逻辑很简单，就是判断传入的 mode 模式随后初始化不同类实例，虽然实例化的是不同的类，但实例方法包括属性等都是一样的

完整的 VueRouter 有三种模式：

- hash 基本浏览器都支持，但是URL有 # 号，不好看
- history URL好看，但是部分老版本浏览器不支持
- abstract 支持所有环境，主要用于服务端 SSR

我们不太清楚的可能是 abstract 模式了，其实在官方中把这种模式定义为支持任何环境的模式，因为这种模式是手动模拟一个路由环境，而源码中也有一个和上面一样的逻辑判断（`inBrowser`），就是在当前环境没有 window 对象也就是非浏览器环境情况下，直接强制切换为此模式，所以这种模式也主要用于 SSR，后面有精力就实现一下，相当简单。

整个 constructor 其实没有复杂逻辑。先判断当前环境有无 window 对象也就是否是浏览器环境，是的话继续走，不是则强制 mode 值为 abstract；然后就是判断一下 mode 属性值，匹配三个模式分别使用对应类来初始化该路由模式实例，匹配不到直接抛出错误，这里不论是哪个模式，在对应的类中我们都会实现一些相同的方法，并且将初始化的实例挂载到了 VueRouter 实例的 hisory 属性上。

其实在做 mode 参数校验前，还引入了一个 createMatcher 方法，这个方法的返回值挂载到了 VueRouter 实例的 matcher 属性上，它是做什么的呢？

你应该大致猜到了，上面也说过，大概就是构建 `{key : value}` 结构的对象（称之为 pathMap 对象）让我们更便捷的通过 path 路径匹配到对应路由模块。

那接下来我们就一步步推导下 createMatcher 这个方法是怎么封装的。



## createMatcher方法推导

你以为 createMatcher 这个方法只是单纯的构建一个 pathMap 映射对象？No，那样的话函数名应该叫 createRouterMap 才对，其实最开始确实是这个名字，但是一套推导下来发现它不仅可以构建出 pathMap 映射对象， `addRoutes/addRoute/getRoutes` 这几个方法也可以在这里实现。

构建出 pathMap 映射对象是做什么的？路由匹配啊！输入 path 的时候能够获取到对应的路由配置信息，pathMap 对象就相当于一个路由数据管家，写入的所有路由配置都在这里了，那动态添加路由的时候把新路由对象解析并添加到 pathMap 对象里就可以了，所以我们把路由匹配及动态路由添加的几个方法全放一块合成了 createMatcher 函数，我们叫它 `路由匹配器函数` 吧，主要作用就是生成一个路由匹配器对象，这个函数就返回了一个包含四个方法属性的对象：

- macth 路由匹配
- addRoutes 动态添加路由（参数必须是一个符合 `routes` 选项要求的数组）
- addRoute 动态添加路由（添加一条新路由规则）
- getRoutes 获取所有活跃的路由记录列表



### createRouteMap生成路由映射

首先我们要构建 pathMap 对象，单独拉出来一个文件写这个方法，在 `src/hello-vue-router/` 目录下新建一个 `create-route-map.js` 文件：

```js
/*
 * @path: src/hello-vue-router/create-route-map.js
 * @Description: 生成路由映射
 */
// 生成路由映射
export function createRouteMap(routes){
  let routeMap = {}
  routes.forEach(route => {
    routeMap[route.path] = route
  })
  return routeMap
}
```

如上，几行代码就生成了一个 pathMap 路由映射对象，有问题吗？没有问题，但我们上面只匹配了一层，路由配置里面可以有无限层子路由，比如下面这样的配置：

```js
const routes = [
  {
    path: "/about",
    name: "About",
    component,
  },
  {
    path: "/parent",
    name: "Parent",
    component,
    children:[
      {
        path: "child",
        name:"Child",
        component
      }
    ]
  }
];
```

我们想要生成的 pathMap 对象是什么，是下面这样：

```js
{
  "/about": {...},
  "/parent": {...},
  "/parent/child": {...}
}
```

可是现在的代码逻辑只生成了下面这种：

```js
{
  "/about": {...},
  "/parent": {...}
}
```

有问题吗？有大问题，一层路由是 ok 的，多层级的嵌套路由直接 gameover。所以要递归处理解析，修改一下代码，还是老套路，先看完整代码再逐步解析。

```js
export function createRouteMap(routes){
  const pathMap = Object.create(null);
  // 递归处理路由记录，最终生成路由映射
  routes.forEach(route => {
    // 生成一个RouteRecord并更新pathMap
    addRouteRecord(pathMap, route, null)
  })
  return pathMap
}

// 添加路由记录
function addRouteRecord(pathMap, route, parent){
  const { path, name } = route

  // 生成格式化后的path(子路由会拼接上父路由的path)
  const normalizedPath = normalizePath(path, parent)

  // 生成一条路由记录
  const record = {
    path: normalizedPath, // 规范化后的路径
    regex: "", // 利用path-to-regexp包生成用来匹配path的增强正则对象，用来匹配动态路由 （/a/:b）
    components: route.component, // 保存路由组件，省略了命名视图解析
    name,
    parent, // 父路由记录
    redirect: route.redirect, // 重定向的路由配置对象
    beforeEnter: route.beforeEnter, // 路由独享的守卫
    meta: route.meta || {}, // 元信息
    props: route.props == null ? {} : route.props// 动态路由传参
  }

  // 处理有子路由情况，递归
  if (route.children) {
    // 遍历生成子路由记录
    route.children.forEach(child => {
      addRouteRecord(pathMap, child, record)
    })
  }

  // 若pathMap中不存在当前路径，则添加pathList和pathMap
  if (!pathMap[record.path]) {
    pathMap[record.path] = record
  }
}

// 规格化路径
function normalizePath(
  path,
  parent
) {
  // 下标0为 / ，则是最外层path
  if (path[0] === '/') return path
  // 无父级，则是最外层path
  if (!parent) return path
  // 清除path中双斜杆中的一个
  return `${parent.path}/${path}`.replace(/\/\//g, '/')
}
```

其实这块代码比较简单，也都带上了注释，简单说几个点吧。

我们在递归中其实把每一个路由配置对象都格式化了一下，生成了一个新的 record 对象，该对象的的 path 其实是完整 path，也就是如果原 path 是以 `/` 开头，说明自己是顶级路由，path 就是它本身，如果原 path 不是以 `/` 开头，说明它是子级路由，那我们就需要拼接上父级 path，为此我们单独写了一个 normalizePath 函数来生成完整 path，也就是将 path 规格化。

因为递归时传入了 parent ，除了顶级路由为 null 之外，子级路由都有父级，而我们子路由递归时是在 record 对象生成之后的，所以每个传入的父级都是格式化好的 record 对象，父级的 path 也是完整 path，这样不论多少子级，都可以拼出完整 path。

接着说 record 对象，我们还为其添加了一个 parent 属性指向它的父级对象，让父子之间有个联系，还有一些路由中可配置的参数像重定向 `redirect`、路由独享守卫 `beforeEnter`、元信息 `meta`、路由名称 `name` 这些我们也都接收并放到了 record 对象里。

单独说 `regex` 属性，相信大家都知道 VueRouter 里支持动态路由，其实主要是利用一个三方包 `path-to-regexp` 生成用来匹配path 的增强正则对象，用来匹配对应的动态路由，生成正则之后就放在 `regex` 属性里，这块对我们手写来说没有特别大的意义，所以我没写，直接置空了，如果有兴趣就直接看源码这里，主要还是 `path-to-regexp` 这个包的使用，也不复杂。另外最后的 `props` 属性是动态路由传参用的，暂不做这块可忽略。

最终一套下来，生成的 pathMap 对象就是 `[{path: record}...]` 这种格式了，key 是格式化后的完整 path，value是格式化好的路由配置对象 record。

到这里路由映射对象 pathMap 对象解析方法就差不多写完了。



### createMatcher生成路由匹配器

接着，我们在 `src/hello-vue-router/` 文件夹下创建一个 `create-matcher.js` 文件，按照我们上面分析大致结构如下：

```js
/*
 * @path: src/hello-vue-router/create-route-map.js
 * @Description: 路由匹配器Matcher对象生成方法
 */
import { createRouteMap } from "./create-route-map";

export function createMatcher(routes){
  // 生成路由映射对象 pathMap
  const pathMap = createRouteMap(routes)

  // 动态添加路由（添加一条新路由规则）
  function addRoute(){ }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  function addRoutes(){ }

  // 获取所有活跃的路由记录列表
  function getRoutes(){ }

  // 路由匹配
  function match(){ }

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}
```

路由匹配器 Matcher 对象生成方法即 createMatcher ，我们只需要一个参数，那就是生成路由映射对象 pathMap 所需的 routes 数组（就是 router 配置文件里的那个 routes）。

其实路由映射对象 pathMap 只有在匹配路由和动态添加路由的时候可以用到，而这些情况都包含在 `createMatcher` 函数内，所以在 `createMatcher` 函数内部直接使用刚写好的 `createRouteMap` 方法生成了 pathMap 对象，在函数调用时，内部一直维护着这个对象，因为 `createMatcher` 函数返回的几个方法里都有对 pathMap 对象的引用，就是一个典型闭包场景，所以整个 VueRouter 实例初始化过程中 `createMatcher` 函数只需调用一次就 OK，`createRouteMap` 方法也抛出了动态修改 pathMap 的方法。



#### addRoutes核心实现

先来看 `addRoutes` 实现吧，比较简单，这个 API 的定义其实就是用来动态添加路由的，简单点就是把传入的新路由对象解析后加入到老 pathMap 对象里，使用时参数必须是一个符合 routes 选项要求的数组，作用就是可以让我们随时随地的添加几个路由配置，因为参数是数组并且和 routes 是一致的格式，所以完全可以复用 `createRouteMap` 方法。

先把 `createRouteMap` 方法简单修改一下，只需要加一个参数就 ok ，逻辑没问题。

```js
// 新增 oldPathMap 参数
export function createRouteMap(routes, oldPathMap){
  // const pathMap = Object.create(null); old
  const pathMap = oldPathMap || Object.create(null); // new
  
  // ...
}
```

如上，动态添加的时候，将旧的 pathMap 传进去即可，之前我们直接声明了一个空 pathMap 对象，这里可以判断一下 `oldPathMap` 参数是否存在，存在就给 pathMap 赋值，不存在默认还是空对象即可。这样就做到了把没有解析的配置，解析并添加到老映射对象里，是不是简单？ `addRoutes` 方法就更简单了：

```js
// 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
function addRoutes(routes){
  createRouteMap(routes, pathMap)
}
```



#### getRoutes核心实现

至于 `getRoutes` ，就更更简单了，直接返回 `pathMap` 对象即可

```js
// 获取所有活跃的路由记录列表
function getRoutes(){
  return pathMap
}
```



#### addRoute核心实现

`addRoute` 这个方法我们要稍微注意一下，因为这个方法将是未来 4.0+ 版本动态添加路由的主流，3.0+版本的 `addRoute & addRoutes` 两个方法并存，但 4.0+ 中看 `addRoutes` 方法已经被删除了，先看使用吧。

`addRoute` 有两个参数，也是 2 种用法：

- 添加一条新路由规则。如果该路由规则有 `name`，并且已经存在一个与之相同的名字，则会覆盖它。
- 添加一条新路由规则记录作为现有路由的子路由。如果该路由规则有 `name`，并且已经存在一个与之相同的名字，则会覆盖它。

白话一下。第一种就是传入一个路由配置对象，注意，不是之前的 `routes` 数组了，是只有一个路由配置的对象，当然你可以在这个路由配置下写无数个子路由，但是添加的时候只能传入一个路由对象这种形式添加，一次只追加一条记录，如果当前的路由配置中存在 `name` 相同的记录，则会覆盖掉，如下：

```js
this.$router.addRoute({
  path: "/parent",
  name: "Parent",
  component,
  children:[
    {
      path: "child"
      // ...
    },
    // ...
  ]
})
```

第二种就是两个参数，第一个参数为一个已经存在的路由 `name` ，第二个参数为一个路由配置对象，就和上那种使用方式的路由配置对象一致，只是，这种方式会把这个路由配置对象当作第一个参数 `name` 对应的路由对象的子路由追加进去，简单说就是根据路由 `name` 定向添加子路由，添加过程中有重复路由 `name` 也是覆盖掉。

看着复杂，写起来其实很简单，再为 `createRouteMap` 加一个 `parent` 参数即可。修改 `createRouteMap` 函数：

```js
// 新增 parentRoute 参数
export function createRouteMap(routes, oldPathMap, parentRoute){  
  const pathMap = oldPathMap || Object.create(null);

  routes.forEach(route => {
    // addRouteRecord(pathMap, route, null) old
    addRouteRecord(pathMap, route, parentRoute) // new
  })
  return pathMap
}
```

如上所示，第三个参数代表父级路由，需要追加到一条记录上时，只需拿到这个父级路由传入即可，没有第三个参数时默认为 `undefined` 也不会影响下面逻辑。

接下来写 `addRoute` 方法：

```js
// 动态添加路由（添加一条新路由规则）
function addRoute(parentOrRoute, route){
  const parent = (typeof parentOrRoute !== 'object') ? pathMap[parentOrRoute] : undefined
  createRouteMap([route || parentOrRoute], pathMap, parent)
}
```

如上，`addRoute` 方法第一个参数有可能是个字符串，也可能是个路由对象，而 `createRouteMap` 方法第一个参数是路由数组，所以我们调用时直接数组包裹，默认是第二个参数，第二个参数不存在拿第一个参数就是路由对象，然后传入旧的 pathMap 对象，最后的 parent 我们需要在函数开始就判断一下。

当第一个参数不是一个对象时，也就是输入的是一个路由 `name` 字符串，我们这里稍微改动一下，用路由 `path` 代替（明白意思就行），直接通过之前解析好的 pathMap 对象取出规格化路由赋值给 parent，如果是一个对象，那就肯定只有一个参数了，直接给 parent 赋值为 undefined，完美。

> 解释下为什么不像官方那样用路由 `name` 匹配，源码中除了 pathMap 对象，还解析了一个 namePath 对象，我们写的是一个简化版，这些类似的东西包括对路由名称、路由别名、重定向参数、动态路由的处理我都省略了，做一个路由 path 的处理大家理解即可，其他处理大多一致，都很简单，不过瘾可以配合我打上注释的源码自行补全，整体架构都一致，无非是多加一些代码。



#### match路由匹配核心实现

最后是路由匹配函数 `match` 方法，也很简单：

```js
// 路由匹配
function match(location){
  location = typeof location === 'string' ? { path: location } : location
  return pathMap[location.path]
}
```

`match` 方法我们给它一个参数，这个参数可以是字符串，也可以是个必须带有 path 属性的对象，因为必须要使用 path 才能匹配到配置的路由模块数据，使用如下：

```js
// String | Object

match("/home")
match({path: "/home"})
```

在函数最开始校验了一下参数类型并统一转为对象，随后直接返回了 pathMap 的 path 映射，是不是很简单？别着急，这块后续还要优化。



### createMatcher的使用及实例方法挂载

回顾一下我们在 `createMatcher` 方法中做了哪些事情，其实主要是生成了一个路由映射对象 `pathMap`，返回了四个函数：

- addRoutes
- getRoutes
- addRoute
- match

对于这几个方法，其实最后都要挂载在 VueRouter 实例上，因为使用时是 `this.$router.addRoute()` 这种方式，这里只是核心实现，后续还要在实例挂载，其中  `match` 方法后续还有优化。

所以，来看看 `createMatcher` 函数的使用和这几个实例方法的挂载，再次回到 VueRouter 类这里：

```js
export default class VueRouter(){
  constructor(options) {
    this.options = options;
    // 创建路由matcher对象，传入routes路由配置列表及VueRouter实例，主要负责url匹配
    this.matcher = createMatcher(options.routes);
    
    // ...
  }
  
  // 匹配路由
  match(location) {
    return this.matcher.match(location)
  }
  
  // 获取所有活跃的路由记录列表
  getRoutes() {
    return this.matcher.getRoutes()
  }
  
  // 动态添加路由（添加一条新路由规则）
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route)
  }
  
  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  addRoutes(routes) {
    this.matcher.addRoutes(routes)
  }
}
```

如上，我们直接在 VueRouter 类的 constructor 里调用了 `createMatcher` 函数，并将其返回值挂载到了实例的 matcher 属性上，其实这个对象就包含那四个方法，接着挂载这几个方法到实例上，不赘述了。

现在 VueRouter 实例上就有这些方法了，而 `this.$router` 在 install 中做了代理到 VueRouter 实例的操作，所以就可以使用这些方法了。



## 路由模式父类History实现

路由匹配器实现告一段落，还记得在 VueRouter 类 constructor 中除了路由匹配器，还有什么吗？没错，校验了传入的 mode 参数，并且通过判断分别为三种模式创建了一个类并实例化后统一挂载到了 VueRouter 实例的 history 属性上。

那下面我们就逐一实现这几个类，分别是 `HTML5History | HashHistory | AbstractHistory`。首先在 `src/hello-vue-router/` 文件夹下新建 `history/` 的文件夹，在这此文件夹下新建三个文件，对应三种模式构建类：

- hash.js
- html5.js
- abstract.js

接下来先给三个路由模式类定义一个父类。

思考：为什么要定义父类？

其实在初始化实例上 `this.history` 挂载的一些方法都是一致的，虽然实现方式上几种模式可能不太一致，但不能给用户增加负担，所以使用要统一，为了节省代码以及统一，我们可以定义一个父类，让三个子类都继承这个父类。

So，在刚刚新建子类的 `history/` 文件夹下，新建一个 `base.js` 文件并导出一个 History 类：

```js
/*
 * @path: src/hello-vue-router/history/base.js
 * @Description: 路由模式父类
 */

export class History {
  constructor(router) {
    this.router = router;
    // 当前路由route对象
    this.current = {};
    // 路由监听器数组，存放路由监听销毁方法
    this.listeners = [];
  }
  
  // 启动路由监听
  setupListeners() { }

  // 路由跳转
  transitionTo(location) { }

  // 卸载
  teardown() {
    this.listeners.forEach((cleanupListener) => {
      cleanupListener();
    });

    this.listeners = [];
    this.current = "";
  }
}
```

如上，History 类 constructor 中主要做了三件事：

- 保存传入的路由实例 router
- 声明了一个当前路由对象 current
- 声明了一个路由监听器数组，存放路由监听销毁方法

然后写了几个公共方法：

- setupListeners 启动路由监听的方法
- transitionTo 路由跳转的方法
- teardown 卸载 VueRouter 实例时卸载路由模式类中的监听并清空数据方法

> 暂时写了这 3 个方法，其实 `setupListeners` 方法这里只是声明一下，主要逻辑还会在子类中复写， 然后这里只把 `teardown` 这个卸载的方法完善了，`transitionTo` 这个路由跳转方法以及后面实现子类过程中需要添加的一些公共方法后续慢慢完善

先看这个销毁方法，思考为什么要销毁？

其实不论是 hash 或 history 这两种模式在实现过程中肯定都会写一些监听，而当 VueRouter 实例卸载的时候，这些监听并不会被销毁，就会造成内存泄漏，所以我们手动写一个卸载销毁，代码十分简单

首先是维护了一个公共的路由监听器数组 `listeners` ，将来在子类中每写一个监听事件，直接就写一个卸载监听方法 `push` 到这个数组中来，当监听到 VueRouter 卸载时，手动调用卸载方法，方法里就是循环调用一下 `listeners` 数组中的方法从而销毁监听，可以看到卸载方法的最后把 `listeners` 数组以及当前路由对象 `current` 都清空了。

保存的 router 实例对象后面会用到，可能大家不了解的应该是 `current` 这个对象吧，接下来着重介绍。



**思考：我们怎么获取当前的路由对象？**

答：`$route`

**思考：路由对象应该在哪里维护？有什么作用？**

先回顾下使用 `$route` 时，它都有什么属性？

其实它保存着当前路由的 `path、hash、meta、query、params` 等等一切与当前路由有关的东西其实都在这里存着，并且官方定义这个路由对象是只读的

而 `current` ，就是当前的意思，它其实就是这个路由对象，每当我们监听到路由 path 改变时，就要同步去修改这个路由对象，而当路由对象改变，`router-view` 组件需要渲染的视图也要改变，可以说这个路由对象就是整个 VueRouter 的中枢。

可能大家要问，刚刚不是说过这个对象是只读的吗？怎么还会改变？其实路由对象本身是被冻结的，我们只读的是对象中的属性，但是我们可以切换整个路由对象啊！

上面我们为 `current` 这个路由对象定义的初始值是空对象，其实因为路由对象是一个面向用户、具有固定格式的对象，所以应该由一个统一的方法来创建这个固定格式的路由对象，此方法我们叫它 `createRoute`。



## createRoute方法

还是单拿出来一个文件来实现这样一个方法。

在 `src/hello-vue-router/` 目录下新建一个 `utils/` 文件夹，在该文件夹下新建一个 `route.js` 文件，实现并导出一个 `createRoute` 方法。

先新建好文件，说 `createRoute` 方法之前，我们思考一下什么时候需要创建这个路由对象？

首先当然是我们的 `current` 属性初始化的时候需要创建一个空的路由对象，除此之外呢？

捋一下，要让 path 路径改变，有两种方式，一是直接改 URL，二是用 `push` 方法。

```js
// No.1 oldURL => newURL
let oldURL = "http://localhost:8081/#/about"
let newURL = "http://localhost:8081/#/home?a=1"

// No.2
this.$router.push({
  path: "/home",
  query: {a: 1}
})
```

可以看到，在改变路由时，可附带很多属性，就像官方文档中 `push` 方法支持的属性就有下面这些，具体作用看文档：

```js
name
path
hash
query
params
append
replace
```

路径改变，要去往一个新的 path，新的 path 加上这些可以携带的属性我们称之为 目标信息对象。而当前路由对象 route 要包含当前路由的所有信息，path 匹配的路由配置对象+目标信息信息对象=所有信息，所有信息格式化后就是当前路由对象 route。

所以更新当前路由对象就需要先通过 path 匹配到路由配置对象，然后路由配置对象和目标信息信息对象合并格式化为 route。在哪里做这样一个更新操作呢？

回顾下之前我们写的 `createMatcher` 函数，其中返回了一个 match 方法，如下：

```js
// 路由匹配
function match(location){
  location = typeof location === 'string' ? { path: location } : location
  return pathMap[location.path]
}
```

这里我们当时返回的是路由配置对象，其实我们的最终目的就是让其匹配到当前路由对象，我们也分析了当前路由对象=路由配置对象+目标信息对象，所以直接匹配到路由对象的话就是最完整的数据，现在改写这个方法：

```js
/*
 * @path: src/hello-vue-router/create-route-map.js
 * @Description: 路由匹配器Matcher对象生成方法
 */
import { createRouteMap } from "./create-route-map";
// 导入route对象创建方法
import { createRoute } from "./utils/route"

export function createMatcher(routes){
  const pathMap = createRouteMap(routes)
  
  // 路由匹配
  function match(location){
    location = typeof location === 'string' ? { path: location } : location
    return createRoute(pathMap[location.path], location) // 修改
  }
  
  // ...
}
```

如上，在 `createMatcher` 函数返回的 `match` 方法中，直接创建一个新路由对象返回。分析到这里我们就可以确定 `createRoute` 函数的参数了，就如同上面 `createRoute` 方法里有 2 个参数，第一个就是路由匹配对象 record，第二个就是目标信息对象 location（这也是为什么我们给 match 方法的参数起名为 location 并允许它有对象和字符串两种格式的原因）。

我们经常使用的 `push` 方法其实其中的参数就是 location 对象，既可以是字符串路径，也可以是对象，为对象时可传入的属性就和上面 push 方法可配置的那些属性是一致的

不过上面写的属性中 `append、replace` 是两个是附加功能，需要额外解析， `push` 方法支持，`router-link` 组件同样支持，作用看下面文档，我们暂时省略这两个参数的解析，因为不是核心逻辑。

- [append属性文档](https://router.vuejs.org/zh/api/#append) 
- [replace属性文档](https://router.vuejs.org/zh/api/#replace) 

分析准备就绪，可以开始实现 `createRoute` 方法了，老规矩，先看整体代码，再逐步分析：

```js
/*
 * @path: src/hello-vue-router/utils/route.js
 * @Description: route对象相关方法
 */
export function createRoute(record, location) {
  let route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || "/",
    hash: location.hash || "",
    query: location.query || {},
    params: location.params || {},
    fullPath: location.path || "/",
    matched: record && formatMatch(record),
  };
  return Object.freeze(route);
}

// 初始状态的起始路由
export const START = createRoute(null, {
  path: '/'
})

// 关联所有路由记录
function formatMatch(record) {
  const res = []
  while (record) {
    // 队列头添加，所以父record永远在前面，当前record永远在最后
    // 在router-view组件中获取匹配的route record时会用到
    // 精准匹配到路由记录是数组最后一个
    res.unshift(record)
    record = record.parent
  }
  return res
}
```

如上，`createRoute` 方法里通过两个参数互相取一些值来构建 route 对象。这里需要注意的有两个地方，`fullPath` 参数其实是一个 path+qs+hash 的完整路径，但是这里我们只写了path，先不考虑参数的问题。

还有 `matched` 这个属性，我们直接写了一个 `formatMatch` 函数生成，函数中只做了一件事，拿到当前 path 关联的所有路由配置对象。

函数行参 `record` 就是路由配置对象，生成路由配置对象的时候，我们为其添加了 parent 属性，指向其父路由，不记得就回顾一下 `createRouteMap` 方法。 `formatMatch` 函数里就是递归找当前路径包括它的父级路由配置对象，组成一个数组即 `matched` 参数，举个例子，如下这个路由配置：

```js
let routes = [
   {
    path: "/parent",
    name: "Parent",
    component,
    children:[
      {
        path: "child",
        name:"Child",
        component,
      }
    ]
  }
]
```

那么此路由配置解析成 pathMap 如下：

```js
pathMap = {
  "/parent": {path:"/parent", ...},
  "/parent/child": {path:"/parent/child", ...},
}
```

假如要跳转的新 path 是 `/parent/child`，生成 route 时，经过 `formatMatch` 方法关联它的所有路由记录，最终该路由对象的 `matched` 属性就是下面这样：

```js
[
  {path:"/parent", component, parent ...},
  {path:"/parent/child", component, parent ...}
]
```

注意，因为 `formatMatch` 函数递归查找父级时，我们使用的是 `unshift` 方法，所以最终的数组最后一项一定是当前 path 的模块。

这里其实是为嵌套路由做准备，因为当存在嵌套路由，子路由记录被匹配到时，其实代表着父路由记录也一定被匹配到了。例如匹配 /foo/bar， 当 /foo/bar 本身被匹配了，其父路由对象 /foo 肯定也匹配了，最终匹配结果如下：

```js
metched = [{path:"/foo", ...},{path:"/foo/bar"}] 
// “/foo/bar” 本身匹配模块在数组最后，而第一项是顶级路由匹配项
```

总结来说，路由对象的 `matched` 属性是一个数组，数组项是匹配到的路由配置对象，数组项顺序依次是顶级路由匹配对象到当前子级路由本身匹配对象，到此一个简单的路由生成函数就 OK 了。

思路切回 History 类，`current` 对象我们还没为其赋初始路由值呢，所以，我们在 `route.js` 文件中还写了一个初始化路由对象并导出，调用了一下 `createRoute` 方法，参数一置空，参数二只写一个 path 属性值为 `"/"` 的对象：

```js
// 初始状态的起始路由
export const START = createRoute(null, {
  path: '/'
})
```

最后修改一下 `base.js` 文件中的 History 类，将路由对象初始值 `START` 导入并赋值给 `current` ：

```js
// 导入初始化route对象
import { START } from "../utils/route";

export class History {
  constructor(router) {
    this.router = router;
    
    // 当前路由route对象
    //     this.current = {};
    // =>  this.current = START;
    this.current = START;
    
    this.listeners = [];
  }
  
 // ...
}
```

到这里，父类中的 `transitionTo` 即路由跳转方法就可以继续补充了，调用路由跳转方法就会传入一个目标信息对象，这时应该做什么？

- 更新路由对象 `current` 

- 更新 URL

- 更新视图

```js
// 路由跳转
transitionTo(location, onComplete) {
  // 路由匹配，解析location匹配到其路由对应的数据对象
  let route = this.router.match(location);

  // 更新current
  this.current = route;

  // 更新URL
  this.ensureURL()

  // 跳转成功抛出回调
  onComplete && onComplete(route)
}
```

如上，路由跳转方法 `transitionTo` 其实传入的就是 location 对象，`push` 方法也是基于此方法实现的。

那新的目标信息对象来了，我们首先就要构建一个新的路由对象，History 是一个父类，后面我们还会写子类，子类继承父类，子类在初始化实例的时候（index.js文件 mode 参数判断那块）其实传入了当前 VueRouter 实例，所以我们父类也可以接收到，也就是我们父类 constructor 中的 `router` 参数，我们将它直接挂在了父类实例属性 `router` 上，这样我们就可以通过 `this.router` 获取到 VueRouter 实例。

VueRouter 实例上我们挂载了 match 方法还记得吗？不记得回顾下代码。

我们使用 `this.router.match` 方法，传入 location 参数，就可以生成一个新的路由对象，最后将新的路由对象赋值给 `current` 属性。

OK，按照我们的逻辑，路由改变生成新的路由对象并赋值给 `current` 就完成了，还剩下更新URL以及更新视图。



**思考：为什么更新URL？**

其实直接修改 URL 来跳转，并不需要更新 URL，但如果使用 API 来做路由跳转，例如 `push` 方法，我们在代码中可以控制更新路由对象 `current` ，也可以更新视图，但是 URL 并没有改变，所以我们还需要更新 URL。

那么问题来了，怎么更新 URL？

可以看到上面代码中我们调用了 `ensureURL` 方法来更新，而且是 `this` 调用的，其实这个方法并不在父类上，而在子类。

为什么将 `ensureURL` 方法写在子类？

因为我们存在 3 种模式，不同模式替换 URL 的方式是不同的，所以各个子类上写自己的 URL 更新方法最好了。

为什么这里可以调用子类方法？

因为初始化实例的是子类，子类又继承父类，可以理解为父类的方法以及属性都被子类继承了，`transitionTo` 方法当然也被继承了，那在调用这个跳转方法时，内部的 `this` 指向就是子类，所以可直接调用子类方法。

至于视图更新，因为目前还没有完善 `router-view` 组件，子类也没写好，所以我们放到后面完善。

最后抛出跳转成功的回调，并传入当前 route 对象参数。



## 路由模式子类初步构建

我们先把三种模式子类初步构建一下，其实就是在三个文件中创建不同的子类，并让他们都继承父类，后面我们一一实现。

hash.js

```js
import { History } from './base'

export class HashHistory extends History {
  constructor(router){
    super(router);
  }
}
```

html5.js

```js
import { History } from './base'

export class HTML5History extends History {
  constructor(router){
    super(router);
  }
}
```

abstract.js

```js
import { History } from './base'

export class AbstractHistory extends History {
  constructor(router){
    super(router);
  }
}
```





## HashHistory类实现

来到 `history/` 的文件夹下的 `hash.js` 文件，我们先实现 HashHistory 类：

```js
/*
 * @path: src/hello-vue-router/index.js
 * @Description: 路由模式HashHistory子类
 */
import { History } from './base';

export class HashHistory extends History {
  constructor(router) {
    // 继承父类
    super(router);
  }
  
  // 启动路由监听
  setupListeners() {
    // 路由监听回调
    const handleRoutingEvent = () => {
      let location = getHash();
      this.transitionTo(location, () => {
        console.log(`Hash路由监听跳转成功！`);
      });
    };

    window.addEventListener("hashchange", handleRoutingEvent);
    this.listeners.push(() => {
      window.removeEventListener("hashchange", handleRoutingEvent);
    });
  }
}

// 获取location hash路由
export function getHash() {
  let href = window.location.href;
  const index = href.indexOf("#");
  if (index < 0) return "/";

  href = href.slice(index + 1);

  return href;
}
```

如上，我们让 HashHistory 类继承 History 类，子类也就继承了父类的一切。我们先实现了 hash 模式下的 `setupListeners` 方法，即启动路由监听方法。

来看一下其中的逻辑，主要就是监听了 `hashchange` 事件，也就是当 hash 路由改变，就会触发其回调。



**思考：监听到路由path改变了我们需要做什么？**

path 变了需要更新当前路由对象、更新视图等等，这个步骤我们前面做过，没错，就是 `transitionTo` 跳转方法里做的，所以我们直接在监听到路由改变时调用路由跳转方法即可。

所以回调中先是通过一个 `getHash` 的工具函数获取到当前 hash 值，返回 hash 路由 path，这个方法简单，不赘述。拿到 path 后接着调用 `transitionTo` 方法。

另外，在启动监听后，我们向 `listeners` 数组（继承父类）中 `push` 了一个销毁监听的方法，用于卸载时销毁监听事件，这点上面也说过了。



接下来补充一下子类的方法：

```js
export class HashHistory extends History {
  constructor(router) {
    // 继承父类
    super(router);
  }
  
  // 启动路由监听
  setupListeners() { /** ... **/ }
  
  // 更新URL
  ensureURL() {
    window.location.hash = this.current.fullPath;
  }
  
  // 路由跳转方法
  push(location, onComplete) {
    this.transitionTo(location, onComplete)
  }

  // 路由前进后退
  go(n){
    window.history.go(n)
  }
  
  // 跳转到指定URL，替换history栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, (route) => {
      window.location.replace(getUrl(route.fullPath))
      onComplete && onComplete(route)
    })
  }

  // 获取当前路由
  getCurrentLocation() {
    return getHash()
  }
}

// 获取URL
function getUrl(path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

// 获取location hash路由
export function getHash() { /** ... **/ }
```

我们补充了 5 个方法：

- ensureURL 
  - 更新 URL ，它的实现其实很简单，更新导航栏 URL 的 hash，使用 `window.location.hash` API 就可以，在父类跳转方法里，更新当前路由对象之后才调用了 `ensureURL`，而更新后路由对象中的 `fullPath` 属性就是完整的hash path，所以直接赋值过去就可以了。
- push
  - 路由跳转方法，此方法我们在父类早已经实现好了，所以接在 `push` 中调用父类的 `transitionTo` 方法进行跳转就好，参数也都一致。
- go
  - 路由的前进后退，其实实现的不论是 hash 还是 history 模式跳转，每次跳转都改变了URL，跳转的记录都存放在浏览器的 `window.history` 栈中，而浏览器也提供了一个 `window.history.go` 的方法让用做前进后退路由，所以直接调用即可，参数都一致。

- getCurrentLocation
  - 获取当前 URL 路由地址，由于这是 hash 类，我们之前实现过一个 `getHash` 方法来获取 hash 模式下 URL 中的路由，所以返回此方法的调用值即可。

- replace 
  - 跳转到指定URL，替换history栈中最后一个记录

我们重点说 `replace` 方法：

先说作用，其实也是跳转，只是使用 `replace` 跳转不会在 `window.history` 栈中产生记录，也就是当我们从 a 页面使用 `push` 跳转到 b 页面时，栈中是 `[a,b]`，再使用 `replace` 跳转从 b 页面到 c 页面时，栈中还是 `[a, b]` ，那这个时候我们返回上一个页面，就直接从 c 页面到了 a 页面。

其实我们大概也知道浏览器有 `window.location.replace` 方法就可以实现此功能，但 VueRouter 中跳转时需要考虑三块更新（路由对象、URL、视图）。

试想，假如我们要 `replace` 一个新的路由，我们需要怎么做？

先更新当前路由对象，再更新URL，这里的更新要使用 `window.location.replace` 更新才不会留记录，最后渲染视图。

诶？好像和 `transitionTo` 中差不多，那我们可以修改 `transitionTo` 方法，把它原来更新URL的 `ensureURL` 方法放到跳转成功回调的后面，这样我们调用 `transitionTo` 方法，在回调中使用 `window.location.replace` 更新URL就可以了。

你可能会疑问，将 `ensureURL` 方法放到最后，在回调中 `replace` 但回调执行完毕还是会调用 `ensureURL` 方法啊？

其实回调里使用 `window.location.replace` 更新URL后，URL已经是最新的了，这时再调用 `ensureURL` 更新URL，由于要更新的URL和当前URL是一致的，所以页面不会跳转。

因为 `ensureURL` 方法里其实调用的 `window.location.hash` ，假如当前页面地址为 `http://localhost:8080/#/about`，我们使用此 API 将其 hash 改为 `/about`，由于前后 hash 一致，其实等于啥也没做。。。

所以我们修改 `transitionTo` 方法只需修改其成功回调和更新URL的 `ensureURL` 方法调用顺序即可，如下：

```js
transitionTo(location, onComplete) {
  let route = this.router.match(location);
  this.current = route;

  // 跳转成功抛出回调 放上面
  onComplete && onComplete(route)
  
  // 更新URL 放下面
  this.ensureURL()
}
```

接着实现 `replace` 方法：

```js
export class HashHistory extends History {

  // 跳转到指定URL，替换history栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, (route) => {
      window.location.replace(getUrl(route.fullPath))
      onComplete && onComplete(route)
    })
  }
  
  // ...
}

// 获取URL
function getUrl(path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}
```

如上，调用 `transitionTo` 方法，在其回调中 `window.location.replace` 一下就可以了

注意这里我们又写了一个工具方法，`getUrl` ，其实就是传入 hash path，返回完整的新 URL 路径，常规操作，不赘述。

到了这里，其实我们的 `HashHitory` 子类就差不多 OK 了。

接下来就是流程打通了。

之前在 VueRouter 类的实现中，我们只是初始化了各个路由模块子类，但是还没有开启路由监听，注意子类里启动监听的方法是 `setupListeners` ，再次回到 `src/hello-vue-router/index.js` 文件，即 VueRouter 类中，给它添加一个初始化方法。



## VueRouter实例初始化

### 初始化方法构建

思考：VueRouter类初始化时应该做什么？

当然是启动路由模式类的监听，既然启动了监听，那必然要挂载一下销毁。

思考：什么时候销毁？

什么时候不需要监听什么时候销毁！！Vue根实例卸载后就不需要监听了，所以我们监听一下Vue根实例的卸载就可以了。

问题是我们在外部要怎么监听一个Vue实例的卸载？

诶！`hook:` 前缀的特殊事件监听就派上用场了，Vue官方支持。



**小 Tips：**`hook:` **前缀的特殊事件监听**

源码中生命周期钩子函数是通过 `callHook` 函数去调用的， `callHook` 函数中有一个 `vm._hasHookEvent` 的判断，当它为 `true` 的情况下，有着 `hook:` 特殊前缀的事件，会在对应的生命周期当中执行。

组件中监听事件解析后会使用 `$on` 注册事件回调，使用 `$on` 或 `$once` 监听事件时，如事件名以 `hook:` 作为前缀，那这个事件会被当做 `hookEvent`，注册事件回调的同时，`vm._hasHookEvent` 会被置为 `true`，后当使用 `callHook` 调用生命周期函数时，由于 `_hasHookEvent` 为 `true`，会直接执行 `$emit('hook:xxx')`，所以注册的生命周期函数就会执行。

- 在模板中通过 `@hook:created` 这种形式注册。
- JS 中可通过`vm.$on('hook:created', cb)` 或者 `vm.$once('hook:created', cb)` 注册，vm 指当前组件实例。

一道经典的面试题，**如何在父组件中监听子组件生命周期**，答案就是在父组件中获取到子组件实例（vm），然后通过注册`hook:` 前缀+生命周期钩子的特殊事件监听就可以了。

这里我们要监听根实例，所以要拿到根实例对象再注册监听，监听销毁事件我们没必要使用 `$on` ，用 `$once` 就可以，这样只触发一次，触发之后监听器就会被移除，如下：

```js
// vm 为根实例对象
vm.$once("hook:destroyed", () => {})
```



知道了这些问题，继续实现 init 方法，既然要拿到根实例对象，那 `init` 方法的参数就有了，分析完毕，开始写代码吧！

```js
export default class VueRouter{
  
	init(app) {
    // 绑定destroyed hook，避免内存泄露
    app.$once('hook:destroyed', () => {
      this.app = null

      if (!this.app) this.history.teardown()
    })

    // 存在即不需要重复监听路由
    if (this.app) return;

    this.app = app;

    // 启动监听
    this.history.setupListeners();
  }
  
  // ...
}
```

如上，其实很简单，`init` 方法传入了一个 app 参数，即 Vue 根实例，方法里判断了 `this.app` 是否存在，存在直接返回代表已经注册过监听，不存在则将实例赋值给了 VueRouter 类的 app 属性上，最后调用 VueRouter 实例 `history` 属性的 `setupListeners` 方法启动监听。

`history` 就是我们在 `constructor` 里初始化的路由模式类实例，`constructor` 构造器在 `new VueRouter` 的时候就会执行，所以我们完全可以拿到 `history` 实例。

而注册的销毁监听也很简单，就是上面说过的使用根实例的 `$once` 注册一个 `hook:destroyed` 监听，回调中将 app 属性置空并调用 `history` 实例的卸载方法 `teardown` ，此方法是在路由模式父类中实现的，忘了的话可以回看一下。

OK，`init` 方法暂时写完了，我们要在什么时候调用它呢？



### 初始化方法调用

因为 init 方法中还有启动监听，所以需要在一切都初始化好了再调用，并且这个时候还要能拿到 Vue 根实例。

回顾我们上面所有环节，能拿到根实例的地方只有插件安装 install 方法 `mixin` 混入的时候了。

所以，在 `src/hello-vue-router/install.js` 文件 install 方法的 `mixin` 中添加执行路由组件初始化方法：

```js
/*
 * @path: src/hello-vue-router/install.js
 * @Description: 入口文件 VueRouter类
 */
export function install(Vue){
  
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;
        
        // 调用VueRouter实例初始化方法
        // _router即VueRouter实，此处this即Vue根实例
        this._router.init(this) // 添加项 
        
        this._route = {};
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    },
  });
  
  // ...
}
```

这时你会发现，`mixin` 中 `_route` 对象还是空对象，我们已经实现了当前路由对象即路由模式类的 `current` 属性，所以这里可以为其赋值了，再次修改代码如下：

```js
Vue.mixin({
  beforeCreate() {
    if (this.$options.router) {
      this._routerRoot = this;
      this._router = this.$options.router;
      this._router.init(this)

      // this._route = {}; old
      this._route =  this._router.history.current; // new
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
  },
});
```

到了这里其实我们 hash 模式的整个流程基本通了，可以打开项目链接看看，没有报错并且可以点击导航切换路由，有报错那肯定是你写错了，不是我。。虽无报错，但页面中路由模块没有渲染，因为 `router-view` 组件还没完善。



## RouterView组件完善

目前我们的 RouterView 组件是这样的：

```js
/*
 * @path: src/hello-vue-router/components/view.js
 * @Description: router-view
 */
export default {
  name: "RouterView",
  functional: true,
  render(h) {
    return h('div', 'This is RoutePage')
  }
}
```

如上，组件渲染的永远是固定的 div，现在就可以开始完善它了。



### 路由组件动态渲染

思路很简单，先拿到当前路由对象，因为当前路由对象的 `matched` 数组存着当前 path 所有有关联的路由匹配对象，数组最后一项即当前path本身的路由匹配对象，所以我们只需要取出数组最后一项，然后拿它的 components 属性（即当前 path 对应的路由模块），直接将它给到渲染函数即可。

开始修改 RouterView 组件：

```js
export default {
  name: "RouterView",
  functional: true, // 函数式组件
  render(h,  { parent, data}) {
    // parent：对父组件的引用
    // data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件
    
    // 标识当前渲染组件为router-view
    data.routerView = true

    let route = parent.$route
    let matched;
    if(route.matched){
      matched = route.matched[route.matched.length - 1]
    }

    if (!matched) return h();
  
    return h(matched.components, data)
  }
}
```

对函数式组件不了解的请看文档 [函数式组件文档](https://cn.vuejs.org/v2/guide/render-function.html#函数式组件) 。

其实代码很简单，先标识了一下当前渲染的是 RouterView 组件，代码中给 data 添加了一个属性，这个 data 最后会被作为 createElement 的第二个参数传入组件，当我们想要知道一个组件是不是 RouterView 渲染出来的，就可以通过这个属性来判断，这个属性存放在组件实例下 `$vnode` 属性的 data 对象中。

由于我们已经挂载了 `$route` 所以通过任何一个实例都可以访问此路由对象，拿到路由对象，取其 `matched` 属性数组的最后一项，即当前 path 对应的路由组件。

最后直接在 h（createElement）函数中返回组件即可。

貌似已经 OK 了，打开项目页面看一下。

页面中除了导航一片空白，也没报错，点击导航也确实触发跳转监听了（控制台有输出），但是并无任何组件渲染，如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723003317616.png)

怎么回事？捋一遍流程。

首先，点击导航跳转，监听到 hash 路由改变，走 `transitionTo` 方法，方法中做三件事：

- 更新当前路由对象
- 更新URL
- 更新组件渲染

诶！更新组件渲染，这一步我们好像到现在还没做，找到问题所在了！

RouterView 组件我们已经初步完善了，但是当路由 path 更新，我们怎么通知 RouterView 组件更新渲染呢？？

想一下，Vue最核心的是什么？当然是数据响应式，RouterView 的核心数据是 `$route`，如果我们将它做成一个响应式的数据，那当它改变时岂不就可以直接自动重新渲染！

说干就干，之前写的 `$route`，它其实是被代理到了 Vue 根实例的 `_route` 对象，所以只要将 `_route` 对象搞成响应式的就可以了，做响应式当然还是借助 Vue 提供的方法，不然我们在手写一个数据响应式太费劲了，况且 Vue 本身构造函数就有提供这样的 API，即 `Vue.util.defineReactive` 函数，使用也很简单，修改一下 install 方法：

```js
Vue.mixin({
  beforeCreate() {
    if (this.$options.router) {
      this._routerRoot = this;
      this._router = this.$options.router;
      this._router.init(this) 

      // this._route =  this._router.history.current;  old
      Vue.util.defineReactive(this, '_route', this._router.history.current); // new
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
  },
});
```

如上所示，我们使用 `Vue.util.defineReactive` API，为根实例（this）添加一个响应式属性 `_route` 并为其赋值为路由对象，这里能够直接使用 Vue 构造函数是因为 `install` 方法参数传入了 Vue。

如此，每当 `_route` 这个对象更改的时候 RouterView 组件就可以自动渲染了，我们再看下页面，点一点导航：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723011856248.png)

fuck，还是老样子，这是为什么呢？再捋捋。

首先，点击导航跳转，监听到 hash 路由改变，走 `transitionTo` 方法，方法中做三件事：

- 更新当前路由对象
- 更新URL
- 更新组件渲染

好像没毛病啊，诶！等等，好像又发现了问题，更新当前路由对象的时候，好像只更新了 `current`，并没有更新 `_route`，`_route` 对象只在初始化的时候赋了一次值。。改它！！

首先为 `History` 类增加一个 `listen` 方法，并接收一个回调，`listen` 函数内部则直接将此回调函数保存到了 `History` 类的 `cb` 属性上，在 `transitionTo` 函数里 `current` 更新后面调用 `cb` 回调并传出了要更新的 `route` 对象，而 `_route` 更新的这一步操作，放在了 VueRouter 类的 init 方法里，如下：

```js
// History父类中新增listen方法 保存赋值回调
listen(cb){
  this.cb = cb
}

transitionTo(location, onComplete) {
  let route = this.router.match(location);
  this.current = route;

  // 修改
  // 调用赋值回调，传出新路由对象，用于更新 _route
  this.cb && this.cb(route)

  onComplete && onComplete(route)
  this.ensureURL()
}
```

接着是 VueRouter 类的 init 方法：

```js
init(app) {
  app.$once('hook:destroyed', () => {
    this.app = null

    if (!this.app) this.history.teardown()
  })

  if (this.app) return;

  this.app = app;

  this.history.setupListeners();

  // 新增 
  // 传入赋值回调，为_route赋值，进而触发router-view的重新渲染 
  // 当前路由对象改变时调用
  this.history.listen((route) => {
    app._route = route
  })
}
```

可能有小伙伴会懵，其实也很好理解，就是在 init 方法中调用了 `history` 实例继承于父类的 `listen` 方法，传入一个更新 `_route` 的回调，`listen` 函数会将这个回调一直保存，每次更新路由对象的时候，传入新的路由对象调用一次即可更新 `_route`。

现在打开页面再看一下，刷新页面，没有渲染，点击导航又渲染了。



**思考：为什么刷新时没有渲染组件？**

其实是因为路由 path 改变时，我们能够监听到，进而都做了操作，但当页面初始化时我们没有对初始的 path 进行解析。

知道了问题就解决！其实也简单，直接在 init 方法中获取当前路由path，然后调用 `transitionTo` 方法解析path渲染一下就行了，再次修改 VueRouter 类的 init 方法：

```js
init(app) {
  app.$once('hook:destroyed', () => {
    this.app = null

    if (!this.app) this.history.teardown()
  })

  if (this.app) return;

  this.app = app;

  // 新增
  // 跳转当前路由path匹配渲染 用于页面初始化
  this.history.transitionTo(
    // 获取当前页面 path
    this.history.getCurrentLocation(),
    () => {
      // 启动监听放在跳转后回调中即可
      this.history.setupListeners();
    }
  )

  this.history.listen((route) => {
    app._route = route
  })
}
```

如上，还记得路由模式子类中写的 `getCurrentLocation` 方法吗？其实就是获取当前路由path，使用 `history` 实例的 `transitionTo` 方法传入当前路由path，由于这里是 init 方法，所以相当于是在页面初始化时执行的，也就是刷新时会获取到当前页面的 path 进行解析渲染一次，我们把启动监听 `setupListeners` 函数放在了跳转回调中监听，这都无碍。

那再来看看页面：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723022403939.png)



不论是刷新还是跳转都没有问题，都可以正常显示，nice！



### 嵌套路由组件渲染

再测试一下嵌套路由吧！

做下准备，先写一个父级页面，在 `src/views/` 文件夹下新建 `Parent.vue` 文件，写入在代码：

```html
<template>
  <div>
    parent page
    <router-view></router-view>
  </div>
</template>
```

接着写一个子级页面，在 `src/views/` 文件夹下新建 `Child.vue` 文件，写入代码：

```html
<template>
  <div>
    child page
  </div>
</template>
```

修改 `src/router/index.js` 文件的路由配置数组如下：

```js
const routes = [
  // ...
  
  //新增路由配置
  {
    path: "/parent",
    name: "Parent",
    component: ()=>import("./../views/Parent.vue"),
    children:[
      {
        path: "child",
        name:"Child",
        component:()=>import("./../views/Child.vue")
      }
    ]
  }
];
```

 接着修改 `src/App.vue` 文件中的路由导航，新增 `Parent & Child` 两个导航如下：

```html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> ｜
      <!-- 新增 -->
      <router-link :to="{ path: '/parent' }">Parent</router-link> |
      <router-link :to="{ path: '/parent/child' }">Parent Child</router-link>
    </div>
    <router-view/>
  </div>
</template>
```

OK，这是一个非常简单的嵌套路由，来看看页面效果吧！

前两个页面正常，`parent` 页面组件没有渲染，控制台直接爆栈了：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723025500620.png)

 `child` 页面显示如下：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723025439114.png)

 `child` 页面因为只渲染出了子页面的内容，这是一个嵌套路由，子页页面内容是在父页面写的 `router-view` 中渲染，所以点击子页面正常应该父页面的内容也会显示。

其实，所有的问题都由于我们在写 RouterView 组件时，没有考虑嵌套的情况，回顾下 RouterView 组件代码：

```js
export default {
  name: "RouterView",
  functional: true,
  render(h,  { parent, data}) {
    data.routerView = true

    let route = parent.$route
    let matched;
    if(route.matched){
      matched = route.matched[route.matched.length - 1]
    }

    if (!matched) return h();
  
    return h(matched.components, data)
  }
}
```

分析一下，以目前的 RouterView 组件代码，假如当前 path 为 `/parent/child` ，拿到当前路由对象 `route`，我们知道 `route.matched`  这里存放的是路径解析后所有相关的路由配置对象，它应该是这样的：

```js
[
  {path: "/parent", components, ...},
  {path: "/parent/child", components, ...}
]
```

而我们取最后一项，只取了子路由模块，所以也就只渲染出了子路由组件。

再假如当前 path 为 `/parent` ，当前路由对象解析后拿到的 `route.matched` 数组是下面这样的：

```js
[
  {path: "/parent", components, ...}
]
```

取最后一项，只渲染了父路由组件，由于父路由组件中还有 `router-view` 组件，继续走组件逻辑，接着渲染父组件。。。一直循环下去，所以就爆栈了。。

修改一下 RouterView 组件，如下，先看完整代码再解释。

```js
export default {
  name: "RouterView",
  functional: true, // 函数式组件
  render(h,  { parent, data}) {
    // parent：对父组件的引用
    // data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件
    
    // 标识当前组件为router-view
    data.routerView = true

    let depth = 0;
    // 逐级向上查找组件，当parent指向Vue根实例结束循环
    while(parent && parent._routerRoot !== parent){
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      // routerView属性存在即路由组件深度+1，depth+1
      if(vnodeData.routerView){
        depth++
      }

      parent = parent.$parent
    }


    let route = parent.$route
    
    if (!route.matched) return h();
    
    // route.matched还是当前path全部关联的路由配置数组
    // 渲染的哪个组件，走上面逻辑时就会找到depth个RouterView组件
    // 由于逐级向上时是从父级组件开始找，所以depth数量并没有包含当前路由组件
    // 假如depth=2，则route.matched数组前两项都是父级，第三项则是当前组件，所以depth=索引
    let matched = route.matched[depth]

    if (!matched) return h();

    return h(matched.components, data)
  }
}
```

这块可能不太容易理解。

首先还是给所有的 RouterView 组件做了一个标识。

接着开始从 `parent` 父级实例逐级向上遍历组件，从当前父实例找到顶部根实例，也就是当 `parent._routerRoot !== parent` 成立时，跳出循环。

在遍历的逻辑里，判断实例的 `$vnode` 属性下 data 属性中有无 `routerView` 属性，有则 `depth + 1`，遍历的最后让 `parent = parent.$parent` ，`$parent` 拿到的是父组件实例，以此开启递归。

要知道不论怎么搞，当前 path 对应的路由对象 route 对象始终是不变的，而 `route.matched` 是当前 path 全部关联的路由配置数组。

假如当前 path 是 `/a/b/c` ，三级嵌套路由，那它的 `route.matched` 应如下：

```js
[
  {path: "/a", ...},
  {path: "/a/b", ...},
  {path: "/a/b/c", ...},
]
```

嵌套了三层，也就有三个 RouterView 组件， `App.vue、a.vue、b.vue` 中各一个，所以当渲染 `/a/b/c` 时，页面应该是下面这样的：

```js
// /a/b/c
a
 b
  c
```

当 `App.vue` 页面 RouterView 组件开始渲染，走组件逻辑查找 `depth` 层级，**从父实例**向上迭代到根实例查找带有 `routerView` 属性的组件，有 0 个，所以 `depth = 0` ，`route.matched[0]` 即 `/a` 路由组件。

当 `a.vue` 页面 RouterView 组件开始渲染，走组件逻辑查找 `depth` 层级，**从父实例**向上迭代到根实例查找带有 `routerView` 属性的组件，有 1 个，所以 `depth = 1` ，`route.matched[1]` 即 `/a` 路由组件。

当 `b.vue` 页面 RouterView 组件开始渲染，走组件逻辑查找 `depth` 层级，**从父实例**向上迭代到根实例查找带有 `routerView` 属性的组件，有 2 个，所以 `depth = 2` ，`route.matched[2]` 即 `/a` 路由组件。

再来看看页面，我们发现嵌套路由两个页面都正常了。

/parent：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723075421896.png)

/parent/child：

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210723075307597.png)

所以，看懂了吗？我觉得够详细了，不懂再看几遍配合断点或打印。



## VueRouter实例方法挂载完善

路由模式类上面我们实现了几个路由跳转相关的方法，还没有挂载到 VueRouter 类上，我们一块来挂载下，还有之前挂载的 `addRoute & addRoutes` 两个方法，还需要完善一下。

回到 `src/hello-vue-router/index.js` 文件：

```js
export default class VueRouter {
  
  // 导航到新url，向 history栈添加一条新访问记录
  push(location) {
    this.history.push(location)
  }

  // 在 history 记录中向前或者后退多少步
  go(n) {
    this.history.go(n);
  }

  // 导航到新url，替换 history 栈中当前记录
  replace(location, onComplete) {
    this.history.replace(location, onComplete)
  }

  // 导航回退一步
  back() {
    this.history.go(-1)
  }
}
```

如上，添加几个路由跳转相关的方法，其实就是调用已经实现好的 history 实例上的方法就 OK 了，不赘述了。

接着我们看之前挂载的 `addRoute & addRoutes` 两个方法。

目前这两个方法调用时，确实进行追加了，普通情况下也是没问题的，但是有一种特殊情况，即在当前页面 path 初始化前，动态添加当前页面的路由组件，这时我们如果使用目前的API加载后，其实只是解析并添加了内部 pathMap， 但由于当前路由对象并没有更新，页面直接就会报错。

所以需要在动态添加后进行一次路由更新操作，其实还是调用一下 `transitionTo` 方法跳转当前页面 path 即可，当然还需避免路由初始化时即当前路由等于 `START` （之前写的路由 current 对象初始值）的情况。

So，修改这两个函数，如下：

```js
// 新增START对象导入
import { START } from "./utils/route";

export default class VueRouter {
  
 // 动态添加路由（添加一条新路由规则）
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route)
    // 新增
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  addRoutes(routes) {
    this.matcher.addRoutes(routes)
    // 新增
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
  
  // ...
}
```

比较简单，不赘述了。

至此，hash 模式的流程完整了。

接下来就是按部就班的实现 history 模式也就是填充 HTML5History 类了。



## HTML5History类实现

HTML5History 类虽然和 HashHistory 类实现细节上略有不同，但是我们要写的 API 都是一致的，这样才能完全契合外部的统一调用。

来到 `history/` 文件夹下的 `html5.js` 文件，有了上面 HashHistory 类的经验我们这里就直接贴代码了，因为没有什么困难的地方。

```js
/*
 * @path: src/hello-vue-router/history/html5.js
 * @Description: 路由模式HTML5History子类
 */
import { History } from './base'

export class HTML5History extends History {
  constructor(router) {
    // 继承父类
    super(router);
  }

  // 启动路由监听
  setupListeners() {
    // 路由监听回调
    const handleRoutingEvent = () => {

      this.transitionTo(getLocation(), () => {
        console.log(`HTML5路由监听跳转成功！`);
      });
    };

    window.addEventListener("popstate", handleRoutingEvent);
    this.listeners.push(() => {
      window.removeEventListener("popstate", handleRoutingEvent);
    });
  }

  // 更新URL
  ensureURL() {
    if (getLocation() !== this.current.fullPath) {
      window.history.pushState(
        { key: Date.now().toFixed(3) }, 
        "", 
        this.current.fullPath
      );
    }
  }

  // 路由跳转方法
  push(location, onComplete) {
    this.transitionTo(location, onComplete)
  }

  // 路由前进后退
  go(n){
    window.history.go(n)
  }

  // 跳转到指定URL，替换history栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, (route) => {
      window.history.replaceState(window.history.state, '', route.fullPath)
      onComplete && onComplete(route)
    })
  }

  // 获取当前路由
  getCurrentLocation() {
    return getLocation()
  }
}

// 获取location HTML5 路由
function getLocation() {
  let path = window.location.pathname;
  return path;
}
```

如上我们很轻松就实现了 HTML5Histoy 类，但是有一个问题，在使用 `history` ，不断点击 `router-link` 生成的同一个导航时，每次点击都会刷新页面，这其实就是我们之前说的， `router-link` 最终生成的是 a 标签，`history` 模式点击 a 标签，默认会触发页面的跳转，所以需要拦截 a 标签点击事件默认行为，`hash` 就不会，因为 hash 模式下 a 标签中解析后的 href 属性中是以 `#` 号开头的。

在哪里拦截？当然是 `router-link` 组件。



## RouterLink组件完善

也比较简单，统一给 RouterLink 组件返回的 a 标签加了阻止默认跳转，然后又加了手动跳转：

```js
export default {
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      require: true
    }
  },
  render(h) {
    const href = typeof this.to === 'string' ? this.to : this.to.path
    const router = this.$router
    let data = {
      attrs: {
        href: router.mode === "hash" ? "#" + href : href
      },
      //新增
      on: {
        click: e => {
          e.preventDefault()
          router.push(href)
        }
      }
    };
    return h("a", data, this.$slots.default)
  }
}
```

如上，我们在 createElement（h）函数的第二个参数中，对点击事件加入了阻止默认跳转事件，没有了默认跳转，我们进行了一次手动跳转，即直接调用 `router` 实例的 `push` 方法进行跳转。



## AbstractHistory类实现

没有了，其实实现起来很简单，就是用数组模拟了一个历史调用栈，找源码看一眼几分钟就写完了，完全是由一个数组和各种数组操作API组成的类，篇幅问题，不赘述了。



## 植入router hook

如果你跟着实现，到了这其实 VueRouter 的核心内容都差不多搞定了，接下来可以疯狂发散下思路，再自己动手找源码中相关实现来参考，最后完善出来 `router hook`，因为路由钩子是余下功能里实现起来有一定难度的一个，这是一个非常好的锻炼机会。

**Tips：** 路由钩子有三种：

- 全局路由钩子
- 组件路由钩子
- 路由独享beforeEnter守卫



## 写在最后

如果看到这里依然对其流程不太清楚，再来看这张图，说不定可以直接打通任督二脉哦！

![](https://gitee.com/IsboyJC/PictureBed/raw/master/other/image-20210725173152169.png)

整个实现的核心逻辑还算 OK，细节上还存在很多问题，因为我们忽略了一些校验及小功能的实现，但对理解 VueRouter 源码还是有很大帮助。建议跟着手敲一遍，搞完后直接去完整的看一遍 VueRouter 源码，加油吧！欢迎刊误！原创烧脑，写作不易，如果对你有帮助，点个赞吧！！

项目代码地址：[hello-vue-router](https://github.com/isboyjc/hello-vue-router) 

根目录下 `src/hello-vue-router` 文件夹即手写 VueRouter 完整代码，已作注释

根目录下 `vue-router-source` 文件夹即带有注释的 VueRouter V3.5.2 源码

最后欢迎大家关注微信公众号「不正经的前端」！点个赞吧！