export default (Swiper) => {
  Swiper.prototype._showBtn = function() {
    const btns = this.pagination.children
    const len = btns.length
    for (let i = 0; i < len; i++) {
      btns[i].classList.remove("active")
    }
    if (this._index > len) this._index = len
    if (this._index < 1) this._index = 1
    btns[this._index - 1].classList.add("active")
  }

  Swiper.prototype._animation = function(offset) {
    const _this = this
    this._isAnimation = true
    const newLeft = this.wrapper.offsetLeft + offset
    const timer = 300
    const intiver = 10
    const speed = offset / (timer / intiver)

    function go() {
      const offsetLeft = Number(_this.wrapper.offsetLeft)
      console.log(speed, offsetLeft, newLeft)
      if (!_this.options.css && ((speed < 0 && offsetLeft > newLeft) || (speed > 0 && offsetLeft < newLeft))) {
        _this.wrapper.style.left = offsetLeft + speed + "px"
        requestAnimationFrame(go)
      } else {
        if (newLeft < -_this.len * _this._width) {
          _this.wrapper.style.left = `-${_this._width}px`
        } else if (newLeft > -_this._width) {
          _this.wrapper.style.left = `-${_this.len * _this._width}px`
        } else {
          _this.wrapper.style.left = newLeft + "px"
        }
        _this._isAnimation = false
        _this._showBtn()
        console.log("index", _this._index)
      }
    }

    go()
  }

  Swiper.prototype.direction = function(type = "next") {
    if (!this._isAnimation) {
      if (type === "next") {
        this._index === this.len ? this._index = 1 : this._index++
      } else {
        this._index === 1 ? this._index = this.len : this._index--
      }
      this._showBtn()
      this._animation(type === "next" ? this._width * -1 : this._width)
    }
  }
}
