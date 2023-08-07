/* eslint-disable no-console */
import fs from 'node:fs'
import { renderANSI, renderSVG, renderUnicode, renderUnicodeCompact } from '../src'

const text = 'qrcode'

console.log(renderANSI(text))
console.log()

console.log(renderUnicode(text))
console.log()

console.log(renderUnicodeCompact(text))
console.log()

fs.writeFileSync('./play/out.svg', renderSVG(text), 'utf8')
