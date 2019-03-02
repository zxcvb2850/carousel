import { style } from "../utils/dom"

export default (Swiper) => {
  Swiper.prototype._showBtn = function () {
    const btns = this.pagination.children
    const len = btns.length
    for (let i = 0; i < len; i++) {
      btns[i].classList.remove("active")
    }
    if (this._index > len) this._index = len
    if (this._index <= 1) this._index = 1
    btns[this._index - 1].classList.add("active")
  }

  Swiper.prototype._animation = function (offset) {
    const _this = this
    this._isAnimation = true
    const newLeft = this.wrapper.offsetLeft + offset
    const timer = 300
    const intiver = 10
    const speed = Math.floor(offset / (timer / intiver))

    function go() {
      const offsetLeft = Number(_this.wrapper.offsetLeft)
      if (!_this.options.css) {
        if (((speed < 0 && offsetLeft > newLeft) || (speed > 0 && offsetLeft < newLeft))) {
          _this.wrapper.style.left = offsetLeft + speed + "px"
          requestAnimationFrame(go)
        } else {
          boundary()
          _this._isAnimation = false
          console.log("js index", _this._index)
        }
      } else {
        _this.wrapper.style.left = newLeft + "px"
        if (!newLeft) {
          _this._isAnimation = false
        }
        _this.wrapper.addEventListener(style.transitionEnd, listenEnd, false)
      }
    }
    function boundary() {
      if (newLeft < -_this.len * _this._width) {
        if (_this.options.css) _this.wrapper.style[style.transition] = ""
        _this.wrapper.style.left = `-${_this._width}px`
      } else if (_this.options.loop && newLeft > -_this._width) {
        if (_this.options.css) _this.wrapper.style[style.transition] = ""
        _this.wrapper.style.left = `-${_this.len * _this._width}px`
      } else {
        _this.wrapper.style.left = newLeft + "px"
      }
    }
    function listenEnd() {
      boundary()
      _this._isAnimation = false
      _this.wrapper.removeEventListener(style.transitionEnd, listenEnd, false)
    }
    go()
  }

  Swiper.prototype.direction = function (type = "next") {
    if (!this._isAnimation) {
      if (type === "next") {
        if (this.options.loop) {
          this._index === this.len ? this._index = 1 : this._index++
        } else {
          if (this._index <= this.len) {
            this._index++
          }
          if (this._index < this.len + 1) {
            this._animation(type === "next" ? this._width * -1 : this._width)
          }
        }
      } else {
        if (this.options.loop) {
          this._index === 1 ? this._index = this.len : this._index--
        } else {
          if (this._index >= 1) {
            this._index--
          }
          if (this._index >= 1) {
            this._animation(type === "next" ? this._width * -1 : this._width)
          }
        }
      }
      if (this.options.css && !this.wrapper.style[style.transition]) this.wrapper.style[style.transition] = "all 0.35s"
      this._showBtn()
      this.options.loop && this._animation(type === "next" ? this._width * -1 : this._width)
    }
  }

  Swiper.prototype.play = function () {
    this._time = setInterval(this.direction.bind(this), this.options.speed)// 改变作用域
  }
  Swiper.prototype.stop = function () {
    clearInterval(this._time)
  }
}
