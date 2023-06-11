# JS 脚本延迟加载的方式有哪些？


## 题干

- 脚本延迟加载
## 题解

- 使用 `defer` 属性：将 `script` 标签的 `defer` 属性设置为 `true`，可以让浏览器在 `HTML` 文档解析完成后再加载 `JS` 文件，不会阻止页面的渲染。

- 使用 `async` 属性：将 `script` 标签的 `async` 属性设置为 true，可以让浏览器在 `HTML` 文档解析过程中异步加载 `JS` 文件，不会阻止页面的渲染。但是，异步加载的脚本并不能保证加载顺序，可能会导致一些依赖关系的问题。

- 动态创建 `script` 标签：通过 `JS` 动态创建 `script` 标签，并将其插入到 `HTML` 文档中，可以实现按需加载 `JS` 文件。

- 使用模块化加载器：使用像 `RequireJS` 或者 `SystemJS` 这样的模块化加载器，可以将 `JS` 文件按需加载，并且保证依赖关系的正确性。

- 将 `script` 脚本放到页面底部加载。

## 扩展

### 延迟加载监听方案

动态创建 `script` 标签前

- 使用 `setTimeout` 或 `requestAnimationFrame` 函数，将脚本的加载和执行放在一个定时器或动画帧的回调函数中，这样可以延迟一定的时间后再执行脚本。

- 使用 `onload` 或 `document.onDOMContentLoaded` 方法，监听页面资源加载完成后加载和执行脚本。

- 使用 `IntersectionObserver API`，创建一个观察器对象，用来监视一个目标元素是否进入视口，当目标元素可见时，触发一个回调函数，加载和执行脚本。

- ...

## 相关

[defer 和 async](../060asynchronous/060110_defer_async.md)

[setTimeout、setInterval、requestAnimationFrame 各有什么特点](../110browser/110010_settimeout_setinterval_requestanimationframe.md)

[window.onload 和 document.onDOMContentLoaded 有什么区别](../110browser/110100_onload_ondomcontentloaded.md)

