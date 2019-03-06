export default (Swiper) => {
  Swiper.prototype.showBtn = function () {

  }
  Swiper.prototype.animation = function (offset) {
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
        console.log(_this._index)
        _this.wrapper.style.left = newLeft + "px"
      }
    }

    go()
  }
  Swiper.prototype.direction = function () {
  }
  Swiper.prototype.play = function () {
  }
  Swiper.prototype.stop = function () {
  }
}
