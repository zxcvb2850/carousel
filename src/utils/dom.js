import { inBrowser } from "./env"

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
    if (style === "transformEnd") {
      return "transformEnd"
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

export const hasTransform = transform !== false
export const hasTransition = inBrowser && transition in elementStyle
