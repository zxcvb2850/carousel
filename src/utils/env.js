import { warn } from "./debug"

export const inBrowser = (typeof window) !== undefined

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
