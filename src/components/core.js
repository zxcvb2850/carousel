export default (Swiper) => {
  Swiper.prototype._start = function (e) {
    const point = e.touches ? e.touches[0] : e

    this.startX = point.pageX
  }
  Swiper.prototype._move = function (e) {
    const point = e.touches ? e.touches[0] : e
    const move = this.wrapper.offsetLeft + (point.pageX - this.startX)
    console.log(move)
    this.wrapper.left = move + "px"
    this.endX = point.pageX
  }
  Swiper.prototype._end = function (e) {
    console.log(this.endX - this.startX)
  }
  Swiper.prototype._transitionEnd = function (e) {
  }
}
