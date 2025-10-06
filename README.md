# EFML

![npm](https://img.shields.io/npm/v/efml)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/efml)
![GitHub](https://img.shields.io/github/license/Resornesy/efml)

## EFML is a lightweight HTML extension that adds many programming features to HTML.

## Table of Contents

<!-- toc -->

- [Quick Start](#quick-start)
- [EFML Variables](#efml-variables)
  * [Defining Variables Using the Tag](#defining-variables-using-the--tag)
  * [Use the tag to create global variables.](#use-the--tag-to-create-global-variables)
  * [Using Variables](#using-variables)
  * [Creating and Reading EFML Variables in JavaScript](#creating-and-reading-efml-variables-in-javascript)
- [EFML Data Types](#efml-data-types)
  * [Data Types](#data-types)
- [EFML Function Definition and Execution](#efml-function-definition-and-execution)
  * [Declaring a Function Using the Tag](#declaring-a-function-using-the--tag)
  * [Executing a Function Using the Tag](#executing-a-function-using-the--tag)
  * [Mixing Local Parameters and Global Variables](#mixing-local-parameters-and-global-variables)
- [EFML Slicing](#efml-slicing)
  * [Using the slice method to slice an array](#using-the-slice-method-to-slice-an-array)
  * [Using the slice, substr, and substring methods to slice strings](#using-the-slice-substr-and-substring-methods-to-slice-strings)
- [EFML Conditional Judgment](#efml-conditional-judgment)
  * [Using the , , and tags to create conditional judgments](#using-the---and--tags-to-create-conditional-judgments)
- [EFML Loop](#efml-loop)
  * [Creating a Loop Using the Tag](#creating-a-loop-using-the--tag)
  * [Use the EFML keyword @-break to exit a loop and @-continue to skip a loop.](#use-the-efml-keyword--break-to-exit-a-loop-and--continue-to-skip-a-loop)
- [Using the tag to create iterations](#using-the--tag-to-create-iterations)
- [Common EFML Errors](#common-efml-errors)
- [LICENSE](#license)

<!-- tocstop -->

## Quick Start

```bash
npm i efml
```

```html
<global-var name="msg">"world"</global-var>
<h1 data-dynamic-text>Hello ${#msg}!</h1>
<script src="node_modules/EFML/dist/efml.min.js"></script>
```

Or CDN:
```html
<script src="https://unpkg.com/EFML/dist/efml.min.js></script>
```

**EFML supports using the .estml extension.**

## EFML Variables

### Defining Variables Using the <set-var> Tag

```html
<set-var name="example-var">value</set-var>
```

In the example, the __name__ attribute is the variable name, and __value__ is the variable content.
**Set-var variables are locally scoped by default and are only available within the current tag chain.**

###  Use the <global-var> tag to create global variables.

```html
<global-var name="to-global-var">value</global-var>
```

**Global variables can be used in statements, loops, and functions.**

### Using Variables

After defining a variable, use __${#}__ in HTML to access it. Like this:

```html
<set-var name="a">"你好"</set-var>
<p data-dynamic-text>${#a}</p>
```

The above example will display __你好__.

**The defined variable will be synchronized with other EFML expressions and attributes on the same page.**

### Creating and Reading EFML Variables in JavaScript

In JavaScript scripts on the same page, you can use the __setGlobalVar()__ method to define EFML global variables. Like this:

```html
<script>
// Add EFML variables at any time
setGlobalVar("name", "Alice");  //After definition, all ${#name} variables on the page will be automatically refreshed.

</script>
```

Use the __globalStore.vars__ object to read EFML variables.

```html
<set-var name="counter">0</set-var>
<script>
const c = globalStore.vars.counter ?? 0; // Read the variable
</script>
```

## EFML Data Types

__EFML is compatible with all JavaScript types. __

### Data Types

- String
- Number (including floating-point and complex numbers)
- Array
- Object
- null
- undefined

__Note__: When defining a string variable, you must enclose it in quotes (*""*, *''*, *``*). Like this:

```html
<set-var name="string-var">"hello world"</set-var>
```


## EFML Function Definition and Execution

### Declaring a Function Using the <def-func> Tag

```html
<def-func name="greet">
<span style="color:${#color}">Hello ${#name}!</span>
</def-func>

```

The __name__ attribute is the function name.
**A function can use global variables or local variables passed when calling the function. **

### Executing a Function Using the <exec-func> Tag

```html
<exec-func name="greet" params="name:'Alice',color:'#ff595e'"></exec-func>
```

The __name__ attribute is the name of the function to be called.

The __params__ attribute is the parameters within the function.
**The parameter list format is "parameter name:parameter value". Multiple parameters are separated by commas, and string parameters must be quoted.  **

### Mixing Local Parameters and Global Variables

```html
<global-var name="color">"#333"</global-var>
<def-func name="badge">
<span class="badge" style="background:${#color}">
${#text} <!-- Local -->
</span>
</def-func>

<!-- Call: Local text overrides global color, retains -->
<exec-func name="badge" params="text:'VIP'"></exec-func>
```

In the above example, the global variable __color__ and the local parameter __text__ are used within the function.
** Local parameters override global variables with the same name.  **

## EFML Slicing

### Using the slice method to slice an array

```html
<global-var name="arr">[10,20,30,40,50]</global-var>
<p data-dynamic-text>${#arr.slice(1,4)}</p> <!-- Output: [20,30,40] -->
<p data-dynamic-text>${#arr.slice(-2)}</p> <!-- Output: [40,50] -->
<p data-dynamic-text>${#arr.slice(2)}</p> <!-- Output: [30,40,50] -->
```

**The slice(start,end) method accepts a start index and an end index, and supports negative indexes.  **

### Using the slice, substr, and substring methods to slice strings

```html
<global-var name="str">"Hello, EFML"</global-var>
<p data-dynamic-text>${#str.slice(0,5)}</p> <!-- Hello -->
<p data-dynamic-text>${#str.substr(6,5)}</p> <!-- EFML -->
```

**String slicing methods are similar to arrays, supporting negative indexes and omitted parameters. **
** EFML supports all JavaScript processing methods, so you can also use this feature with objects.  **
Example:

```html
<global-var name="obj">{a:1,b:2,c:3,d:4}</global-var>
<set-var name="wanted">['a','c']</set-var>
<set-var name="sliced">
Object.keys(obj)
.filter(k => wanted.includes(k))
.reduce((r,k) => (r[k]=obj[k],r), {})
</set-var>
<pre data-dynamic-text>${#JSON.stringify(sliced)}</pre>
<!-- Result {"a":1,"c":3} -->
```

**EFML supports chained calls.  **
Example:

```html
<global-var name="data">
[{name:"Tom",age:20},{name:"Lucy",age:18},{name:"Bob",age:22}]
</global-var>
<set-var name="first">
data.filter(o=>o.age>=20).slice(0,1)[0].name
</set-var>
<p>First adult: ${#first}</p> <!-- Tom -->
```

## EFML Conditional Judgment

### Using the <if-jum>, <elif-jum>, and <else-jum> tags to create conditional judgments

```html
<if-jum exp="age>=18">Adult</if-jum>
<elif-jum  exp="age>=12">Teenager</if-jum>
<else-jum>Child</else-jum>
```

The __exp__ parameter accepts an expression. If the expression is true, the HTML block inside the tag is executed.

The __else-jum__ tag represents an HTML block that is executed if all conditions are false.

**Expressions can only accept variables defined before them.**
**Expressions do not accept the import, export, fetch, async, await, class, or function keywords, nor do they accept multiple statements (except for commas).  **

## EFML Loop

### Creating a Loop Using the <while-loop> Tag

```html
<while-loop exp="i<10">
<!-- Auto-increment -->
<set-var name="i">${#i++}</set-var>
<p>i=<span data-dynamic-text>${#i}</span></p>
</while-loop>
```

The __exp__ parameter accepts the same content as __if-jum__ . When the expression is true, the HTML block within the loop is executed; if it is false, the loop is exited.

 ### Use the EFML keyword @-break to exit a loop and @-continue to skip a loop.

**@-break keyword: Directly interrupts a while loop**
**@-continue keyword: Skips the current loop and continues with the next one**

```html
<while-loop exp="i < 10">
<set-var name="i">$ {#i + 1}</set-var>

<!-- Skip this loop if the condition is met -->
<if-jum exp="i == 5">
<span data-loop-control="@-continue"></span>
</if-jum>

<!-- Exit the loop completely if the condition is met -->
<if-jum exp="i == 8">
<span data-loop-control="@-break"></span>
</if-jum>

<p>Current i = <span  data-dynamic-text>${#i}</span></p>
</while-loop>
```

The above example should display:

```text
Current i = 1
Current i = 2
Current i = 3
Current i = 4
Current i = 6 ← Skipped 5
Current i = 7
Current i = 8 ← Terminates after encountering a break, no longer outputting 9 or 10
```

**While-loop loops up to 1000 times**

## Using the <for-loop> tag to create iterations

```html
<for-loop init="i = 0" exp="i < 100" update="i++">
<if-jum exp="i == 5">
<span data-loop-control="@-continue"></span> <!-- Skip i=5 -->
</if-jum>
<if-jum exp="i == 8">
<span  data-loop-control="@-break"></span> <!-- Ends at i=8 -->

</if-jum>
<div>i = ${#i}</div>
</for-loop>

```

The __init__ parameter receives the initial value of the for-loop.

The __exp__ parameter receives an expression and is used in the same way as the __while-loop__ parameter.

The __update__ parameter receives an iteration expression and is executed after each loop iteration.
**Variables defined in the init parameter will be stored in globalStore.vars.**
**Like the while-loop, the for-loop can only iterate a maximum of 1000 times.  **

## Common EFML Errors

| Error Symptom | Cause | Solution |
| :------ | :--- | :----- |
| ${#xxx} still displayed on the page after variable definition | Incorrect scope | Local variables should be in the same tag chain, or define global variables directly |
| Loop only executed once & not executed | Incorrect expression | Modify expression |
| String without quotes | Misread as variable name | String variables must be enclosed in double quotes, single quotes, or backticks |
| Silent function call | Params format error | Use single quotes for key:'value', and no spaces between commas |

## LICENSE

[MIT](./LICENSE)

[Report a bug](https://github.com/Resornesy/EFML/issues)