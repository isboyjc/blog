## Vue

#### MVC、MVP和MVVM？

- 这三者都是框架模式，它们设计的目标都是为了解决Model和View的耦合问题。

- MVC模式出现较早主要应用在后端，如Spring MVC、ASP.NET MVC等，在前端领域的早期也有应用，如Backbone.js。它的优点是分层清晰，缺点是数据流混乱，灵活性带来的维护性问题。

- MVP模式在是MVC的进化形式，Presenter作为中间层负责MV通信，解决了两者耦合问题，但P层过于臃肿会导致维护问题。

- MVVM模式在前端领域有广泛应用，它不仅解决MV耦合问题，还同时解决了维护两者映射关系的大量繁杂代码和DOM操作代码，在提高开发效率、可读性同时还保持了优越的性能表现

MVVM是`Model-View-ViewModel`缩写，也就是把`MVC`中的`Controller`演变成`ViewModel`。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据





#### v-show 与 v-if 有什么区别？

- v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块

- v-show 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 `display` 属性进行切换

v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景

v-show 不支持 `<template>` 元素，也不支持 v-else



#### v-if 和 v-for 哪个优先级更高？

- v-for优先于v-if被解析

- 如果同时出现，每次渲染都会先执行循环再判断条件，无论如何循环都不可避免，浪费了性能

- 要避免出现这种情况，则在外层嵌套template，在这一层进行v-if判断，然后在内部进行v-for循环

- 如果条件出现在循环内部，可通过计算属性提前过滤掉那些不需要显示的项



#### Vue组件data为什么是函数而Vue的根实例则没有此限制？

Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的；采用函数形式定义，在initData时会将其作为工厂函数返回全新data对象，有效规避多实例之间状态污染问题

而根实例只能有一个，不需要担心这种情况



#### Vue中key的作用和工作原理？

 key的作用主要是为了高效的更新虚拟DOM，其原理是vue在patch过程中通过key可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得整个patch过程更加高效，减少DOM操作量，提高性能。

另外，若不设置key还可能在列表更新时引发一些隐蔽的bug

Vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。



#### Vue通信方式？

- props （父传子，常用）
- $emit/\$on | 事件总线EventBus（父子、子父、跨层皆可）
- $parent/\$children/\$ref 获取组建实例（父子、子父可，不可跨层）
- $attrs/\$listeners（皆可）
  - $attrs 里存放的是父组件中绑定的非 Props 属性，\$listeners 里存放的是父组件中绑定的非原生事件
- provide/inject（父子、跨层都可，不是响应式）
- 通过根实例对象 $root 通信 （皆可，全局可修改）
- vuex（皆可） 



#### Vue组件模版为什么只能有一个根元素？

- new Vue({el:'#app'})，如果同时设置多个入口，那vue就不知道哪一个才是入口类

- 单文件组件中，一个vue组件就是一个vue实例，template下元素 div 就是树结构中的根，多个根递归就需要源码额外做操作了

- diff算法要求的，源码中，patch.js里patchVnode()。 



#### Vue中watch与computed的区别？

 watch 是属性监听器，一般用来监听属性的变化（也可以用来监听计算属性函数），并做一些逻辑

computed 对于任何复杂逻辑或一个数据属性在它所依赖的属性发生变化时，会重新计算当前计算属性的值

watch更通用，源码中computed底层来自于$watch，但做了更多，例如缓存



#### Vue父组件监听子组件生命周期（hook）？

源码中生命周期函数是通过 `callHook` 函数去调用的， `callHook` 函数中在 `vm._hasHookEvent` 为 `true`的情况下，有着 `hook:` 特殊前缀的事件，会在对应的生命周期当中执行

组建中监听事件解析后会使用 `$on` 注册事件回调，使用 `$on` 或 `$once` 监听事件时，如事件名以 `hook:` 作为前缀，那这个事件会被当做 `hookEvent`，注册事件回调的同时，`vm._hasHookEvent` 会被置为 `true`，后当使用 `callHook` 调用生命周期函数时，由于 `_hasHookEvent` 为 `true`，所以会 `$emit('hook:xxx')`，注册的生命周期函数就会执行

- 在模板中通过 `@hook:created` 这种形式
- `vm.$on('hook:created', cb)` 或者 `vm.$once('hook:created', cb)`。



#### Vue声明周期理解？

- beforeCreate
  - 在实例初始化之后，数据观测（data observe）和event/watcher事件配置之前被调用，这时无法访问data及props等数据

- created
  - 在实例创建完成后被立即调用，此时实例已完成数据观测（data observer），属性和方法的运算，watch/event事件回调，挂载阶段还没开始， $el 尚不可用
- beforemount
  - 在挂载开始之前被调用，相关的render函数首次被调用
- mounted
  - 实例被挂载后调用，这时el被新创建的vm. \$el 替换，若根实例挂载到了文档上的元素上，当mounted被调用时 vm.$el 也在文档内。注意mounted不会保证所有子组件一起挂载
- beforeupdata
  - 数据更新时调用，发生在虚拟dom打补丁前，这时适合在更新前访问现有dom，如手动移除已添加的事件监听器。
- updated
  - 在数据变更导致的虚拟dom重新渲染和打补丁后，调用该钩子。当这个钩子被调用时，组件dom已更新，可执行依赖于dom的操作。多数情况下应在此期间更改状态。 如需改变，最好使用watcher或计算属性取代。注意updated不会保证所有的子组件都能一起被重绘
- beforedestory
  - 在实例销毁之前调用。在这时，实例仍可用
- destroyed
  - 实例销毁后调用，这时vue实例的所有指令都被解绑，所有事件监听器被移除，所有子实例也被销毁。



#### Vue父子组件生命周期调用顺序？

组件的调用顺序都是 `先父后子`,渲染完成的顺序是 `先子后父` 

组件的销毁操作是 `先父后子`，销毁完成的顺序是 `先子后父` 

**加载渲染过程**

```
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount- >子mounted->父mounted
```

**子组件更新过程**

```
父beforeUpdate->子beforeUpdate->子updated->父updated
```

**父组件更新过程**

```
父 beforeUpdate -> 父 updated
```

**销毁过程**

```
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
```




#### Vue单向数据流理解？

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解，也是为了组件间更好的解耦

在开发中可能有多个子组件依赖于父组件的某个数据，假如子组件可以修改父组件数据的话，一个子组件变化会引发所有依赖这个数据的子组件发生变化

v-model在使用的时候很像双向绑定的（实际上也是。。。），但其实也是单项数据流，v-model 只是语法糖而已。在给 input 元素添加 v-model 属性时，默认会把 value 作为元素的属性，然后把 'input' 事件作为实时传递 value 的触发事件



#### Vue组件化理解？

