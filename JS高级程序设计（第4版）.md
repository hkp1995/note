# JS高级程序设计（第4版）

## 什么是JS

JS 是一门用来与网页交互的脚本语言。包含：

（1）ECMAScript：有 ECMA-262 定义并提供核心功能

（2）文档对象模型DOM：提供与网页内容交互的方法和接口

（3）浏览器对象模型BOM：提供与浏览器交互的方法和接口

## HTML 中的 JS

JS 是通过 `<script>` 元素插入到 HTML 页面中的。可以直接把 JS 代码嵌入到 HTML 页面中，也可以通过设置 src 属性来引入外部的 JS 文件。

所有 `<script>` 元素会依照他们在网页中出现的次序被解释。在不使用 defer 和 async 属性的情况下，包含在 `<script>` 元素中的代码必须严格按次序解释。

对于不推迟执行的脚本，浏览器必须解释完位于 `<script>` 元素中的代码，然后才能继续渲染页面的剩余部分。所以通常将 `<script>` 元素放到 body 的末尾。

defer：告诉浏览器脚本在执行时不会改变页面结构。表现为立即开始下载，但是文档渲染完成后再执行，并且按顺序。

async：告诉浏览器脚本不会修改 DOM，不必等脚本下载和执行完后在加载页面，也不必等该脚本下载和执行后再加载其它脚本。不需要等待其它脚本，也不阻塞文档渲染，而且不一定按顺序。会在页面的 `load` 时间前执行，但可能会在 `DOMContentLoaded` 之前或者之后。

## 语言基础

### var，let 和 const

`var` 是函数作用域，`let` 是块级作用域。

`var` 声明会在作用域中被提升，`let` 不会提升。所以 `let` 声明的变量不能在声明前使用。

`let` 在全局作用域中声明的变量不会成为 `window` 对象的属性，`var` 会。

`const` 与 `let` 基本相同，但是它必须在声明时同时初始化变量，并且之后不可修改。但是如果是一个对象，可以修改对象内部的属性。如果想要整个对象都不能修改，使用 Object.freeze()。

### 数据类型

原始类型：原始值，大小固定，保存在栈上。使用 typeof 确定值的原始类型。

Boolean
Null
Undefined
Number
String
Symbol
BigInt (new in ECMAScript 2019)

复杂类型：引用值，存储在堆上，实际上只包含指向对象的一个指针，而不是对象本身。使用 instanceof 确定值的引用类型。

Object

## 变量、作用域与内存

### 作用域

任何变量都存在与某个作用域中。这个作用域决定了变量的生命周期，以及他们可以访问代码的哪些部分。

全局作用域，函数作用域，块级作用域。

代码执行流没进入一个新的作用域，都会创建一个作用域链，用于搜索变量和函数。

函数或者块的作用域不仅可以访问自己作用域内的变量，而且也可以访问任何包含该作用域乃至全局作用域中的变量。

全局作用域只能访问全局作用域中的变量和函数，不能直接访问局部作用域中的任何数据。

变量的作用域用于确定什么时候色释放内存。

### 垃圾回收

离开作用域的值会被自动标记为可回收，然后在垃圾回收期间被删除。

1. 标记清理

    JS 最常用的垃圾回收策略。

    给当前不使用的值加上标记，再回来回收它们的内存。

2. 引用计数

    对每个值都记录它被引用的次数。垃圾回收程序下次运行时会释放引用数为 0 的值的内存。

    问题：循环引用。解除变量的引用（把变量设置成 null ）可以消除循环引用，对垃圾回收也有帮助。所以全局对象的属性和循环引用都应该在不需要时解除引用。

## 基本引用类型

JS 中的对象称为引用值，几种内置的引用类型可用于创建特定类型的对象。

Date

RegExp

Funciton

原始值包装类型，使得 JS 中的原始值可以被当成对象使用，有 3 种：

Boolean

Number

String

原始值包装类型有如下特点：

每种包装类型都银蛇到同名的原始类型。

以读模式访问原始值时，后台会实例化一个原始值包装类型的对象，借助这个对象可以操作相应数据。

涉及原始值的语句执行完毕后，包装对象就会被销毁。

两个内置对象：Global 和 Math。浏览器将 Global 实现为 window。所有全局变量和函数都在 Global 对象的属性。

## 集合引用类型

Objcet

Array

Map

WeakMap

Set

WeakSet

## 迭代器与生成器

### 迭代器

可迭代对象：实现了正式的 Iterabel 接口，而且可以通过迭代器 Iteator 消费。

任何实现 Iterabel 接口的数据结构都可以被实现 Iterator 接口的结构消费。

