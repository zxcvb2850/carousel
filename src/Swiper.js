import initMixin from "./component/init"
import actionMixin from "./component/action"

import { warn } from "./utils/debug"

class Swiper {
  constructor(ele, options) {
    this.ele = (typeof ele) === "string" ? document.querySelector(ele) : ele
    this._width = this.ele.clientWidth// 获取轮播图的宽度
    this._index = 1// 当前轮播索引
    this._isAnimation = false// 是否在滚动中
    this._time = null// 自动轮播

    if (!ele) {
      warn("Can not resolve the wrapper DOM.")
    }
    this.wrapper = this.ele.children[0]// 获取轮播图容器
    this.slide = this.wrapper.children// 获取每个轮播图
    if (!this.slide) warn("Can not resolve the slide length < 1.")
    this.len = this.slide.length// 获取轮播图个数
    for (let i = 0; i < this.len; i++) {
      /* 设置每个的宽度为父级宽度 */
      this.slide[i].style.width = this._width + "px"
    }

    if (!this.wrapper) {
      warn("The wrapper need at least one child element to be wrapper.")
    }
    /* 初始化 */
    this._init(options)
  }
}

initMixin(Swiper)
actionMixin(Swiper)

Swiper.Version = "1.0.0"

export default Swiper
