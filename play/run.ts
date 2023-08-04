/* eslint-disable no-console */
import { renderANSI, renderUnicode, renderUnicodeCompact } from '../src'

const text = 'qrcode'

console.log(renderANSI(text))
console.log()

console.log(renderUnicode(text))
console.log()

console.log(renderUnicodeCompact(text))
console.log()
