
export default class Tools {
  static uuid (len = 16, radix = 16): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    let i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      // rfc4122, version 4 form
      let r
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data. At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }

  static uniqueTag (): string {
    return Tools.uuid()
  }

  static addClass (ele:Element, className:string) {
    if (!ele) return
    if (!className) return
    if (!ele.className) {
      ele.className = className
    } else {
      ele.className += ' ' + className
    }
  }

  static removeClass (ele:Element, className:string) {
    if (!ele) return
    if (!className) return
    if (ele.className) {
      let reg = new RegExp(` ${className}`, 'g')
      ele.className = ele.className.replace(reg, '')
      reg = new RegExp(`${className} `, 'g')
      ele.className = ele.className.replace(reg, '')
      reg = new RegExp(`${className}`, 'g')
      ele.className = ele.className.replace(reg, '')
    }
  }
}
