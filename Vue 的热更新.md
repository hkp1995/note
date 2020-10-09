# Vue 的热更新机制

从`vue-hot-load-api`这个库出发，在浏览器的环境运行 Vue 的热更新示例，主要测试的组件是普通的 vue 组件而不是 functional 等特殊组件，以最简单的流程搞懂热更新的原理。

```js
api.install(Vue);  // 检查 vue 版本的兼容性，兼容2.0.0-alpha.7以下版本的生命周期

if (初始化) {
  api.createRecord('very-unique-id', myComponentOptions);  //  为组件对象通过一个独一无二的 id 建立一个记录
}

// rerender 只有 template 或者 render 函改变的情况下使用。
// 只要把所有相关的实例重新渲染一遍就可以了，而不需要销毁重建他们。这样就可以完整的保持应用的当前状态。
// 它原理是， 用新的 render（template 会编译成 render，所以其实还是 render）替换旧的，然后 forceUpdate。forceUpdate 的时候，render方法会去生成 vnode，然后patch到界面上。
api.rerender('very-unique-id', myComponentOptions);

// --- OR ---

// reload 在 template 或者 render 未改变时使用
// 先销毁然后重新创建它所有的活跃实例（包括它的子组件）
// 它的原理是：利用新传入的配置生成了一个新的组件构造函数 然后对组件上的 Ctor 进行了一系列的赋值，替换成新的配置项。此时，构造函数的 cid 变了。然后 forceUpdate。Vue 在选择更新策略时会调用一个sameVnode方法来决定是要进行打补丁，还是彻底销毁重建。对比时很重要的一点就是比较 tag。原本 cid 为 1，tag 为 vue-component-1。但是 reload 方法偷梁换柱把 Ctor 的 cid 改变后，tag 是就 vue-component-2，会发现两个组件的 tag 不一样，所以就走了销毁 -> 重新创建的流程。

api.reload('very-unique-id', myComponentOptions);

```

以下为源码参考，只保留了重要的部分：

```js

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function(id, options) {
  // 如果已经存储过了就return
  if (map[id]) {
    return;
  }

  // 关键流程 下一步解析
  makeOptionsHot(id, options);

  // 将记录存储在map中
  // instances变量应该不难猜出是vue的实例对象。
  map[id] = {
    options: options,
    instances: [],
  };
};
```

```js
/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  // options 就是我们传入的组件对象
  // initHookName 就是'beforeCreate'
  injectHook(options, initHookName, function() {
    // 这个函数会在beforeCreate声明周期执行
    const record = map[id];
    if (!record.Ctor) {
      // 此时this已经是vue的实例对象了
      // 把组件实例的构造函数赋值给record的Ctor属性。
      record.Ctor = this.constructor;
    }
    // 在instances里存储这个实例。
    record.instances.push(this);
  });
  // 在组件销毁的时候把上面存储的instance删除掉。
  injectHook(options, 'beforeDestroy', function() {
    const instances = map[id].instances;
    instances.splice(instances.indexOf(this), 1);
  });
}

// 往生命周期里注入某个方法
function injectHook(options, name, hook) {
  const existing = options[name];
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook];
}
```

```js
exports.rerender = (id, options) => {
  const record = map[id];
  if (!options) {
    // 如果没传第二个参数 就把所有实例调用 $forceUpdate
    record.instances.slice().forEach(instance => {
      instance.$forceUpdate();
    });
    return;
  }
  record.instances.slice().forEach(instance => {
    // 将实例上的 $options上的render直接替换为新传入的render函数
    instance.$options.render = options.render;
    // 执行 $forceUpdate更新视图
    instance.$forceUpdate();
  });
};
```

```js
exports.reload = function(id, options) {
  const record = map[id];
  if (options) {
    // reload的情况下 传入的options会当做一个新的组件
    // 所以要用makeOptionsHot重新做一下记录
    makeOptionsHot(id, options);
    const newCtor = record.Ctor.super.extend(options);

    newCtor.options._Ctor = record.options._Ctor;
    record.Ctor.options = newCtor.options;
    record.Ctor.cid = newCtor.cid;
    record.Ctor.prototype = newCtor.prototype;
  }
  record.instances.slice().forEach(function(instance) {
    instance.$vnode.context.$forceUpdate();
  });
};
```

## 参考

https://mp.weixin.qq.com/s/00YHMrWlleUPlMeWe1DPhw
