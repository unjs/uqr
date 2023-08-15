import { encode } from './encode'
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
    pixelSize = 10,
    whiteColor = 'white',
    blackColor = 'black',
  } = options
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  const pathes: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      if (result.data[row][col])
        pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
    }
  }

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`
  svg += `<path fill="${blackColor}" d="${pathes.join('')}"/>`

  svg += '</svg>'
  return svg
}
