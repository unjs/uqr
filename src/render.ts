import type { QrCodeGenerateData, QrCodeGenerateOptions, QrCodeGenerateUnicodeOptions } from './types'
import { encode, getDataAt } from './encode'

/**
 * Render QR Code with unicode `█`, `░`
 */
export function renderUnicode(
  data: QrCodeGenerateData,
  options: QrCodeGenerateUnicodeOptions = {},
) {
  const {
    whiteChar = '\u2588',
    blackChar = '\u2591',
  } = options
  const result = encode(data, options)

  return result.data.map((row) => {
    return row.map(mod => mod ? blackChar : whiteChar).join('')
  }).join('\n')
}

/**
 * Render QR Code with ANSI color for terminal
 */
export function renderANSI(
  data: QrCodeGenerateData,
  options: QrCodeGenerateOptions = {},
) {
  return renderUnicode(data, {
    ...options,
    blackChar: '\x1B[40m　\x1B[0m',
    whiteChar: '\x1B[47m　\x1B[0m',
  })
}

/**
 * Render QR Code with two rows into one line with unicode `▀`, `▄`, `█`, ` `
 */
export function renderUnicodeCompact(
  data: QrCodeGenerateData,
  options: QrCodeGenerateOptions = {},
) {
  const platte = {
    WHITE_ALL: '\u2588',
    WHITE_BLACK: '\u2580',
    BLACK_WHITE: '\u2584',
    BLACK_ALL: ' ',
  }

  const result = encode(data, options)
  const WHITE = false
  const BLACK = true

  const at = (x: number, y: number) => getDataAt(result.data, x, y, true)

  const lines: string[] = []
  let line = ''
  for (let row = 0; row < result.size; row += 2) {
    for (let col = 0; col < result.size; col++) {
      if (at(col, row) === WHITE && at(col, row + 1) === WHITE)
        line += platte.WHITE_ALL
      else if (at(col, row) === WHITE && at(col, row + 1) === BLACK)
        line += platte.WHITE_BLACK
      else if (at(col, row) === BLACK && at(col, row + 1) === WHITE)
        line += platte.BLACK_WHITE
      else
        line += platte.BLACK_ALL
    }
    lines.push(line)
    line = ''
  }

  return lines.join('\n')
}
