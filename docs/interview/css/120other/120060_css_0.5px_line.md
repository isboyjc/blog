# CSS 画一条 0.5px 的线思路？

采用 transform: scale() 的方式，该方法用来定义元素的 2D 缩放转换：

```css
transform: scale(0.5,0.5);
```

采用 meta viewport 的方式：

```html
<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"/>
```