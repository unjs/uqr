import { encode } from './encode'
import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from './types'

/**
 * Escapes special characters in a string for use in XML attributes.
 * This function replaces characters such as `&`, `"`, `<`, and `>` with their corresponding XML entities to ensure that the string can be safely included in an XML attribute without causing parsing issues.
 * @param {string} value - The string to escape for use in an XML attribute.
 * @returns {string} The escaped string, safe for use in XML attributes.
 */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  const paths: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      if (result.data[row][col])
        paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
    }
  }

  svg += `<rect fill="${escapeAttr(whiteColor)}" width="${width}" height="${height}"/>`
  svg += `<path fill="${escapeAttr(blackColor)}" d="${paths.join('')}"/>`

  svg += '</svg>'
  return svg
}