迭代器是一种一次性使用的对象。每个迭代器都表示对可迭代对象的一次性有序遍历。

不同迭代器的实例之间没有联系，只会独立遍历可迭代对象。

迭代器并不与可迭代对象的某个时刻的快照绑定。如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应变化。

```js
// 可迭代对象
let arr = ['a', 'b', 'c']

// 迭代工厂函数
console.log(arr[Symbol.iterator]) // ƒ values() { [native code] }

// 迭代器1
let  iter = arr[Symbol.iterator]()
// 迭代器2
let  iter2 = arr[Symbol.iterator]()

console.log(iter) // Object [Array Iterator] {}

console.log(iter.next()) // { value: 'a', done: false }
console.log(iter.next()) // { value: 'b', done: false }
console.log(iter2.next()) // { value: 'a', done: false }
console.log(iter.next()) // { value: 'c', done: false }
console.log(iter.next()) // { value: undefined, done: true }
console.log(iter2.next()) // { value: 'b', done: false }
console.log(iter2.next()) // { value: 'c', done: false }
console.log(iter2.next()) // { value: undefined, done: true }
```

任何实现 Iterator 接口的对象都可以作为迭代器使用。

```js
class Counter {
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator] () {
    let count = 1  // 为了让可迭代对象能都创建多个迭代器，比创建一个迭代器就对应一个新计数器
    let limit = this.limit

    return {
      next() {
        if ( count <= limit) {
          return { done: false, value: count++ }
        } else {
          return { done: true, value: undefined }
        }
      },
      return () { // 迭代器可以有一个可选的 return() 方法，用于提前终止迭代器
        console.log('exit')
        return { done: true }
      }
    }
  }
}

let counter = new Counter(3)

for (let i of counter) {
  console.log(i)
}

// 1
// 2
// 3
```

提前终止迭代器的可能情况：

1. for-of 循环中通过 break、continue、return 或 throw 提前退出
2. 解构操作并未消费所有值

```js

for (let i of counter) {

  if (i > 2) {
    break
  }
  console.log(i)
}

// 1
// 2
// exit


let [a, b] = counter
// 提前退出
```

### 生成器

生成器对象实现了 Iteable 接口，因此可用在任何消费可迭代对象的地方

yield 可以让生成器停止和开始执行。

```js
// *位置不受空格影响，都行
function *genteratorFn() {
  yield 'foo'
  yield 'bar'
  yield 'baz'
}

let generatatorObj = genteratorFn()

console.log(generatatorObj.next()) // { value: 'foo', done: false }
console.log(generatatorObj.next()) // { value: 'bar', done: false }
console.log(generatatorObj.next()) // { value: 'baz', done: false }
console.log(generatatorObj.next()) // { value: undefined, done: true }
```

作用：

1. 生成器对象作为可迭代对象
2. 使用 yield 实现输入输出
3. 产生可迭代对象
4. 使用 yield* 实现递归算法

所有生成器对象都有 return() 和 throw() 方法，用于提前终止生成器。

1. return() 会强制生成器进入关闭状态
2. throw() 会在暂停时，将一个提供的错误注入到生成器对象中，如果错误未被处理，生成器就会关闭。如果生成器函数内部处理了这个错误，则不会关闭，只会跳过对应的 yield。

```js
function *genteratorFn() {
  for (const x of [1, 2, 3]) {
    yield x
  }
}

let g = genteratorFn()

// 1. return
console.log(g.next())    // { value: 1, done: false }
console.log(g.return(4)) // { value: 4, done: true }
console.log(g.next())    // { value: undefined, done: true }
console.log(g.next())    // { value: undefined, done: true }

// 2. throw
console.log(g)  // genteratorFn {<suspended>}
try {
  g.throw('foo')
} catch (e) {
  console.log(e)  // foo
}

console.log(g) // genteratorFn {<closed>}
```

```js
function *genteratorFn() {
  for (const x of [1, 2, 3]) {
    try {
      yield x
    } catch (e) {

      console.log(e)
    }
  }
}

let g = genteratorFn()

console.log(g.next())  // { value: 1, done: false }
g.throw('foo')         // foo
console.log(g.next())  // { value: 3, done: false }
```

## 对象、类与面向对象编程

### 对象属性

1. 数据属性

    Configurable
    Enumberable
    Writable
    Value

2. 访问器属性

    getter 函数
    setter 函数

### 创建对象

