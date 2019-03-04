class Dep {
  constructor() {
    this.subs = []// 存放所有的watcher
  }
  // 添加订阅
  addSub(watcher) {
    this.subs.push(watcher)
  }
  // 发布
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    this.oldValue = this.get()
  }
  get() {
    Dep.target = this
    const value = CompileUtil.getValue(this.vm, this.expr)
    Dep.target = null
    return value
  }
  update() {
    const newValue = CompileUtil.getValue(this.vm, this.expr)
    if (newValue !== this.oldValue) {
      this.cb(newValue)
    }
  }
}

class Observer {
  constructor(data) {
    this.observer(data)
  }
  observer(data) {
    if (data && typeof data === "object") {
      for (const key in data) {
        this.defineReactive(data, key, data[key])
      }
    }
  }
  defineReactive(obj, key, value) {
    this.observer(value)
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get: () => {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: (newValue) => {
        if (value !== newValue) {
          this.observer(newValue)
          value = newValue
          dep.notify()
        }
      }
    })
  }
}

class Compiler {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    const fragment = this.node2fragment(this.el)
    this.compile(fragment)

    this.el.appendChild(fragment)
  }
  compile(node) {
    const childNodes = node.childNodes
    childNodes.forEach(child => {
      if (this.isElementNode(child)) {
        this.compileElement(child)
        this.compile(child)
      } else {
        this.compileText(child)
      }
    })
  }
  isDirective(attrName) {
    return attrName.startsWith("v-")
  }
  compileElement(node) {
    const attributes = node.attributes
    attributes && [...attributes].forEach(attr => {
      const { name, value: expr } = attr
      if (this.isDirective(name)) {
        const [directiveName, eventName] = name.split(":")
        const [, directive] = directiveName.split("-")
        CompileUtil[directive](node, expr, this.vm, eventName)
      }
    })
  }
  compileText(node) {
    const reg = /\{\{(.+?)\}\}/
    const content = node.textContent
    if (reg.test(content)) {
      CompileUtil["text"](node, content, this.vm)
    }
  }
  node2fragment(node) {
    const fragment = document.createDocumentFragment()
    let firstChild = node.firstChild
    while (firstChild) {
      fragment.appendChild(firstChild)
      firstChild = node.firstChild
    }

    return fragment
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
}

const CompileUtil = {
  setValue(vm, expr, value) {
    expr.split(".").reduce((data, current, index, arr) => {
      if (arr.length - 1 === index) {
        data[current] = value
      }
      return data[current]
    }, vm.$data)
  },
  getValue(vm, expr) {
    return expr.split(".").reduce((data, current) => {
      return data[current]
    }, vm.$data)
  },
  model(node, expr, vm) {
    const fn = this.updater["modelUpdaer"]
    new Watcher(vm, expr, (newVal) => { // 给输入框添加观察者模式
      fn(node, newVal)
    })
    node.addEventListener("input", (e) => {
      const value = e.target.value
      this.setValue(vm, expr, value)
    })
    const value = this.getValue(vm, expr)
    fn(node, value)
  },
  on(node, expr, vm, eventName) {
    node.addEventListener(eventName, (e) => {
      vm[expr].call(vm, e)
    })
  },
  html(node, expr, vm) {
    const fn = this.updater["htmlUpdater"]
    new Watcher(vm, expr, (newVal) => { // 给输入框添加观察者模式
      fn(node, newVal)
    })
    const value = this.getValue(vm, expr)
    fn(node, value)
  },
  getContentValue(vm, expr) {
    return expr.replace(/\{\{(.+?)\}\}/, (...args) => {
      return this.getValue(vm, args[1])
    })
  },
  text(node, expr, vm) {
    const fn = this.updater["textUpdater"]
    const content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      new Watcher(vm, args[1], (val) => {
        this.getContentValue(vm, expr)
        fn(node, val)
      })
      return this.getValue(vm, args[1])
    })
    fn(node, content)
  },
  updater: {
    modelUpdaer(node, value) {
      node.value = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    textUpdater(node, value) {
      node.textContent = value
    }
  }
}

class Vue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    const computed = options.computed
    const methods = options.methods

    if (this.$el) {
      // 监听数据的变化
      new Observer(this.$data)
      this.proxyVm(this.$data)
      console.log(computed)
      for (const key in computed) {
        Object.defineProperty(this.$data, key, {
          get: () => {
            return computed[key].call(this)
          }
        })
      }
      for (const key in methods) {
        Object.defineProperty(this, key, {
          get() {
            return methods[key]
          }
        })
      }
      new Compiler(this.$el, this)
    }
  }
  proxyVm(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newValue) {
          data[key] = newValue
        }
      })
    }
  }
}

// export default Vue
