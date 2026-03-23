import { encode } from './encode'
import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from './types'

/**
 * Escape special XML characters to prevent injection.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Renders a QR code as an SVG string.
 * The function converts the input data into a QR code and then generates an SVG representation using the specified colours and pixel sizes.
 * @param {QrCodeGenerateData} data - The data to encode into the QR code. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateSvgOptions} [options={}] - Options to render the QR code in SVG format, including pixel size and colours for modules. optional. See {@link QrCodeGenerateSvgOptions}.
 * @returns {string} An SVG string representing the QR code.
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

  const escapedWhite = escapeXml(whiteColor)
  const escapedBlack = escapeXml(blackColor)

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

  svg += `<rect fill="${escapedWhite}" width="${width}" height="${height}"/>`
  svg += `<path fill="${escapedBlack}" d="${pathes.join('')}"/>`

  svg += '</svg>'
  return svg
}