1. 工厂模式

    ```js
    function createPerson (name, age) {
      let o = new Object()

      o.name = name
      o.age = age

      o.sayName = function () {
        console.log(this.name)
      }

      return o
    }

    let p1 = createPerson('a', 10)
    let p2 = createPerson('b', 11)

    console.log(p1 instanceof Object) // true
    console.log(p1 instanceof createPerson) // false
    ```

    解决了创建多个类似对象的问题，但是没有解决对象的标识问题（即新创建的对象是什么类型）。

2. 构造函数模式

    ```js
    function Person (name, age) {
      this.name = name
      this.age = age

      this.sayName = function() {
        console.log(this.name)
      }
    }

    let p1 = new Person('a', 10)
    let p2 = new Person('b', 11)

    console.log(p1 instanceof Object) // true
    console.log(p1 instanceof Person) // true
    ```

    与工厂模式的差别：
    - 没有显式的创建对象
    - 属性和方法直接复制给了 this
    - 没有 return
    - 使用 new 操作符

    **使用 new 时会进行如下操作：**

    1. 在内存中创建一个新对象
    2. 新对象的 `[[Prototype]]` 被赋值为构造函数的 `prototype` 属性
    3. 构造函数内部的 this 被复制为这个新对象（即 this 指向新对象）
    4. 执行构造函数内部代码（给新对象添加属性）
    5. 如果构造函数返回非空对象，则返回该对象；否则返回刚创建的对象

    构造函数也是函数，它与普通函数的唯一区别就是调用方式不同。任何函数只要使用 new 操作符调用就是构造函数，不使用 new 是就普通函数。

    ```js
    let person = new Person('a', 25)
    person.sayName()

    Person('b', 20)
    window.sayName() // 调用一个函数而没有明确设置 this 值的情况下（及没有作用对象的方法调用，或者没有使用call()、apply()），this 始终指向 Global 对象

    let o = new Object()
    Person.call(o, 'c', 30)
    o.sayName()
    ```

    好处：相比于工厂模式，它可以确保实例被表示为特定类型， p1 和 p2 也会被认为是 Object 的实例。
    问题：其定义的方法会在每个实例上都创建一遍。不同实例上的函数虽然同名但是却不相等。

    所以通常把函数定义在外面：

    ```js
    function Person (name, age) {
      this.name = name
      this.age = age

      this.sayName = sayName
    }

    function sayName {
      console.log(this.name)
    }
    ```

    虽然解决了函数重复定义的问题，但是全局作用域被污染了，而且代码不能很好的聚集在一起。这个问题可以通过原型模式来解决。

3. 原型模式

    ```js
    function Person () {}

    Person.prototype.name  = 'a'
    Person.prototype.age  = 25
    Person.prototype.friends  = ['f1', 'f2']
    Person.prototype.sayName  = function() {
      console.log(this.name)
    }


    let p1 = new Person()
    let p2 = new Person()
    console.log(p1.sayName === p2.sayName)  // true
    ```

    解决了方法重复定义的问题，但是同时它弱化了想构造函数传递初始参数的能力，会导致所有示例默认都获取相同属性值。但是更大的问题是，属性如果是引用值，会在多个实例中共享修改，这个可能是不希望看到的。

    原型相关概念：

    ```js
    function Person() {}

    // 无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 prototype 属性，指向原型对象
    // 默认情况下，所有原型对象自动获得 constructor 属性，指回与之关联的构造函数
    console.log(typeof Person.prototype) // object
    console.log(Person.prototype)
    // {
    //   constructor: ƒ Person()
    //  __proto__: Object
    // }

    // 构造函数有一个 prototype 引用其原型对象
    // 原型对象也有一个 constructor，引用构造函数
    // 两者相互引用
    console.log(Person.prototype.constructor === Person) // true

    let p1 = new Person()
    let p2 = new Person()

    // 实例、原型对象和构造函数是 3 个完全不同的对象
    console.log(p1 !== Person)
    console.log(p1 !== Person.prototype)
    console.log(Person.prototype !== Person)

    // 实例通过__proto__链接到原型对象。__proto__ 实际上指向 [[Prototype]
    // 构造函数通过 prototype 属性连接到原型对象
    // 实例与构造函数原型有直接的关系，但是实例与构造函数之间没有直接关系
    console.log(p1.__proto__ === Person.prototype)
    console.log(p1.__proto__.constructor === Person)

    // 同一个构造函数创建的示例，共享一个原型对象
    console.log(p1.__proto__ === p2.__proto__)

    console.log(p1 instanceof Person) // true
    console.log(p1 instanceof Object) // true
    console.log(Person.prototype instanceof Object) // true
    ```

    原型链：

