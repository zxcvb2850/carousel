import initMixin from "./init"
import actionMixin from "./action"
import coreMixin from "./core"
import { isElementNode } from "../utils/dom"
import { warn } from "../utils/debug"

class Swiper {
  constructor(el, options) {
    if (!el) {
      warn("Can not resolve the wrapper DOM.")
    }
    this.el = isElementNode(el) ? el : document.querySelector(el)

    this._init(options)
  }
}

initMixin(Swiper)
actionMixin(Swiper)
coreMixin(Swiper)

export default Swiper
