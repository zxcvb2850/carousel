export default (Swiper) => {
  Swiper.prototype.showBtn = function () {

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
        _this.currentIndex(_this._index)
        _this._isAnimation = false
        _this.wrapper.style.left = newLeft + "px"
      }
    }

    if (this._isAnimation) {
      go()
    }
  }
  Swiper.prototype.currentIndex = function (index) {
    if (index === 0) {
      setTimeout(() => {
        this._index = this._len
        this.wrapper.style.left = -this._len * this._width + "px"
        document.querySelector("#index").innerText = this._index
      })
    } else if (index === this._len + 1) {
      setTimeout(() => {
        this._index = 1
        this.wrapper.style.left = -this._width + "px"
        document.querySelector("#index").innerText = this._index
      })
    } else {
      document.querySelector("#index").innerText = index
    }
  }
  Swiper.prototype.direction = function () {
  }
  Swiper.prototype.play = function () {
  }
  Swiper.prototype.stop = function () {
  }
}
