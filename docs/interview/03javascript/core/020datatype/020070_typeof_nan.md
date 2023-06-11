# typeof NaN 的结果是什么？

## 题干

- `typeof NaN`

## 题解

`typeof NaN` 的结果是 `number`。

这是因为 `NaN` 是一个特殊的数值，表示 "不是一个数字"，但它仍然属于数值类型。

根据 `ECMAScript` 规范，`Number` 类型包括了 `NaN`、正无穷、负无穷。所以 `typeof NaN` 返回 `number` 是符合规范的。

`NaN` 通常是一些无效的数学运算的结果，如果想判断一个值是否是 `NaN`，可以使用 `isNaN()` 函数，它返回 `true` 或 `false`。