import { className } from "../utils/env"
import { addEvent, removeEvent, style, transitionAnimate } from "../utils/dom"

export default (Swiper) => {
  /**
   * 指示器展示
   * */
  Swiper.prototype.showBtn = function () {
    if (!this.options.isPaginat) return
    const pageinats = Array.from(document.querySelectorAll(className(this.options.paginatClass)))
    pageinats.forEach(item => {
      item.classList.remove("active")
    })
    pageinats[this._index - 1].classList.add("active")
  }
  /**
   * 动画展示
   * */
  Swiper.prototype.animation = function (offset) {
    this._isAnimation = true
    const _this = this
    const newLeft = this.wrapper.offsetLeft + offset
    const timer = 300
    const intiver = 10
    const speed = Math.floor(offset / (timer / intiver))

    /**
     * 监听JS动画结束回调
     * */
    function go() {
      const offsetLeft = Number(_this.wrapper.offsetLeft)
      if ((speed < 0 && offsetLeft > newLeft) || (speed > 0 && offsetLeft < newLeft)) {
        _this.wrapper.style.left = offsetLeft + speed + "px"
        requestAnimationFrame(go)
      } else {
        currentIndex(newLeft)
      }
    }
    function cssGo () {
      _this.wrapper.style.left = newLeft + "px"
    }
    /**
     * 监听CSS3动画结束回调
     * */
    function listenEnd () {
      if (_this._index === _this._len + 1) {
        _this.options.css && transitionAnimate(_this.wrapper, "none")
        _this._index = 1
        _this.wrapper.style.left = -_this._width + "px"
      } else if (_this._index === 0) {
        _this.options.css && transitionAnimate(_this.wrapper, "none")
        _this._index = _this._len
        _this.wrapper.style.left = -_this._width * _this._len + "px"
      } else {
        _this.options.css && transitionAnimate(_this.wrapper, _this.options.cssSpeed)
        _this.wrapper.style.left = newLeft + "px"
      }
      _this.options.changeCurrIndex && _this.options.changeCurrIndex(_this._index)
      _this.showBtn()
      _this._isAnimation = false
      removeEvent(_this.wrapper, style.transitionEnd, listenEnd)
    }
    /**
     * 监听JS动画结束回调
     * */
    function currentIndex(newLeft) {
      if (_this.options.loop) {
        _this.wrapper.style.left = newLeft + "px"
        _this.options.css && transitionAnimate(_this.wrapper, _this.options.cssSpeed)
        if (newLeft < -_this._width * _this._len) {
          _this.options.css && transitionAnimate(_this.wrapper, "none")
          _this._index = 1
          _this.wrapper.style.left = -_this._width + "px"
        } else if (newLeft > -_this._width) {
          _this.options.css && transitionAnimate(_this.wrapper, "none")
          _this._index = _this._len
          _this.wrapper.style.left = -_this._width * _this._len + "px"
        }
      } else {
        _this.options.css && transitionAnimate(_this.wrapper, _this.options.cssSpeed)
        _this.wrapper.style.left = newLeft + "px"
      }
      _this.options.changeCurrIndex && _this.options.changeCurrIndex(_this._index)
      _this.showBtn()
      _this._isAnimation = false
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
  /**
   * 销毁事件
   * */
  Swiper.prototype.direction = function () {
  }
  /**
   * 开始自动轮播
   * */
  Swiper.prototype.play = function () {
    if (this._index >= this._len) {
      clearInterval(this._timer)
    } else {
      this._timer = setInterval(() => this.next(), this.options.speed)
    }
  }
  /**
   * 关闭自动轮播
   * */
  Swiper.prototype.stop = function () {
    clearInterval(this._timer)
  }
}
