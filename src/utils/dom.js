import { inBrowser, isWeChatDevTools } from "./env"

const elementStyle = inBrowser && document.createElement("div").style

const vnode = (() => {
  if (!inBrowser) return false

  const transformName = {
    standard: "transform",
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform"
  }

  for (const key in transformName) {
    if (elementStyle[transformName[key]] !== undefined) {
      return key
    }
  }

  return false
})()

function prefixStyle(style) {
  if (!vnode) return false

  if (vnode === "standard") {
    if (style === "transitionEnd") {
      return "transitionend"
    }
    return style
  }

  return vnode + style.charAt(0).toUpperCase() + style.substr(1)
}

const transform = prefixStyle("transform")
const transition = prefixStyle("transition")

export const style = {
  transform,
  transition,
  transitionTimingFunction: prefixStyle("transitionTimingFunction"),
  transitionDuration: prefixStyle("transitionDuration"),
  transitionDelay: prefixStyle("transitionDelay"),
  transformOrigin: prefixStyle("transformOrigin"),
  transitionEnd: prefixStyle("transitionEnd")
}

export const hasTouch = inBrowser && ("ontouchstart" in window || isWeChatDevTools)
export const hasTransform = transform !== false
export const hasTransition = inBrowser && transition in elementStyle

export const TOUCH_EVENT = 1
export const MOUSE_EVENT = 2

export const eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
}

/* 判断是否是DOM节点 */
export const isElementNode = (node) => {
  return node.nodeType === 1
}

/* 添加事件 */
export function addEvent(el, type, fn) {
  el.addEventListener(type, fn)
}

/* 移除事件 */
export function removeEvent(el, type, fn) {
  el.addEventListener(type, fn)
}
