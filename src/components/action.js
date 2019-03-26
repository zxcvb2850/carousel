import { className } from "../utils/env"
import { addEvent, removeEvent, style, transitionAnimate } from "../utils/dom"

export default (Swiper) => {
  Swiper.prototype.showBtn = function () {
    if (!this.options.isPaginat) return
    const pageinats = Array.from(document.querySelectorAll(className(this.options.paginatClass)))
    pageinats.forEach(item => {
      item.classList.remove("active")
    })
  }
  Swiper.prototype.animation = function (offset) {
    this._isAnimation = true
    const _this = this
    const newLeft = this.wrapper.offsetLeft + offset
    const timer = 300
    const intiver = 10
    const speed = Math.floor(offset / (timer / intiver))

    function go() {
      const offsetLeft = Number(_this.wrapper.offsetLeft)
      if ((speed < 0 && offsetLeft > newLeft) || (speed > 0 && offsetLeft < newLeft)) {
        _this.wrapper.style.left = offsetLeft + speed + "px"
        requestAnimationFrame(go)
      } else {
        _this.currentIndex(newLeft)
        _this._isAnimation = false
      }
    }
    function cssGo () {
      _this.wrapper.style.left = newLeft + "px"
    }
    function listenEnd () {
      if (_this._index === _this._len + 1) {
        _this.options.css && transitionAnimate(_this.wrapper, "none")
        _this._index = 1
        _this.wrapper.style.left = -_this._width + "px"
      } else {
        _this.options.css && transitionAnimate(_this.wrapper, _this.options.cssSpeed)
        _this.wrapper.style.left = newLeft + "px"
      }
      _this.showBtn()
      _this._isAnimation = false
      removeEvent(_this.wrapper, style.transitionEnd, listenEnd)
    }

    if (this._isAnimation) {
      if (!this.options.css) {
        go()
      } else {
        cssGo()
        addEvent(_this.wrapper, style.transitionEnd, listenEnd)
      }
    }
  }
  Swiper.prototype.currentIndex = function (newLeft) {
    if (this.options.loop) {
      this.wrapper.style.left = newLeft + "px"
      this.options.css && transitionAnimate(this.wrapper, this.options.cssSpeed)
      if (newLeft < -this._width * this._len) {
        this.options.css && transitionAnimate(this.wrapper, "none")
        this._index = 1
        this.wrapper.style.left = -this._width + "px"
      } else if (newLeft > -this._width) {
        this.options.css && transitionAnimate(this.wrapper, "none")
        this._index = this._len
        this.wrapper.style.left = -this._width * this._len + "px"
      }
    } else {
      this.options.css && transitionAnimate(this.wrapper, this.options.cssSpeed)
      this.wrapper.style.left = newLeft + "px"
    }
    this.showBtn()
    document.querySelector("#index").innerText = this._index
  }
  Swiper.prototype.direction = function () {
  }
  Swiper.prototype.play = function () {
    if (!this.options.loop && this._index >= this._len) {
      clearInterval(this._timer)
    } else {
      this._timer = setInterval(() => this._next(), this.options.speed)
    }
  }
  Swiper.prototype.stop = function () {
    clearInterval(this._timer)
  }
}