- 组件系统是 Vue 核心特性之一，它使开发者使用小型、独立和通常可复用的组件构建大型应用；组件化开发能大幅提高应用开发效率、测试性、复用性等

- 组件使用按分类有：页面组件、业务组件、通用组件

- vue的组件是基于配置的，我们通常编写的组件是组件配置而非组件，框架后续会生成其构造函数，它们基于VueComponent，扩展于Vue

- vue中常见组件化技术有：属性prop，自定义事件，插槽等，它们主要用于组件通信、扩展等

- 合理的划分组件，有助于提升应用性能

- 组件应该是高内聚、低耦合的

- 遵循单向数据流的原则



#### Vue组件设计原则？

- 容错处理, 这个要做好, 极端场景要考虑到, 不能我传错了一个参数就挂了
- 缺省值(默认值)要有, 一般把应用较多的设为缺省值
- 颗粒化, 把组件拆分出来
- 一切皆可配置, 如有必要, 组件里面使用中文标点符号, 还是英文的标点符号, 都要考虑到，灵活性更高
- 场景化, 如一个dialog弹出, 还需要根据不同的状态封装成success, waring, 等
- 有详细的文档/注释和变更历史, 能查到来龙去脉, 新版本加了什么功能是因为什么
- 组件名称, 参数prop, emit, 名称设计要通俗易懂, 最好能做到代码即注释这种程度
- 可拓展性, 前期可能不需要这个功能, 但是后期可能会用上, 要预留什么, 要注意什么, 心里要有逼数
- 规范化,我这个input组件, 叫`on-change`, 我另外一个select组件叫`change`, 信不信老子捶死你
- 分阶段: 不是什么都要一次开发完成做到极致，要看具体业务，不能自己给自己加戏



#### VDOM的理解及优缺？

虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象
- diff 算法 — 比较两棵虚拟 DOM 树的差异
- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树

优点：

- 保证性能下限： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；

- 无需手动操作 DOM： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率

- 跨平台： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等

缺点：

- 无法进行极致优化： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化



#### Vue中的diff？

**回答步骤一：什么是diff/为什么需要diff？**

vue 1.x中每一个属性会创建一个Dep，组件模板中每个动态属性都会创建一个Watcher，同一个动态属性交由属性的Dep管理，属性值更新会通过Dep通知所有Watcher达到更新目的，但是这样的话每一个组件都创建了大量watcher实例，消耗太大

vue 2.x中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，由于每个组件只有一个watcher实例，组件中多个属性的更新只有引入虚拟DOM做新老之间的精准对比才行，而 diff 算法就是为了精确找到发生变化的地方

Diff 就是通过高效的算法对比组件新旧虚拟DOM，将变化的地方更新在真实DOM上，diff的时间复杂度为O(n)。



**回答步骤二：vue中的diff介绍**？

vue中diff执行的时刻是组件实例执行其更新函数时，它会比对上一次渲染结果oldVnode和新的渲染结果newVnode，**此过程称为patch**。

整个diff过程整体遵循深度优先、同层比较的策略；两个节点之间比较会根据它们是否拥有子节点或者文本节点做不同操作；比较两组子节点是算法的重点，首先假设头尾节点可能相同做4次比对尝试，如果没有找到相同节点才按照通用方式遍历查找，查找结束再按情况处理剩下的节点；借助 key 通常可以非常精确找到相同节点，因此整个 patch 过程非常高效。



**回答步骤三：diff过程？**

1. 调用patch函数比较Vnode和OldVnode,如果不一样直接return Vnode即将Vnode真实化后替换掉DOM中的节点

2. 如果OldVnode和Vnode值得进一步比较则调用patchVnode方法进行进一步比较，分为以下几种情况：

- Vnode有子节点，但是OldVnode没有，则将Vnode的子节点真实化后添加到真实DOM上

- Vnode没有子节点，但是OldVnode上有，则将真实DOM上相应位置的节点删除掉
- Vnode和OldVnode都有文本节点但是内容不一样，则将真实DOM上的文本节点替换为Vnode上的文本节点
- Vnode和OldVnode上都有子节点，需要调用updateChildren函数进一步比较
- updateChildren比较规则
  - 提取出Vnode和OldVnode中的子节点分别为vCh和OldCh，并且提出各自的起始和结尾变量标记为 oldS oldE newS newE
  - 如果是oldS和newE匹配上了，那么真实dom中的第一个节点会移到最后
  - 如果是oldE和newS匹配上了，那么真实dom中的最后一个节点会移到最前，匹配上的两个指针向中间移动
  - 如果都没有，在没有key的情况下直接在DOM的oldS位置的前面添加newS，同时newS+1。在有key的情况下会将newS和Oldch上的所有节点对比，如果有相同的则移动DOM并且将旧节点中这个位置置为null且newS+1。如果还没有则直接在DOM的oldS位置的前面添加newS且newS+1
    直到出现任意一方的start>end，则有一方遍历结束，整个比较也结束



Vue3.x借鉴了 [ivi](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flocalvoid%2Fivi)算法和 [inferno](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Finfernojs%2Finferno)算法

在创建VNode时就确定其类型，以及在`mount/patch`的过程中采用`位运算`来判断一个VNode的类型，在这个基础之上再配合核心的Diff算法，使得性能上较Vue2.x有了提升。(实际的实现可以结合Vue3.x源码看。)

该算法中还运用了`动态规划`的思想求解最长递归子序列。





#### Vue中v-model原理？

`v-model`本质就是一个语法糖，可以看成是`value + input`方法的语法糖。 可以通过model属性的`prop`和`event`属性来进行自定义。原生的v-model，会根据标签的不同生成不同的事件和属性。



#### Vue响应式/双向数据绑定原理？

响应式，意思就是在改变数据的时候，视图会跟着更新

数据劫持结合“**发布-订阅**”模式的方式，通过**Object.defineProperty（）的 set 和 get**，在数据变动时发布消息给订阅者触发监听

每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据关联记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染



#### Vue模版编译原理？

简单说，Vue的编译过程就是将`template`转化为`render`函数的过程。会经历以下阶段：

- 生成AST树
- 优化
- codegen

首先解析模版，生成`AST语法树`(一种用JavaScript对象的形式来描述整个模板)。 使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。

Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以`跳过对它们的比对`，对运行时的模板起到很大的优化作用。

编译的最后一步是`将优化后的AST树转换为可执行的代码`。





#### Vue初始化流程？

Vue的初始化流程，是从 **new Vue()** 开始的，在 **new Vue()**后，会执行**init**方法

- 初始化options中的各种属性，生命周期，事件，属性与状态，计算属性与watch，并实现数据的响应式

如果使用template模板并处于运行时编译状态，那么会开始进入编译阶段

