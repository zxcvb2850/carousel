import { hasTransition, style } from "../utils/dom"
import { className, isAndroid, isIos } from "../utils/env"

const DEFAULT_OPTIONS = {
  /* 是否循环播放 */
  loop: true,
  /* 是否自动轮播 */
  autoPlay: true,
  /* 自动轮播时间 */
  speed: 3000,
  /* 是否使用trans */
  css: true,
  /* 能否点击轮播 */
  click: false,
  /* 是否有箭头 */
  isArrow: false,
  /* 箭头的calssName */
  arrorPrevClass: "swiper-button-prev",
  arrorNextClass: "swiper-button-next",
  /* 轮播图item的className */
  slideClass: ".swiper-slide",
  /* 指示器 */
  isPaginat: false,
  paginatClass: ".swiper-pagination-bullet"
}

export default (Swiper) => {
  // 初始化之前设置
  Swiper.prototype._init = function (options) {
    const _this = this
    let startX, endX, startLeft
    _this.ele.addEventListener("touchstart", (e) => {
      if (!_this._isAnimation) {
        console.log("touchstart", startX, endX)
        _this.options.autoPlay && _this.stop()
        const touch = e.targetTouches[0]
        startX = touch.pageX
        startLeft = _this.wrapper.offsetLeft
      }
    })
    _this.ele.addEventListener("touchmove", (e) => {
      if (startX && !_this._isAnimation) {
        console.log("touchmove", startX, endX)
        const touch = e.targetTouches[0]
        endX = touch.pageX
        _this.wrapper.style.left = startLeft + endX - startX + "px"
      }
    })
    _this.ele.addEventListener("touchend", (e) => {
      if (!_this._isAnimation && !!endX && (endX - startX)) {
        console.log("touchend", endX, startX, Math.abs(endX - startX))
        const move = _this.wrapper.offsetLeft - startLeft
        if (Math.abs(move) > (_this._width / 3)) {
          let width = (_this._width) - Math.abs((endX - startX))
          if (endX - startX > 0) {
            if (_this._index === 0) {
              _this.options.loop ? _this._index = _this.len : _this._index = 1
            } else {
              _this._index--
            }
          } else {
            if (_this._index === _this.len - 1) {
              _this.options.loop ? _this._index = 1 : _this._index = _this.len
            } else {
              _this._index++
            }
          }
          if (_this._index > _this.len || _this._index === 0) width = 0 - Math.abs((endX - startX))
          _this._animation((endX - startX) > 0 ? width : width * -1)
          _this._showBtn()
        } else {
          _this._animation(-(endX - startX))
        }
        startX = endX = startLeft = null
        _this.options.autoPlay && _this.play()
      }
    })

    _this._handleOptions(options)
  }

  // 初始化
  Swiper.prototype._handleOptions = function (options) {
    this.options = Object.assign(DEFAULT_OPTIONS, options)

    this.options.css = this.options.css && hasTransition

    if (this.options.isPaginat) {
      const fragment = document.createDocumentFragment()
      const pagination = document.createElement("div")
      pagination.classList.add("swiper-pagination")
      for (let i = 0; i < this.len; i++) {
        const item = document.createElement("div")
        item.classList.add(className(this.options.paginatClass, true))
        item.setAttribute("data-index", i + 1)
        pagination.appendChild(item)
      }
      this.pagination = pagination
      fragment.appendChild(pagination)
      this.ele.appendChild(fragment)
      this._showBtn()

      this.pagination.addEventListener("click", (e) => {
        console.log(e.target.getAttribute("data-index"))
        const num = Number(e.target.getAttribute("data-index"))
        if (!this._isAnimation && Number(num) && this._index !== num) {
          if (this.options.loop && (this._index === 1 || this._index === this.len)) {
            if (Math.abs(num - this._index) === this.len - 1) {
              this._animation(-this._width * (this.len - num - this._index) * ((num - this._index) > 0 ? 1 : -1))
            } else {
              this._animation(-this._width * (num - this._index))
            }
          } else {
            this._animation(-this._width * (num - this._index))
          }
          this._index = num
          this._showBtn()
        }
      })
    }

    if (this.options.loop) {
      const first = this.wrapper.children[0]
      const last = this.wrapper.children[this.len - 1]
      this.wrapper.insertBefore(last.cloneNode(true), first)
      this.wrapper.appendChild(first.cloneNode(true))
      this.wrapper.style.width = (this.len + 2) * this._width + "px"
      this.wrapper.style.left = -this._width + "px"// 初始化位置
    } else {
      this.wrapper.style.width = this.len * this._width + "px"
    }
    /**
     * 允许或支持css3动画启动css动画
     */
    if (this.options.css) {
      this.wrapper.style[style.transition] = "all 0.35s"
    }

    /**
     * 创建左右箭头
     */
    if (this.options.isArrow) {
      console.log(isAndroid || isIos)
      if (isAndroid || isIos) {
        this.options.isArrow = false
      } else {
        const fragment = document.createDocumentFragment()
        const prve = document.createElement("div")
        const next = document.createElement("div")

        prve.classList = className(this.options.arrorPrevClass, true)
        next.classList = className(this.options.arrorNextClass, true)
        fragment.appendChild(prve)
        fragment.appendChild(next)

        this.ele.appendChild(fragment)

        prve.addEventListener("click", () => {
          console.log(111)
          this.direction("prve")
        })
        next.addEventListener("click", () => {
          this.direction()
        })
      }
    }

    this.options.autoPlay && this.play()
  }
}