4. 盗用构造函数
    优点：
    解决原型包含的引用值导致的继承问题;
    可以在子类构造函数中想弗雷构造函数传参；
    缺点：（同使用构造函数模式自定义类型的问题）
    必须在构造函数中定义方法，函数不能重用；
    子类不能访问父类原型上的方法。

    ```js
    function Super() {
      this.colors = ['red', 'blue', 'yellow']
    }

    function Sub() {
      Super.call(this)
    }

    let instance1 = new Sub()
    instance1.colors.push('black')
    console.log(instance1.colors) // [ 'red', 'blue', 'yellow', 'black' ]

    let instance2 = new Sub()
    console.log(instance2.colors) // [ 'red', 'blue', 'yellow' ]
    ```

5. 组合继承
    综合原型模式和盗用构造函数的优点，是使用最多的继承模式。通过原型链继承共享的属性和方法，通过盗用构造函数继承实例的属性。

    ```js
    function Super (name) {
      this.name = name
      this.colors = ['red', 'blue', 'yellow']
    }

    Super.prototype.sayName = function() {
      console.log(this.name)
    }

    function Sub (name, type) {
      Super.call(this, name)

      this.age = age
    }

    Sub.prototype = new Super()

    Sub.prototype.sayAge = function() {
      console.log(this.age)
    }
    ```

6. 原型式继承

    ```js
    function object (o) {
      function F() {}
      F.prototype = o
      return new F()
    }
    ```

    ES5 添加了 `Object.create()` 将原型式继承的概念规范化了。

    ```js
    let o1 = {
      a: 1,
      list: [1, 2, 3]
    }

    let o2 = Object.create(o1, {
      a: { value: 100},
    })

    console.log(o2.a) // 100
    console.log(o2) // {}
    ```

    适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。但同原型模式一样，属性中包含的引用值会在相关对象间共享。

7. 寄生式继承

    ```js
    function createAnother(original) {
      let clone = object(original)
      clone.sayHi = function() {
        console.log('hi')
      }
      return clone
    }
    ```

    适合主要关注对象，而不在乎类型和构造函数的场景

8. 寄生式组合继承

    组合继承也存在效率问题。最主要的侠侣问题就是父类构造函数始终会被调用两次：创建子类原型时调用，子类构造函数中调用

    ```js
    function inheritPrototype(subType, superType) {
      let prototype = object(superType.prototype)
      prototype.constructor = subType
      subType.prototype = prototype
    }


    function Super (name) {
      this.name = name
      this.colors = ['red', 'blue', 'yellow']
    }

    Super.prototype.sayName = function() {
      console.log(this.name)
    }

    function Sub (name, type) {
      Super.call(this, name)

      this.age = age
    }

    inheritPrototype(Sub, Super)

    Sub.prototype.sayAge = function() {
      console.log(this.age)
    }

    ```

    引用类型继承的最佳模式。

9. class 的 extends

    类定义不能提升，且受块作用域限制。

    类的继承很大程度上是基于原型机制的语法糖。


## 反射与代理

代理和反射提供了拦截并向基本操作嵌入额外行为的能力。具体地说，可以给目标对象定义一个关联的代理对象，而这个代理对象可以作为抽象的目标对象来使用。在对目标对象的各种操作影响目标对象之前，可以在代理对象中对这些操作加以控制。

在代理对象上执行的任何操作实际上都会应用到目标对象。

```js
const target = {
  id:'target'
}

const handler = {};

const proxy = new Proxy(target, handler);

// id 属性会访问同一个值
console.log(target.id);// target
console.log(proxy.id);// target

// 给目标属性赋值会反映在两个对象上
// 因为两个对象访问的是同一个值

target.id = 'foo';

console.log(target.id); // foo

console.log(proxy.id); // foo


//给代理属性赋值会反映在两个对象上
// 因为这个赋值会转移到目标对象
proxy.id = 'bar';
console.log(target.id); // bar
console.log(proxy.id); // bar

// hasOwnProperty()方法在两个地方都会应用到目标对象
console.log(target.hasOwnProperty('id'));// true
console.log(proxy.hasOwnProperty('id')); // true

// Proxy.prototype 是 undefined
// 因此不能使用 instanceof 操作符
console.log(target instanceof Proxy); // TypeRrror: Function ha'undefined' in instanceof check'undefined' in instanceof check
console.log(proxy instanceof Proxy); // TypeRrror: Function ha'undefined' in instanceof check'undefined' in instanceof check


//严格相等可以用来区分代理和目标
console.log(target === proxy) // false
```

### 定义捕获器

捕获器就是在处理程序定义的“基本操作的拦截器”。每次在代理对象上调用这些基本操作时，代理可以在这些操作传播到目标对象之前先调用捕获器函数，从而拦截并修改相应的行为。

