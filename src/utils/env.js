import { warn } from "./debug"

export const inBrowser = (typeof window) !== undefined
export const ua = inBrowser && navigator.userAgent.toLowerCase()
export const isWeChatDevTools = ua && /wechatdevtools/.test(ua)
export const isAndroid = ua && ua.indexOf("android") > 0
export const isIos = ua && ua.indexOf("iphone") > 0

export function className(name, type = false) {
  const reg = /(\|\*\?\@\#\$\%\^\&\*\(\))/
  if (reg.test(name)) return warn(`${name} className error`)

  let _name = name
  if (type) {
    _name = _name.charAt(0) === "." ? _name.substr(1) : _name
  } else {
    _name = _name.charAt(0) === "." ? _name : "." + _name
  }

  return _name
}