- 编译阶段由parse, optimize, generate组成，分别用来解析模板语法并生成AST，标记静态节点以优化，将AST转化为render function string的过程，这样就准备完成了渲染VNode所需的render function

最后使用 **$mount** 挂载

- $mount 方法中调用 mountComponent 方法，其中创建了 updateComponent 方法
- updateComponent中执行 `_render` 和 `_update` ，render拿到VDOM，update中会通过 `patch` 把VDOM转化为真实DOM

在数据有变化时，会通过**set -> Watcher -> update** 来更新视图

整个Vue的运行机制大致就是这样



#### Vue更新流程/异步更新队列？

**set -> Watcher -> update** 

Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，将此次的更新watcher推入队列。如果同一个 watcher 被多次触发，只会被推入到队列中一次。因为在推入队列的过程中为了避免不必要的计算和 DOM 操作而对其做了去重操作

然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替





#### Vue中nextTick的使用场景和原理？



#### Vue中keep-alive的使用场景和原理？

- 获取 keep-alive 包裹着的第一个子组件对象及其组件名

- 根据设定的 include/exclude（如果有）进行条件匹配,决定是否缓存。不匹配,直接返回组件实例

- 根据组件 ID 和 tag 生成缓存 Key,并在缓存对象中查找是否已缓存过该组件实例。如果存在,直接取出缓存值并更新该 key 在 this.keys 中的位置(**更新 key 的位置是实现 LRU 置换策略的关键**)

- 在 this.cache 对象中存储该组件实例并保存 key 值,之后检查缓存的实例数量是否超过 max 的设置值,超过则根据 LRU 置换策略**删除最近最久未使用的实例**（即是下标为 0 的那个 key）

- 最后组件实例的 keepAlive 属性设置为 true,这个在渲染和执行被包裹组件的钩子函数会用到,这里不细说

**LRU 缓存淘汰算法**

LRU（Least recently used）算法根据数据的历史访问记录来进行淘汰数据,其核心思想是“如果数据最近被访问过,那么将来被访问的几率也更高”。

keep-alive 的实现正是用到了 LRU 策略,将最近访问的组件 push 到 this.keys 最后面,this.keys[0]也就是最久没被访问的组件,当缓存实例超过 max 设置值,删除 this.keys[0]



#### Vue.mixin的使用场景和原理？

混入 (mixins) 是一种分 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项

全局混入的执行顺序要前于混入和组件里的方法



#### Vue.extend作用和原理?

Vue.extend



#### Vue.set作用和原理?

Vue.set其实就是用来动态添加响应式属性，一般用于在原来的响应式对象中添加一个新属性时，因为添加的新属性并没有经过响应式处理，使用Vue.set可为其做响应式处理

其原理也很简单，源码内部调用的也是`defineReactive` 方法，通过 `Object.defineProperty` 的get、set对添加的对象新key值做劫持



#### Vue.use作用和原理？

use方法接收一个类型为函数或对象的参数

只是如果参数是对象，那它就必须有一个 install 属性方法

不论参数是函数还是对象，在执行 install 方法或者函数本身的时候都会把构造函数 Vue 作为第一个参数传进去

这样我们在写插件的时候，但写一个函数或者一个有 install 函数属性的对象，都可以接收到构造函数 Vue，也就可以使用它来做一些事情了



#### Vue自定义指令原理?

指令本质上是装饰器，是 vue 对 HTML 元素的扩展，给 HTML 元素增加自定义功能。vue 编译 DOM 时，会找到指令对象，执行指令的相关方法。

自定义指令有五个生命周期（也叫钩子函数），分别是 bind、inserted、update、componentUpdated、unbind

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
- update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
- componentUpdated：被绑定元素所在模板完成一次更新周期时调用
- unbind：只调用一次，指令与元素解绑时调用



#### Vue中provide/inject原理？

当祖先组件在初始化时，vue首先会通过mergeOptions方法将组件中 provide 配置项合并 vm.$options 中，并通过 mergeDataOrFn 将provide 的值放入当前实例的 `_provided` 中，此时当子孙组件在初始化时，也会通过合并的 options 解析出当前组件所定义的 inject，并通过往上逐级遍历查找的方式，在祖先实例的 `_provided` 中找到对应的 value 值



#### Vuex理解和原理？

Vuex 通过代码实现了一个单向数据流，在全局拥有一个 `State` 存放数据，当组件要更改 `State` 中的数据时，必须通过 `Mutation` 提交修改信息， `Mutation` 同时提供了订阅者模式供外部插件调用获取 `State` 数据的更新。

而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走` Action` ，但 `Action` 也是无法直接修改 State 的，还是需要通过 `Mutation` 来修改 `State` 的数据。最后，根据 `State` 的变化，渲染到视图上。

- state ： `vuex` 的唯一数据源，如果获取多个 `state` ,可以使用 `...mapState`
- getter : 可以将其理解为计算属性， `getter` 的返回值根据他的依赖缓存起来，依赖发生变化才会被重新计算
- mutation ：更改 `state` 中唯一的方法是提交 `mutation`
- action ： 类似 `mutation`，但它通过提交 `mutation` 修改状态，可异步操作
- module ：当应用变得非常复杂是， `store` 就会变得相当臃肿。vuex 允许我们将 store分割成模块，每个模块拥有自己的 `state,mutation,action,getter` ，甚至是嵌套子模块从上至下进行同样方式分割



#### Vuex把异步操作封装在action把同步操作放在mutations的原因？

区分 actions 和 mutations 是为了能用 devtools 追踪状态变化。

 vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。vuex 真正限制的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）。

同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。

如果你开着 devtool 调用一个异步的 action，你可以清楚地看到它所调用的 mutation 是何时被记录下来的，并且可以立刻查看它们对应的状态。



#### VueRouter路由模式及实现原理？

vue-router 有 3 种路由模式：hash、history、abstrac

- hash:  使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- history :  依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- abstract :  支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

hash 模式核心就是使用 hashChange 事件监听URL hash（URL中#号后面的部分）改变，URL中的 hash 改变不会触发http请求，监听到改变之后重新渲染对应组件，使用API跳转时，其实主要是通过 window.location.hash 以及 window.location.replace 来手动改变路由

history 模式核心是使用 popstate 事件监听浏览器前进后退，使用 pushstate API 以及 replaceState API来手动跳转路由

abstract 模式则是使用数组模拟一个历史调用栈，通过数组API操作调用栈来实现路由



#### Vue函数式组件使用场景和原理？

函数式组件与普通组件的区别:

- 函数式组件需要在声明组件是指定 functional:true
- 不需要实例化，所以没有this,this通过render函数的第二个参数context来代替
- 没有生命周期钩子函数，不能使用计算属性，watch
- 不能通过\$emit 对外暴露事件，调用事件只能通过context.listeners.click的方式调用外部传入的事件
- 因为函数式组件是没有实例化的，所以在外部通过ref去引用组件时，实际引用的是HTMLElement
- 函数式组件的props可以不用显示声明，所以没有在props里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都解析到$attrs里面，并自动挂载到组件根元素上面(可以通过inheritAttrs属性禁止)

