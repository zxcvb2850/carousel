import { hasTransition, hasTouch, addEvent } from "../utils/dom"
import { isAndroid, isIos } from "../utils/env"
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
    this.wrapper.style.cssText = `position:absolute;width: ${this._width * this._len}px; height: 100%; display: flex`
    this.slides.forEach(slide => {
      slide.style.width = this._width + "px"
    })

    this._handleOptions(options)
  }
  /* 初始化参数 */
  Swiper.prototype._handleOptions = function (options) {
    this.options = Object.assign(DEFAULT_OPTIONS, options)
    /* 使用css动画 */
    this.options.css = this.options.css && hasTransition
    this.options.isArrow = this.options.isArrow && !(isAndroid || isIos)

    this._addDOMEvents()
  }

  Swiper.prototype._addDOMEvents = function () {
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
        if (this.options.zoom && e.touches && e.touches.length > 1) {
          // this._zoom(e)
        } else {
          this._move(e)
        }
        break
      case "touchend":
      case "mouseup":
      case "touchcancel":
      case "mousecancel":
        if (this.scaled) {
          // this._zoomEnd(e)
        } else {
          this._end(e)
        }
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
