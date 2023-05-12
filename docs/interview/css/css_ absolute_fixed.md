# absolute 与 fixed 区别？

共同点：

- 改变行内元素的呈现方式，将display置为inline-block 
- 使元素脱离普通文档流，不再占据文档物理空间
- 覆盖非定位文档元素

不同点：

- abuselute与fixed的根元素不同，abuselute的根元素可以设置，fixed根元素是浏览器。
- 在有滚动条的页面中，absolute会跟着父元素进行移动，fixed固定在页面的具体位置。