优点:

- 由于函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件

- 函数式组件结构比较简单，代码结构更清晰

使用场景：

- 简单的展示组件，作为容器组件使用 比如 router-view 就是一个函数式组件

- “高阶组件”——用于接收一个组件作为参数，返回一个被包装过的组件



#### Vue SSR的理解及优缺？

SSR 即服务端渲染，Vue 在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的 html 片段后再返回给客户端这个过程就叫做服务端渲染

- 优：
  - 更好的 SEO： SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面
  - 更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间

- 缺：
  - 开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境
  - 更多的服务器负载：在 Node.js  中渲染完整的应用程序，显然会比仅仅提供静态文件的  server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略



#### Vue、React 的区别和联系？

**设计原则：**

Vue的官网中说它是一款渐进式框架，采用自底向上增量开发的设计，Vue在声明式渲染的基础上，还可以为其添加组件系统、路由、状态管理、构建工具等来构建一个完整的框架，但并不需要一上手就把所有东西全用上，这些解决方案相互独立，所以说是渐进式

React主张函数式编程，推崇纯组件，强调单向数据流、数据不可变，而Vue是基于可变数据的，支持双向绑定



**语法：**

Vue推荐 webpack+vue-loader 的单文件组件格式，保留了html、css、js分离的写法，更接近常用的 web 开发方式

React没有模板，直接就是一个渲染函数，中间返回的就是一个虚拟DOM，React推荐的做法是 JSX + inline style，即all in js，JSX实际上就是一套XML语法



**数据流：**

Vue1中父组件和子组件因为 props 是双向绑定所以父子组件间是双向数据流，而组件和DOM之间也是双向的。Vue2 里 props 取消了双向绑定其父子组件之间也变成了单向数据流，但Vue2也提供了用事件的方式去修改父组件，它的组件和 DOM 之间还是双向的

React 从诞生之初就不支持双向绑定，一直提倡单向数据流，称之为 onChange/setState() 模式

一般项目中都会用 Vuex 以及 Redux 等单向数据流的状态管理框架，因此很多时候我们感受不到这一点的区别了



**数据绑定：**

Vue是双向数据绑定，当视图改变更新模型层，当模型层改变更新视图层。它采用数据劫持&发布订阅模式，通过Object.defineProperty对数据进行操作，为数据动态添加了getter与setter方法，获取数据触发getter，设置数据触发setter，从而触发watcher进行数据更改，接着更新试图

React是单向数据流，它的属性不允许更改，状态可更改，组件不允许直接通过 this.state 这种方式更改组件状态，需要通过setState来进行更改。而 setState 是异步的，需要在setState第二个参数（回调函数）中获取更新后的新的内容



#### ————————



#### Vue中watch和created哪个先执行？

Vue生命周期图中，init reactivity 是晚于 beforeCreate 但是早于created的

watch 加了 immediate，应当同init reactivity周期一同执行，早于created

正常的 watch，则是 mounted 周期后触发 data changes 的周期执行，晚于created



#### Vue中v-html怎么解决xss攻击？

v-html最终是调用 `innerHTML`  将其 `value` 插入对应元素

所以，复写 html 指令，将其 value 值使用 xss 包过滤内容即可



#### Vue中created与activated区别？

created：在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用

activated：在路由设置 `<keep-alive></keep-alive>` 时，才会有这个生命周期。在被 keep-alive 缓存的组件激活时调用



#### Vue中如何解决Sass无法解析深度作用选择器 `>>>` ?

可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作



#### Vue中为什么v-for的key不推荐使用index？

使用 `index` 在插入数据或者删除数据的时候，会导致后面的数据的key绑定的index变化，进而导致从新渲染，效率会降低

key应该绑定你v-for循环数据中的唯一值，这样就会大大减少渲染次数，数据更新时就不用一一替换，从而使用插入新数据的算法s



#### 什么是预渲染？和SSR区别是什么？

服务端渲染是指将客户端渲染的过程放到了服务端，直接吐渲染后的页面（即用户看到的页面）给浏览器

预渲染不像服务器渲染那样即时编译 HTML，它只在构建时为了特定的路由生成特定的几个静态页面，等于我们可以通过 Webpack 插件将一些特定页面组件 build 时就编译为 html 文件，直接以静态资源的形式输出给搜索引擎





#### Vue中批量引入组件？

使用 `require.context` 或 `import` 函数 



#### Vue中定义全局方法？

- 第一种：挂载到Vue的prototype上。把全局方法写到一个文件里面，然后for循环挂载到Vue的prototype上，缺点是调用这个方法的时候没有提示

- 第二种：利用全局混入mixin，因为mixin里面的methods会和创建的每个单文件组件合并。这样做的优点是调用这个方法的时候有提示



## Vue3

#### Vue3新特性？

- 更快
  -  虚拟DOM重写
     -  Vue 2.X中 对于视图中模板每次更新，Vue会遍历模板下的每个节点，生成对应的虚拟DOM，再与原模板中的节点比较差异，通过DIFF算法找到变化的节点，改变节点的内容实现更新。
     -  Vue3 标记模板中的静态内容，区别了模板中的静态和动态节点。更新时，只diff操作动态的内容
  -  优化slots的生成
  -  静态提升
     -  当 Vue 的编译器在编译过程中，发现了一些不会变的节点或者属性，就会给这些节点打上一个静态标记。然后编译器在生成代码字符串的过程中，会发现这些静态的节点，并提升它们，将他们序列化成字符串，以此减少编译及渲染成本。有时可以跳过一整棵树
     -  vue2中无论元素是否参与更新，每次都会重新创建，然后再渲染。vue3中对于不参与更新点元素，会做静态提升、只会被创建一次，在渲染时直接复用即可
  -  事件缓存对象 cacheHandlers
     -  vue2.x中，绑定事件每次触发都要重新生成全新的function去更新。Vue3中提供了事件缓存对象 cacheHandlers，当 cacheHandlers 开启，会自动生成一个内联函数，同时生成一个静态节点。当事件再次触发时，只需从缓存中调用即可，无需再次更新
  -  基于Proxy的响应式系统
     -  在vue2.X中，使用了Object.defineProperty来实现响应式对象，对于一些复杂的对象，必须循环遍历所有的域值才能劫持每一个属性，这使得组件的初始化非常耗时。同时，这种方式实现的响应式，对于对象来说，新增的属性（原先对象中没有存在的）需要通过this.$set() 等方式进行处理，才会具有响应式。
     -  vue3中通过使用Proxy，解决了上述问题，使得不用针对每个属性来一一进行添加，减少开销提升性能

