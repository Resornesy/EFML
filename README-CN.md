# EFML

![npm](https://img.shields.io/npm/v/efml)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/efml)
![GitHub](https://img.shields.io/github/license/Resornesy/efml)

## EFML是一个轻量化的HTML扩展，给HTML加入了许多编程特性。

## 目录

<!-- toc -->

- [快速上手](#%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B)
- [EFML变量](#efml%E5%8F%98%E9%87%8F)
  * [使用标签定义变量](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%AE%9A%E4%B9%89%E5%8F%98%E9%87%8F)
  * [使用标签创建全局变量](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%88%9B%E5%BB%BA%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F)
  * [使用变量](#%E4%BD%BF%E7%94%A8%E5%8F%98%E9%87%8F)
  * [在JavaScript中创建,读取EFML变量](#%E5%9C%A8javascript%E4%B8%AD%E5%88%9B%E5%BB%BA%E8%AF%BB%E5%8F%96efml%E5%8F%98%E9%87%8F)
- [EFML数据类型](#efml%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
  * [数据类型](#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
- [EFML函数定义与执行](#efml%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89%E4%B8%8E%E6%89%A7%E8%A1%8C)
  * [使用标签声明函数](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%A3%B0%E6%98%8E%E5%87%BD%E6%95%B0)
  * [使用标签执行函数](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0)
  * [局部参数与全局变量混用](#%E5%B1%80%E9%83%A8%E5%8F%82%E6%95%B0%E4%B8%8E%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%E6%B7%B7%E7%94%A8)
- [EFML切片](#efml%E5%88%87%E7%89%87)
  * [使用slice方法进行数组切片](#%E4%BD%BF%E7%94%A8slice%E6%96%B9%E6%B3%95%E8%BF%9B%E8%A1%8C%E6%95%B0%E7%BB%84%E5%88%87%E7%89%87)
  * [使用slice,substr,substring方法进行字符串切片](#%E4%BD%BF%E7%94%A8slicesubstrsubstring%E6%96%B9%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%88%87%E7%89%87)
- [EFML条件判断](#efml%E6%9D%A1%E4%BB%B6%E5%88%A4%E6%96%AD)
  * [使用,,标签创建条件判断](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%88%9B%E5%BB%BA%E6%9D%A1%E4%BB%B6%E5%88%A4%E6%96%AD)
- [EFML循环](#efml%E5%BE%AA%E7%8E%AF)
  * [使用标签创建循环](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%88%9B%E5%BB%BA%E5%BE%AA%E7%8E%AF)
  * [使用EFML关键字@-break退出循环，@-continue跳过循环](#%E4%BD%BF%E7%94%A8efml%E5%85%B3%E9%94%AE%E5%AD%97-break%E9%80%80%E5%87%BA%E5%BE%AA%E7%8E%AF-continue%E8%B7%B3%E8%BF%87%E5%BE%AA%E7%8E%AF)
- [使用标签创建迭代](#%E4%BD%BF%E7%94%A8%E6%A0%87%E7%AD%BE%E5%88%9B%E5%BB%BA%E8%BF%AD%E4%BB%A3)
- [EFML常见错误](#efml%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF)
- [LICENSE](#license)

<!-- tocstop -->

## 快速上手

```bash
npm i EFML
```

```html
<global-var name="msg">"world"</global-var>
<h1 data-dynamic-text>Hello ${#msg}!</h1>
<script src="node_modules/EFML/dist/efml.min.js"></script>
```

或者CDN:
```html
<script src="https://unpkg.com/EFML/dist/efml.min.js></script>
```

**请将<script>标签移动到EFML文档的最下方，防止提前解析。**
**EFML支持使用.efml扩展名。**

## EFML变量

### 使用<set-var>标签定义变量

```html
<set-var name="example-var">value</set-var>
```

示例中的__name__属性是变量名称，__value__是变量内容。
**set-var变量默认局部作用域，仅可当前标签链使用。**

### 使用<global-var>标签创建全局变量

```html
<global-var name="to-global-var">value</global-var>
```

**全局变量可以在判断，循环，函数中使用。**

### 使用变量

在定义了一个变量之后，在html中使用__${#}__使用变量。就像这样:

```html
<set-var name="a">"你好"</set-var>
<p data-dynamic-text>${#a}</p>
```

上述示例将会显示__你好__。
**定义的变量将会与同页面中的其他EFML表达式和属性同步。**

### 在JavaScript中创建,读取EFML变量

在作用于同页面的JavaScript脚本中，可以使用__setGlobalVar()__方法定义EFML全局变量。就像这样:

```html
<script>
  // 在任意的时机添加EFML变量
  setGlobalVar("name", "Alice"); //定义后，页面上的所有${#name}变量自动刷新
</script>
```

使用__globalStore.vars__对象读取EFML变量


```html
<set-var name="counter">0</set-var>
<script>
  const c = globalStore.vars.counter ?? 0; // 读取变量
</script>
```


## EFML数据类型

__EFML兼容JavaScript的所有类型。__

### 数据类型

- 字符串
- 数字(包含浮点数和复数)
- 数组
- 对象
- null
- undefined

__注意__: 当定义一个字符串变量时，必须在标签内加上**引号**(*""*,*''*,*``*)。就像这样:

```html
<set-var name="string-var">"hello world"</set-var>
```

## EFML函数定义与执行

### 使用<def-func>标签声明函数

```html
<def-func name="greet">
  <span style="color:${#color}">Hello ${#name}!</span>
</def-func>
```

__name__属性是函数名称。
**函数内部可以使用全局变量或者在调用函数时传递的局部变量。**

### 使用<exec-func>标签执行函数

```html
<exec-func name="greet" params="name:'Alice',color:'#ff595e'"></exec-func>
```

__name__属性是要调用的函数名称。
__params__属性是函数内部的参数。
**参数列表格式为"参数名:参数值"，多个参数用逗号分隔，字符串参数必须用引号。**

### 局部参数与全局变量混用

```html
<global-var name="color">"#333"</global-var>
<def-func name="badge">
  <span class="badge" style="background:${#color}">
    ${#text}  <!-- 局部 -->
  </span>
</def-func>

<!-- 调用：局部 text 覆盖全局 color 保留 -->
<exec-func name="badge" params="text:'VIP'"></exec-func>
```

上述示例中，函数内部使用了全局变量__color__和局部参数__text__。
**局部参数会覆盖同名全局变量。**


## EFML切片

### 使用slice方法进行数组切片

```html
<global-var name="arr">[10,20,30,40,50]</global-var>
<p data-dynamic-text>${#arr.slice(1,4)}</p>   <!-- 输出[20,30,40] -->
<p data-dynamic-text>${#arr.slice(-2)}</p>    <!-- 输出[40,50] -->
<p data-dynamic-text>${#arr.slice(2)}</p>     <!-- 输出[30,40,50] -->
```

**slice(start,end)方法接收起始索引和结束索引，支持负索引。**

### 使用slice,substr,substring方法进行字符串切片

```html
<global-var name="str">"Hello,EFML"</global-var>
<p data-dynamic-text>${#str.slice(0,5)}</p>      <!-- Hello -->
<p data-dynamic-text>${#str.substr(6,5)}</p>     <!-- EFML -->
```

**字符串切片方法与数组类似，支持负索引和省略参数。**
**EFML支持JavaScript的所有处理方法，因此你还可以用这个特性处理对象。**
示例:

```html
<global-var name="obj">{a:1,b:2,c:3,d:4}</global-var>
<set-var name="wanted">['a','c']</set-var>
<set-var name="sliced">
Object.keys(obj)
  .filter(k => wanted.includes(k))
  .reduce((r,k) => (r[k]=obj[k],r), {})
</set-var>
<pre data-dynamic-text>${#JSON.stringify(sliced)}</pre>
<!-- 结果{"a":1,"c":3} -->
```

**EFML支持链式调用。**
示例:

```html
<global-var name="data">
[{name:"Tom",age:20},{name:"Lucy",age:18},{name:"Bob",age:22}]
</global-var>
<set-var name="first">
data.filter(o=>o.age>=20).slice(0,1)[0].name
</set-var>
<p>第一个成年人：${#first}</p>   <!-- Tom -->
```


## EFML条件判断

### 使用<if-jum>,<elif-jum>,<else-jum>标签创建条件判断

```html
<if-jum exp="age>=18">成年了</if-jum>
<elif-jum exp="age>=12">青少年</if-jum>
<else-jum>儿童</else-jum>
```

__exp__参数接收一个表达式，当表达式为真时，执行标签内部html块。
__else-jum__标签表示当条件判断都为假时执行的html块。

**表达式只能接受定义在自己前面的变量。**
**表达式不接受import,export,fetch,async,await,class,function关键字与多语句块(逗号除外)。**

## EFML循环

### 使用<while-loop>标签创建循环

```html
<while-loop exp="i<10">
  <!-- 自增 -->
  <set-var name="i">${#i++}</set-var>
  <p>i=<span data-dynamic-text>${#i}</span></p>
</while-loop>
```

__exp__参数和__if-jum__接收的内容相同。当表达式为真时，执行循环内的html块，为假时则退出循环。

### 使用EFML关键字@-break退出循环，@-continue跳过循环

**@-break关键字: 直接中断while循环**
**@-continue关键字: 跳过本次循环，继续下一轮循环**

```html
<while-loop exp="i < 10">
  <set-var name="i">$ {#i + 1}</set-var>

  <!-- 条件满足时跳过本次 -->
  <if-jum exp="i == 5">
    <span data-loop-control="@-continue"></span>
  </if-jum>

  <!-- 条件满足时彻底跳出循环 -->
  <if-jum exp="i == 8">
    <span data-loop-control="@-break"></span>
  </if-jum>

  <p>当前 i = <span data-dynamic-text>${#i}</span></p>
</while-loop>
```

上述示例应显示:

```text
当前 i = 1
当前 i = 2
当前 i = 3
当前 i = 4
当前 i = 6   ← 跳过了 5
当前 i = 7
当前 i = 8   ← 遇到 break 后终止，不再输出 9、10
```

**while-loop循环最多1000次**


## 使用<for-loop>标签创建迭代

```html
<for-loop init="i = 0" exp="i < 100" update="i++">
  <if-jum exp="i == 5">
    <span data-loop-control="@-continue"></span>  <!-- 跳过 i=5 -->
  </if-jum>
  <if-jum exp="i == 8">
    <span data-loop-control="@-break"></span>     <!-- 到 i=8 就结束 -->
  </if-jum>
  <div>i = ${#i}</div>
</for-loop>
```

__init__参数接收for-loop的__初始值__。
__exp__参数接收表达式，用法与__while-loop__相同。
__update__参数接收迭代表达式，在每轮循环后执行。
**init参数定义的变量将会落到globalStore.vars中。**
**与while-loop一样，for-loop迭代最多1000次。**


## EFML常见错误

| 错误现象 | 原因 | 解决方式 |
| :------ | :--- | :----- |
| 定义变量后页面仍显示${#xxx} | 作用域不对 | 局部变量应确保在同一标签链，或者直接定义全局变量 |
| 循环只执行一次&不执行 | 表达式写错 | 修改表达式 |
| 字符串没有引号 | 被当成变量名 | 字符串变量必须包括双引号或单引号或反引号 |
| 函数调用静默 | params格式错误 | key:'value'用单引号，逗号无空格 |


## LICENSE

[MIT](./LICENSE)

[报告bug](https://github.com/Resornesy/EFML/issues)