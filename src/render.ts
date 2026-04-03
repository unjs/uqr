import type { QrCodeGenerateData, QrCodeGenerateOptions, QrCodeGenerateUnicodeOptions } from './types'
import { encode, getDataAt } from './encode'

/**
 * Renders a QR code as a string using the specified Unicode characters for dark(`█`) and light(`░`) modules.
 * @param {QrCodeGenerateData} data - The data to encode into the QR code. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateUnicodeOptions} [options] - Rendering options, including characters for white and black modules. optional. See {@link QrCodeGenerateUnicodeOptions}.
 * Returns {string} A string representing the QR code, with each module replaced by the specified Unicode character.
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
 * Renders a QR code as a string suitable for display on terminals using ANSI background colours.
 * @param {QrCodeGenerateData} data - The data to encode into the QR code. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateOptions} [options] - Options to render the QR code. optional. See {@link QrCodeGenerateOptions}.
 * @returns {string} A string representing the QR code using ANSI colours, formatted for terminal display.
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
 * Renders a QR code as a compact string using a combination of top half block(`▀`), bottom half block(`▄`), full block(`█`) and spaces to represent two lines in a single line.
 * @param {QrCodeGenerateData} data - The data to encode into the QR code. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateOptions} [options] - Options to render the QR code in a compact form. optional. See {@link QrCodeGenerateOptions}.
 * @returns {string} A string representing the QR code in a compact format, using Unicode block characters to combine two lines per line.
 */
export function renderUnicodeCompact(
  data: QrCodeGenerateData,
  options: QrCodeGenerateOptions = {},
) {
  const palette = {
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
        line += palette.WHITE_ALL
      else if (at(col, row) === WHITE && at(col, row + 1) === BLACK)
        line += palette.WHITE_BLACK
      else if (at(col, row) === BLACK && at(col, row + 1) === WHITE)
        line += palette.BLACK_WHITE
      else
        line += palette.BLACK_ALL
    }
    lines.push(line)
    line = ''
  }

  return lines.join('\n')
}