- 更小：
  - 通过摇树优化核心库体积，开发时没有使用到的Vue特性不会被打包进代码
    - 在2.x版本中，很多函数都挂载在全局Vue对象上，比如nextTick、nextTick、nextTick、set等函数，因此虽然我们可能用不到，但打包时只要引入了vue这些全局函数仍然会打包进bundle中。
    - 而在Vue3中，所有的API都通过ES6模块化的方式引入，这样就能让webpack或rollup等打包工具在打包时对没有用到API进行剔除，最小化bundle体积

- 更容易维护：
  - TypeScript + 模块化

- 更加友好
  - 跨平台：编译器核心和运行时核心与平台无关，使得Vue更容易与任何平台（Web、Android、iOS）一起使用

- 更容易使用
  - 改进的TypeScript支持，编辑器能提供强有力的类型检查和错误及警告
  - 更好的调试支持
  - 独立的响应化模块
  - Composition API



#### Vue3的diff优化

先从前往后比较，当节点不同时，不再往后进行比较。接着又从后往前进行比较，当节点不同时，不再往前进行比较。

经过预处理之后，最后利用 “最长递增子序列”，完成差异部分的比较，提高 diff 效率



`Vue 3.0`中会在创建虚拟`DOM`的时候将会变化的内容进行**静态标记**，通过 `PatchFlags` 枚举定义了标记标识一个节点，这样`diff`算法的时候直接对比**有标记的**，对比的少了自然而然速度就**变快**了。

在`Vue 2.x`中无论元素是否参与更新每次都会重新创建，然后渲染,这对于性能肯定是会有些许损耗。Vue3中`静态提升`会把不参与更新的静态元素给提升出来，就是类似把变量变成常量`不进行重新创建`。

vue2.x中，绑定事件每次触发都要重新生成全新的function去更新。Vue3中提供了事件缓存对象 cacheHandlers，当 cacheHandlers 开启，会自动生成一个内联函数，同时生成一个静态节点。当事件再次触发时，只需从缓存中调用即可，无需再次更新




#### Vue3生命周期

vue3中，新增了一个`setup`生命周期函数，setup执行的时机是在`beforeCreate`生命函数之前执行，因此在这个函数中是不能通过`this`来获取实例的；同时为了命名的统一，将`beforeDestroy`改名为`beforeUnmount`，`destroyed`改名为`unmounted`

- beforeCreate（建议使用setup代替）
- created（建议使用setup代替）
- setup
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

通过在生命周期函数前加`on`来访问组件的生命周期

- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted
- onErrorCaptured
- onRenderTracked
- onRenderTriggered



#### Vue3为什么不需要时间切片？

主要还是优缺点的权衡问题

在Web应用程序中，丢帧更新通常是由于 同步的高CPU时间 和 原生DOM更新 造成的

时间切片是在CPU工作期间保持应用响应的一种方式，它只对CPU工作产生影响。因为 DOM的更新必须是同步的，以确保最终DOM状态一致

所以，想象两种丢帧更新的场景：

1. CPU工作时间在16ms以内，但是需要做大量原生DOM更新操作。这种情况下不管有没有使用时间切片，应用依旧会感觉到掉帧
2. CPU任务非常繁重，需要超过16ms的时间。理论上时间切片开始发挥作用了。然而，HCI研究表明，除非它在进行动画，否则对于正常的用户交互，大多数人对于100毫秒内的更新是感觉不到有什么不同的。

也就是说，只有在频繁进行超过100ms的纯CPU任务更新时，时间切片才有实际作用

React经常会出现这种情况：

- React的虚拟DOM操作天生就比较慢，因为它使用了大量的Fiber架构

- React使用JSX来渲染函数相对较于用模板来渲染更加难以优化，模板更易于静态分析

- React Hooks将大部分组件树级优化（即防止不必要的子组件的重新渲染）留给了开发人员，开发人员在大多数情况下需要显式地使用`useMemo`。而且，不管什么时候React接收到了`children`属性，它几乎总要重新渲染，因为每次的子组件都是一棵新的vdom树。也意味着，一个使用Hook的React应用在默认配置下会过度渲染。更糟的是，像`useMomo`这类优化不能轻易地自动应用，因为：
  - 它需要正确的deps数组
  - 盲目地任意使用它可能会阻塞本该进行的更新，类似与`PureComponent`

大多数开发人员都很懒，不会积极地优化他们的应用。所以大多数使用Hook的React应用会做很多不必要的CPU工作，所以react需要时间切片

上面的问题对比Vue来说：

- Vue本质上更简单，因此虚拟DOM操作更快（没有时间切片-> 没有`fiber`-> 更少的开销）

- Vue通过分析模板进行了大量的AOT优化，减少了虚拟DOM操作的基本开销。Vue3原生执行速度甚至比Svelte更快，在CPU上花费时间不到React的1/10

- 智能组件树级优化通过响应式跟踪，将插槽编译成函数（避免子元素重复渲染）和自动缓存内联句柄（避免内联函数重复渲染）。除非必要，否则子组件永远不需要重新渲染。这一切并不需要开发人员进行任何手动优化。这也意味着对于同一个更新，React应用可能造成多个组件重新渲染，但在Vue中大部分情况下只会导致一个组件重新渲染

默认情况下， Vue3应用比React应用花费更少的CPU工作时间， 并且CPU工作时间超过100ms的机会大幅度减少了，除非在一些极端的情况下，DOM可能成为更主要的瓶颈

与此同时，**时间切片或者说并发模式（时间切片即并发模式的一个子特性）还带来了另一个问题**：

时间切片使得框架安排并协调了所有更新，它在优先级、失效、重新实例化等方面产生了大量额外的复杂性。所有这些逻辑处理都不可能被`tree-shaken`，这将导致运行时基线的大小膨胀。即使包含了`Suspense`和所有的`tree-shaken`，Vue 3的运行时仍然只有当前React + React DOM的1/4大小

时间切片提供一个新方法解决某一类问题(尤其是相关协调异步状态转换),但时间切片解决了React中比其他框架更突出的问题，同时也带来了成本。对于Vue 3来说，这种权衡是不值得的





## 打包构建编译

#### vite/rollup/webpack/gulp的对比

Rollup（https://rollupjs.org） 是一个和Webpack很类似但专注于ES6的模块打包工具。它的亮点在于，能针对ES6源码进行Tree Shaking，以去除那些已被定义但没被使用的代码并进行Scope Hoisting，以减小输出文件的大小和提升运行性能。然而Rollup的这些亮点随后就被Webpack模仿和实现。但是Rollup其打包出来的代码更小、更快，应用场景在框架、组件库、生成单一umd文件的场景

