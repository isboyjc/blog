# CSS 盒模型？

CSS3中的盒模型有以下两种：

- 标准盒子模型
- IE盒子模型

![](https://qiniu.isboyjc.com/picgo/202302180241963.png)

盒模型都是由四个部分组成的，分别是margin、border、padding和content。
标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

- 标准盒模型的width和height属性的范围只包含了content，
- IE盒模型的width和height属性的范围包含了border、padding和content。

可以通过修改元素的box-sizing属性来改变元素的盒模型：

- box-sizeing: content-box表示标准盒模型（默认值）
- box-sizeing: border-box表示IE盒模型（怪异盒模型）