import { encode } from './generate'
import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from './types'

/**
 * Render QR Code with ANSI color for terminal
 */
export function renderSVG(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions = {},
) {
  const result = encode(data, options)
  const {
    pixelSize = 5,
    whiteColor = 'white',
    blackColor = 'black',
  } = options
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}">`

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      const fillColor = result.data[row][col] ? blackColor : whiteColor
      svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${fillColor}"/>`
    }
  }
  svg += '</svg>'
  return svg
}