Webpack（https://webpack.js.org） 是一个打包模块化JavaScript的工具，在Webpack里一切文件皆模块，通过Loader转换文件，通过Plugin注入钩子，最后输出由多个模块组合成的文件。Webpack专注于构建模块化项目，所以应用场景是应用程序开发

Gulp（http://gulpjs.com） 是一个基于流的自动化构建工具，Gulp的最大特点是引入了流的概念，同时提供了一系列常用的插件去处理流，流可以在插件之间传递，应用场景在于静态资源密集型场景，如css、img等静态资源整合

vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。。由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。。在HMR（热更新）方面，当改动了一个模块后，vite仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。。当需要打包到生产环境时，vite使用传统的rollup（也可以自己手动安装webpack来）进行打包，2.0中切换到了esbuild，esbuild是go编写的2，因此，vite的主要优势在开发阶段。另外，由于vite利用的是ES Module，因此在代码中（除了vite.config.js里面，这里是node的执行环境）不可以使用CommonJS



#### babel 编译原理

`Babel` 是一个 `JavaScript` 编译器

Babel 的编译过程和大多数其他语言的编译器相似，可以分为三个阶段：

- 解析（Parsing）：将代码字符串解析成抽象语法树。

  - `Babel` 拿到源代码会把代码抽象出来，变成 `AST` （抽象语法树），全称是 **Abstract Syntax Tree**。抽象语法树是源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构，只所以说是抽象的，是因为抽象语法树并不会表示出真实语法出现的每一个细节，比如说，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现，它们主要用于源代码的简单转换。
  - AST抽象生成过程：分词、语法分析
  - 分词：将整个代码字符串分割成语法单元数组（语法单元通俗点说就是代码中的最小单元，不能再被分割，就像原子是化学变化中的最小粒子一样。`Javascript` 代码中的语法单元主要包括以下这么几种：）
    - 关键字：`const`、 `let`、  `var` 等
    - 标识符：可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些常量
    - 运算符
    - 数字
    - 空格
    - 注释：对于计算机来说，知道是这段代码是注释就行了，不关心其具体内容
  - 语法分析：建立分析语法单元之间的关系
    - 语义分析则是将得到的词汇进行一个立体的组合，确定词语之间的关系。考虑到编程语言的各种从属关系的复杂性，语义分析的过程又是在遍历得到的语法单元组，相对而言就会变得更复杂。
    - 简单来说语法分析是对语句和表达式识别，这是个递归过程，在解析中，`Babel`  会在解析每个语句和表达式的过程中设置一个暂存器，用来暂存当前读取到的语法单元，如果解析失败，就会返回之前的暂存点，再按照另一种方式进行解析，如果解析成功，则将暂存点销毁，不断重复以上操作，直到最后生成对应的语法树。

- 转换（Transformation）：对抽象语法树进行转换操作，访问 AST 的节点进行变换操作生产新的 AST。

  - ##### **Plugins**

    - ##### 插件应用于 `babel` 的转译过程，尤其是第二个阶段 `Transformation`，如果这个阶段不使用任何插件，那么 `babel` 会原样输出代码。

  - ##### **Presets**

    - ##### `Babel` 官方帮我们做了一些预设的插件集，称之为 `Preset`，这样我们只需要使用对应的 Preset 就可以了。每年每个 `Preset` 只编译当年批准的内容。而 `babel-preset-env` 相当于 ES2015 ，ES2016 ，ES2017 及最新版本。

  - ##### **Plugin/Preset 排序**（如果两次转译都访问相同的节点，则转译将按照 Plugin 或 Preset 的规则进行排序然后执行。）

    - Plugin 会运行在 Preset 之前。
    - Plugin 会从第一个开始顺序执行。
    - Preset 的顺序则刚好相反(从最后一个逆序执行)。

- 生成（Code Generation）: 根据变换后的抽象语法树再生成代码字符串。

  - 用 `babel-generator` 通过 AST 树生成 ES5 代码



简单：

- 解析：将代码转换成 AST
  - 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
  - 语法分析：分析token流(上面生成的数组)并生成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST
  - Taro就是利用 babel 完成的小程序语法转换
- 生成：以新的 AST 为基础生成代码





## Vite

#### vite快的原因

一个基于浏览器原生 ES `imports` 的开发服务器。 利用浏览器去解析 `imports`，在服务器端按需编译返回，完全跳过了打包这个概念， 服务器随起随用。 同时不仅有 `Vue` 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。 针对生产环境则可以把同一份代码用 `rollup` 打包。


- ES module 减少服务启动时间
  - 由于大多数现代浏览器都支持上面的 ES module 语法，所以在开发阶段，我们就不必对其进行打包，这节省了大量的服务启动时间。另外，vite 按需加载当前页面所需文件，一个文件一个http请求，进一步减少启动时间

- 缓存减少页面更新时间
  - 每个文件通过 http 头缓存在浏览器端，当编辑完一个文件，只需让此文件缓存失效。当基于 ES module 进行热更新时，仅需更新失效的模块，这使得更新时间不随包的增大而增大





## Webpack

#### 常见的Loader？

- `raw-loader`：加载文件原始内容（utf-8）
- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试
- `svg-inline-loader`：将压缩后的 SVG 内容注入代码中
- `image-loader`：加载并且压缩图片文件
- `json-loader` 加载 JSON 文件（默认包含）
- `handlebars-loader`: 将 Handlebars 模版编译成函数并返回
- `babel-loader`：把 ES6 转换成 ES5
- `ts-loader`: 将 TypeScript 转换成 JavaScript
- `awesome-typescript-loader`：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
- `sass-loader`：将SCSS/SASS代码转换成CSS
- `css-loader`：加载 CSS，支持模块化、压缩、文件导入等特性
- `style-loader`：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码
- `tslint-loader`：通过 TSLint检查 TypeScript 代码
- `mocha-loader`：加载 Mocha 测试用例的代码
- `coverjs-loader`：计算测试的覆盖率
- `vue-loader`：加载 Vue.js 单文件组件
- `i18n-loader`: 国际化
- `cache-loader`: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里



#### 常见的Plugin？

- `define-plugin`：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
- `ignore-plugin`：忽略部分文件

- `html-webpack-plugin`：简化 HTML 文件创建 (依赖于 html-loader)

- `web-webpack-plugin`：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用

- `uglifyjs-webpack-plugin`：不支持 ES6 压缩 (Webpack4 以前)

- `terser-webpack-plugin`: 支持压缩 ES6 (Webpack4)

- `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度

- `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)

- `serviceworker-webpack-plugin`：为网页应用增加离线缓存功能

- `clean-webpack-plugin`: 目录清理

- `ModuleConcatenationPlugin`: 开启 Scope Hoisting

