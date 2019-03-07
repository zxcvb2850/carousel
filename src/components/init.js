import { hasTransition, hasTouch, addEvent } from "../utils/dom"
import { isAndroid, isIos, className } from "../utils/env"
import { warn } from "../utils/debug"

const DEFAULT_OPTIONS = {
  /* 是否循环播放 */
  loop: true,
  /* 是否自动轮播 */
  autoPlay: true,
  /* 自动轮播时间 */
  speed: 3000,
  /* 是否使用trans */
  css: true,
  /* 能否点击轮播 */
  click: false,
  /* 是否有箭头 */
  isArrow: false,
  /* 箭头的calssName */
  arrorPrevClass: "swiper-button-prev",
  arrorNextClass: "swiper-button-next",
  /* 轮播图item的className */
  slideClass: ".swiper-slide",
  /* 指示器 */
  isPaginat: false,
  paginatClass: ".swiper-pagination-bullet"
}

export default (Swiper) => {
  /* 初始化基本设置 */
  Swiper.prototype._init = function (options) {
    this._index = 1
    this._timer = null
    this._isAnimation = false
    this._width = this.el.clientWidth
    this.wrapper = this.el.children[0]
    if (!this.wrapper) {
      warn("The wrapper need at least one child element to be wrapper.")
    }
    this.slides = [...this.wrapper.children]
    this._len = this.slides.length
    if (!this.slides && !this._len) {
      warn("Need at least one child element as a carousel.")
    }
    this.slides.forEach(slide => {
      slide.style.width = this._width + "px"
    })

    this._addDOMEvents() // 添加绑定事件
    this._handleOptions(options) // 初始化参数
  }
  /* 初始化参数 */
  Swiper.prototype._handleOptions = function (options) {
    this.options = Object.assign(DEFAULT_OPTIONS, options)
    /* 使用css动画 */
    this.options.css = this.options.css && hasTransition
    this.options.isArrow = this.options.isArrow && !(isAndroid || isIos)
    this.wrapper.style.cssText =
      `position:absolute;
      top: 0;
      left: ${this.options.loop ? -this._width : 0}px;
      width: ${this.options.loop ? this._width * (this._len + 2) : this._width * this._len}px;
      height: 100%;
      display: flex`

    if (this.options.loop) {
      /**
       * 如果循环轮播图的话需要将头和尾复制一个节点
       */
      const first = this.slides[0]
      const last = this.slides[this._len - 1]
      this.wrapper.appendChild(first.cloneNode(true)) // 复制节点并插入节点
      this.wrapper.insertBefore(last.cloneNode(true), first) // 复制节点插入到第一个
    }
    if (this.options.isPaginat) {
      // 指示器
      const fragment = document.createDocumentFragment()
      const pagination = document.createElement("div")
      pagination.classList.add("swiper-pagination")
      for (let i = 0; i < this._len; i++) {
        const span = document.createElement("span")
        span.classList.add(className(this.options.paginatClass, true))
        span.setAttribute("data-index", i + 1)
        pagination.appendChild(span)
      }
      this.pagination = pagination
      fragment.appendChild(pagination)
      this.el.appendChild(fragment)
      this.showBtn()
      addEvent(this.pagination, "touchstart", (e) => {
        const num = Number(e.target.getAttribute("data-index"))
        if (!this._isAnimation && Number(num) && this._index !== num) {
          if (this.options.loop && (this._index === 1 || this._index === this._len)) {
            if (Math.abs(num - this._index) === this._len - 1) {
              this.animation(-this._width * (this.len - num - this._index) * ((num - this._index) > 0 ? 1 : -1))
            } else {
              this.animation(-this._width * (num - this._index))
            }
          } else {
            this.animation(-this._width * (num - this._index))
          }
          this._index = num
          this.showBtn()
        }
      })
    }
  }

  Swiper.prototype._addDOMEvents = function () {
    const eventOperation = addEvent
    this._handleDOMEvents(eventOperation)
  }
  Swiper.prototype._removeDOMEvents = function () {
    const eventOperation = addEvent
    this._handleDOMEvents(eventOperation)
  }
  Swiper.prototype._handleDOMEvents = function (eventOperation) {
    const target = this.wrapper || window

    if (!hasTouch) {
      eventOperation(target, "mousedown", this)
      eventOperation(target, "mousemove", this)
      eventOperation(target, "mousecancel", this)
      eventOperation(target, "mouseup", this)
    }

    if (hasTouch) {
      eventOperation(target, "touchstart", this)
      eventOperation(target, "touchmove", this)
      eventOperation(target, "touchcancel", this)
      eventOperation(target, "touchend", this)
    }
  }
  /* addEventListener 中的this默认监听 handleEvent 函数*/
  Swiper.prototype.handleEvent = function (e) {
    switch (e.type) {
      case "touchstart":
      case "mousedown":
        this._start(e)
        break
      case "touchmove":
      case "mousemove":
        this._move(e)
        break
      case "touchend":
      case "mouseup":
      case "touchcancel":
      case "mousecancel":
        this._end(e)
        break
      case "transitionend":
      case "webkitTransitionEnd":
      case "oTransitionEnd":
      case "MSTransitionEnd":
        this._transitionEnd(e)
        break
    }
  }
}
