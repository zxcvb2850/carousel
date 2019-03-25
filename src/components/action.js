import { className } from "../utils/env"
// import { style } from "../utils/dom"

export default (Swiper) => {
  Swiper.prototype.showBtn = function () {
    if (!this.options.isPaginat) return
    const pageinats = Array.from(document.querySelectorAll(className(this.options.paginatClass)))
    pageinats.forEach(item => {
      item.classList.remove("active")
    })
    if (this._index > this._len) this._index = this._len
    if (this._index <= 1) this._index = 1
    pageinats[this._index - 1].classList.add("active")
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

    if (this._isAnimation) {
      go()
    }
  }
  Swiper.prototype.currentIndex = function (newLeft) {
    if (this.options.loop) {
      this.wrapper.style.left = newLeft + "px"
      if (newLeft < -this._width * this._len) {
        this._index = 1
        this.wrapper.style.left = -this._width + "px"
      } else if (newLeft > -this._width) {
        this._index = this._len
        this.wrapper.style.left = -this._width * this._len + "px"
      }
    } else {
      this.wrapper.style.left = newLeft + "px"
    }
    this.showBtn()
    document.querySelector("#index").innerText = this._index
  }
  Swiper.prototype.direction = function () {
  }
  Swiper.prototype.play = function () {
    this._timer = setInterval(() => this._next(), this.options.speed)
  }
  Swiper.prototype.stop = function () {
    clearInterval(this._timer)
  }
}