- `speed-measure-webpack-plugin`: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)

- `webpack-bundle-analyzer`: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)



#### Loader和Plugin的区别？

`Loader` 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官的存在，对其他类型的资源进行转译的预处理工作。

`Plugin` 就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

`Loader` 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性

`Plugin` 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入



#### 你用过哪些可以提高效率的webpack插件？

- `webpack-dashboard`：可以更友好的展示相关打包信息。

- `webpack-merge`：提取公共配置，减少重复配置代码

- `speed-measure-webpack-plugin`：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。

- `size-plugin`：监控资源体积变化，尽早发现问题

- `HotModuleReplacementPlugin`：模块热替换



#### SourceMap是什么？怎么在生产环境用它？

`source map` 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map

map文件只要不打开开发者工具，浏览器是不会加载的

线上环境一般有三种处理方案：

- `hidden-source-map`：借助第三方错误监控平台 Sentry 使用
- `nosources-source-map`：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
- `sourcemap`：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 `inline-` 和 `eval-`，因为它们会增加 bundle 体积大小，并降低整体性能



#### Webpack构建流程？

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- `初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- `开始编译`：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- `确定入口`：根据配置中的 entry 找出所有的入口文件
- `编译模块`：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- `完成模块编译`：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- `输出资源`：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- `输出完成`：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

**简单说就是**

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中



#### Webpack模块打包原理？

Webpack 实际上只是为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致

只是把依赖的模块转化成可以代表这些包的静态文件。并不是什么 commonjs 或者 amd 之类的模块化规范。webpack 就是识别入口文件和模块依赖，来打包代码。至于代码使用的是 commonjs 还是 amd 或者 es6 的 import。webpack 都会对其进行分析。来获取代码的依赖。webpack做的就是分析代码，转换代码，编译代码，输出代码。

webpack本身是一个node的模块，所以webpack.config.js是以commonjs形式书写的(node中的模块化是commonjs规范的)



#### 文件监听原理？

在发现源码发生变化时，自动重新构建出新的输出文件

Webpack开启监听模式，有两种方式：

- 启动 webpack 命令时，带上 --watch 参数
- 在配置 webpack.config.js 中设置 watch:true

缺点：每次需要手动刷新浏览器

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 后再执行。

```js
module.export = {
    // 默认false,也就是不开启
    watch: true,
    // 只有开启监听模式时，watchOptions才有意义
    watchOptions: {
        // 默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll:1000
    }
}
```



#### Webpack热更新原理?

`Webpack` 的热更新又称热替换（`Hot Module Replacement`），缩写为 `HMR`。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 `Websocket`，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 `Ajax` 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 `jsonp` 请求获取该chunk的增量更新

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像`react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR



#### 如何对bundle体积进行监控和分析?

`VSCode` 中有一个插件 `Import Cost` 可以帮助我们对引入模块的大小进行实时监测，还可以使用 `webpack-bundle-analyzer` 生成 `bundle` 的模块组成图，显示所占体积。

`bundlesize` 工具包可以进行自动化资源体积监控。



#### 什么是文件指纹？

文件指纹是打包后输出的文件名的后缀。

- `Hash`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- `Chunkhash`：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- `Contenthash`：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变





#### 如何保证各个loader按照预想方式工作?

实际工程中，配置文件上百行乃是常事，为了保证各个 loader 按照预想方式工作 ，可以使用 `enforce` 强制执行 `loader` 的作用顺序，`pre` 代表在所有正常 loader 之前执行，`post` 是所有 loader 之后执行。(inline 官方不推荐使用)



#### 如何优化 Webpack 的构建速度？

- `多进程/多实例构建`：HappyPack(不维护了)、thread-loader
- 压缩代码
  - 多进程并行压缩
    - webpack-paralle-uglify-plugin
    - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)
    - terser-webpack-plugin 开启 parallel 参数
  - 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS
- 图片压缩
  - 使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)
  - 配置 image-webpack-loader
- 缩小打包作用域
  - exclude/include (确定 loader 规则范围)
  - resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
  - resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
  - resolve.extensions 尽可能减少后缀尝试的可能性
  - noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
  - IgnorePlugin (完全排除模块)
  - 合理使用alias
- 提取页面公共资源
  - 基础包分离
    - 使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中
    - 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件
- DLL
  - 使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。
  - HashedModuleIdsPlugin 可以解决模块数字id问题
- 充分利用缓存提升二次构建速度
  - babel-loader 开启缓存
  - terser-webpack-plugin 开启缓存
  - 使用 cache-loader 或者 hard-source-webpack-plugin
- Tree shaking
  - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率
  - 禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking
  - 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
    - purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)
- Scope hoisting
  - 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
  - 必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法
- 动态Polyfill
  - 建议采用 polyfill-service 只给用户返回需要的polyfill，社区维护。 (部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)



#### 是否写过Loader？编写loader的思路？

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情

- Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用
- Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据
- 尽可能的异步化 Loader，如果计算量很小，同步也可以
- Loader 是无状态的，我们不应该在 Loader 中保留状态
- 使用 loader-utils 和 schema-utils 为我们提供的实用工具
- 加载本地 Loader 方法
  - Npm link
  - ResolveLoader



#### 是否写过Plugin？编写Plugin的思路？

webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段执行想要添加的自定义功能。Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好

- compiler 暴露了和 Webpack 整个生命周期相关的钩子
- compilation 暴露了与模块和依赖有关的粒度更小的事件钩子
- 插件需要在其原型上绑定apply方法，才能访问 compiler 实例
- 传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
- 找出合适的事件点去完成想要的功能
  - emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
  - watch-run 当依赖的文件发生变化时会触发
- 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住







## 前端性能优化

Vue相关

代码层面：

- 路由懒加载
- keep-alive缓存页面
- 使用v-show复用DOM
- v-for 遍历避免同时使用 v-if
- 长列表性能优化
  - 纯粹的数据展示，不会有任何改变，就不需要做响应化
  - 大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容
- Vue 组件销毁会自动解绑它的全部指令及事件监听器，但仅限于组件本身事件，像timer等需beforeDestroy时销毁
- 图片懒加载
- 第三方插件（如element组件）按需引入
- 无状态的组件标记为函数式组件
- 变量本地化（不需要双向绑定的变量本地声明）
- 对SEO有要求就SSR

Webpack层面：

- Webpack 对图片进行压缩
- 减少 ES6 转为 ES5 的冗余代码
- 提取公共代码
- 模板预编译
- 提取组件的 CSS
- 优化 SourceMap
- 构建结果输出分析
- Vue 项目的编译优化

Web技术优化：

- 开启 gzip 压缩
- 浏览器缓存
- 使用 `cdn` 文件来减少工程到打包体积，也可以按需加载
- 使用 `Chrome Performance` 查找性能瓶颈

