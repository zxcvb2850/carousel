export default (Swiper) => {
  Swiper.prototype.showBtn = function () {

  }
  Swiper.prototype.animation = function (offset) {
    console.log(offset)
    const offsetLeft = this.wrapper.offsetLeft
    this.wrapper.style.left = offsetLeft + offset + "px"
  }
  Swiper.prototype.direction = function () {
  }
  Swiper.prototype.play = function () {
  }
  Swiper.prototype.stop = function () {
  }
}
