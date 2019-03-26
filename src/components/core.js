import { eventType, transitionAnimate } from "../utils/dom"

export default (Swiper) => {
  /* 拖动开始 */
  Swiper.prototype._start = function (e) {
    if (!this._isAnimation) {
      this.options.autoPlay && this.stop()
      const _eventType = eventType[e.type]
      if (this.destroyed || (this.initiated && this.initiated !== _eventType)) return
      this.initiated = _eventType
      const point = e.touches ? e.touches[0] : e
      this.offsetLeft = this.wrapper.offsetLeft
      this.startX = point.pageX
      this.options.css && transitionAnimate(this.wrapper, "none")
    }
  }
  /* 拖动中 */
  Swiper.prototype._move = function (e) {
    if (!this._isAnimation && this.startX) {
      const point = e.touches ? e.touches[0] : e
      this.move = point.pageX - this.startX
      this.wrapper.style.left = this.offsetLeft + this.move + "px"
      this.endX = point.pageX
    }
  }
  /* 拖动结束 */
  Swiper.prototype._end = function () {
    if (!this._isAnimation && !!this.endX && (this.endX - this.startX)) {
      const absMove = Math.abs(this.move)
      const isPositive = this.move > 0 ? 1 : -1
      if (absMove > this._width / 3) {
        isPositive > 0 ? this._index-- : this._index++
        console.log("---------", this._index)
        if (!this.options.loop && this._index < 1) {
          this._index = 1
          this.animation(absMove * -isPositive)
        } else if (!this.options.loop && this._index > this._len) {
          this._index = this._len
          this.animation(absMove * -isPositive)
        } else {
          this.animation((this._width - absMove) * isPositive)
        }
      } else {
        this.animation(absMove * -isPositive)
      }
      this.startX = this.endX = null
      this.options.autoPlay && this.play()
      this.options.css && transitionAnimate(this.wrapper, this.options.cssSpeed)
    }
  }
  Swiper.prototype._transitionEnd = function (e) {
    console.log("_transitionEnd", e)
  }
  Swiper.prototype._next = function () {
    if (this.options.loop) {
      if (!this.options.css) {
        this._index === this._len ? this._index = 1 : this._index++
      } else {
        this._index === this._len + 1 ? this._index = 1 : this._index++
      }
    } else {
      if (this._index <= this._len) {
        this._index++
      }
      if (this._index < this._len + 1) {
        this.animation(this._width * -1)
      }
    }
    console.log("+++++++", this._index, this._width * -1)
    this.options.loop && this.animation(this._width * -1)
    this.showBtn()
  }
  Swiper.prototype._prev = function () {
    this.index--
    this.showBtn()
  }
  /* 移除事件 */
  Swiper.prototype.destroy = function () {
    this.destroyed = true
    this._removeDOMEvents()
  }
}