**preload**

`preload` 页面加载的过程中，在浏览器开始主体渲染之前加载。

**prefetch**

`prefetch` 页面加载完成后，利用空闲时间提前加载。

**dns-prefetch**

页面加载完成后，利用空闲时间提前加载。



**异步无阻塞加载JS**

异步加载 js 文件，并且不会阻塞页面的渲染

**defer**

1. 不阻止解析 document， 并行下载 d.js, e.js
2. 即使下载完 d.js, e.js 仍继续解析 document
3. 按照页面中出现的顺序，在其他同步脚本执行后，DOMContentLoaded 事件前 依次执行 d.js, e.js。

**async**

1. 不阻止解析 document, 并行下载 b.js, c.js
2. 当脚本下载完后立即执行。（两者执行顺序不确定，执行阶段不确定，可能在 DOMContentLoaded 事件前或者后 ）



**感知性能优化**

loading

骨架屏



## 前端安全

#### XSS

XSS是跨站脚本攻击（Cross-Site Scripting）的简称

XSS有几种不同的分类办法，例如按照恶意输入的脚本是否在应用中存储，XSS被划分为“存储型XSS”和“反射型XSS”，如果按照是否和服务器有交互，又可以划分为“Server Side XSS”和“DOM based XSS”。



防御XSS最佳的做法就是对数据进行严格的输出编码，使得攻击者提供的数据不再被浏览器认为是脚本而被误执行。例如`<script>`在进行HTML编码后变成了`<script>`，而这段数据就会被浏览器认为只是一段普通的字符串，而不会被当做脚本执行了。



#### CSRF

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

一个典型的CSRF攻击有着如下的流程：

- 受害者登录a.com，并保留了登录凭证（Cookie）。
- 攻击者引诱受害者访问了b.com
- b.com 向 a.com发送了一个请求：a.com/act=xx。浏览器会…
- a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。
- a.com以受害者的名义执行了act=xx。
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。

特点：

- 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生。

- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据。

- 整个过程攻击者并不能获取到受害者的登录凭证（Cookie等信息），仅仅是“冒用”。

- 跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。

CSRF通常是跨域的，因为外域通常更容易被攻击者掌控。但是如果本域下有容易被利用的功能，比如可以发图和链接的论坛和评论区，攻击可以直接在本域下进行，而且这种攻击更加危险。

防护：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - CSRF Token
  - 双重Cookie验证

##### **同源检测**

在HTTP协议中，每一个异步请求都会携带两个Header，用于标记来源域名：

- Origin Header
  - 302重定向之后Origin不包含在重定向的请求中
  - IE 11 不会在跨站CORS请求上添加Origin标头，Referer头将仍然是唯一的标识
- Referer Header

这两个Header在浏览器发起请求时，大多数情况会自动带上，并且不能由前端自定义内容。 服务器可以通过解析这两个Header中的域名，确定请求的来源域。

##### **Samesite Cookie**

防止CSRF攻击的办法已经有上面的预防措施。为了从源头上解决这个问题，Google起草了一份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite 有两个属性值，分别是 Strict 和 Lax

**Strict：**这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie

**Lax：**为宽松模式，比 Strict 放宽了点限制：假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个GET请求，则这个Cookie可以作为第三方Cookie。用户在不同网站之间通过链接跳转是不受影响了，但假如这个请求是从 a.com发起的对 b.com的异步请求，或者页面跳转是通过表单的 post 提交触发的，也不可以

Samesite 不支持子域。导致了当我们网站有多个子域名时，不能使用SamesiteCookie在主域名存储用户登录信息。每个子域名都需要用户重新登录一次

##### **CSRF Token**

前面讲到CSRF的另一个特征是，攻击者无法直接窃取到用户的信息（Cookie，Header，网站内容等），仅仅是冒用Cookie中的信息。

而CSRF攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个CSRF攻击者无法获取到的Token。服务器通过校验请求是否携带正确的Token，来把正常的请求和攻击的请求区分开，也可以防范CSRF的攻击。

##### **双重Cookie验证**

在会话中存储CSRF Token比较繁琐，而且不能在通用的拦截上统一处理所有的接口。

那么另一种防御措施是使用双重提交Cookie。利用CSRF攻击不能获取到用户Cookie的特点，我们可以要求Ajax和表单请求携带一个Cookie中的值。







#### iframe

iframe中的内容是由第三方来提供的，默认情况下他们不受我们的控制，他们可以在iframe中运行JavaScirpt脚本、Flash插件、弹出对话框等等，这可能会破坏前端用户体验

HTML5中，iframe有了一个叫做sandbox的安全属性，通过它可以对iframe的行为进行各种限制，充分实现“最小权限“原则。使用sandbox的最简单的方式就是只在iframe元素中添加上这个关键词就好

sandbox还忠实的实现了“Secure By Default”原则，也就是说，如果你只是添加上这个属性而保持属性值为空，那么浏览器将会对iframe实施史上最严厉的调控限制，基本上来讲就是除了允许显示静态资源以外，其他什么都做不了。比如不准提交表单、不准弹窗、不准执行脚本等等，连Origin都会被强制重新分配一个唯一的值，换句话讲就是iframe中的页面访问它自己的服务器都会被算作跨域请求。

另外，sandbox也提供了丰富的配置参数，我们可以进行较为细粒度的控制。一些典型的参数如下：

- allow-forms：允许iframe中提交form表单
- allow-popups：允许iframe中弹出新的窗口或者标签页（例如，window.open()，showModalDialog()，target=”_blank”等等）
- allow-scripts：允许iframe中执行JavaScript
- allow-same-origin：允许iframe中的网页开启同源策略



#### 点击劫持

在通过iframe使用别人提供的内容时，我们自己的页面也可能正在被不法分子放到他们精心构造的iframe或者frame当中，进行点击劫持攻击。

这是一种欺骗性比较强，同时也需要用户高度参与才能完成的一种攻击。通常的攻击步骤是这样的：

1. 攻击者精心构造一个诱导用户点击的内容，比如Web页面小游戏
2. 将我们的页面放入到iframe当中
3. 利用z-index等CSS样式将这个iframe叠加到小游戏的垂直方向的正上方
4. 把iframe设置为100%透明度
5. 受害者访问到这个页面后，肉眼看到的是一个小游戏，如果受到诱导进行了点击的话，实际上点击到的却是iframe中的我们的页面

点击劫持的危害在于，攻击利用了受害者的用户身份，在其不知情的情况下进行一些操作

有多种防御措施都可以防止页面遭到点击劫持攻击，例如Frame Breaking方案。一个推荐的防御方案是，使用X-Frame-Options：DENY这个HTTP Header来明确的告知浏览器，不要把当前HTTP响应中的内容在HTML Frame中显示出来。
