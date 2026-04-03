import type { QrCodeGenerateData, QrCodeGenerateOptions, QrCodeGenerateResult } from './types'
import {
  EccMap,
  encodeSegments,
  makeBytes,
  makeSegments,
} from './qrcode'
import { QrCodeDataType } from './types'

/**
 * Encodes the given data into a QR code format according to the given options.
 * @param {QrCodeGenerateData} data - The data to encode, either as a string or an array of bytes. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateOptions} [options] - QR Code generation configuration options. Optional. See {@link QrCodeGenerateOptions}.
 * @returns {QrCodeGenerateResult} The result of the QR code generation, including the QR code matrix. See {@link QrCodeGenerateResult}.
 */
export function encode(data: QrCodeGenerateData, options?: QrCodeGenerateOptions): QrCodeGenerateResult {
  const {
    ecc = 'L',
    boostEcc = false,
    minVersion = 1,
    maxVersion = 40,
    maskPattern = -1,
    border = 1,
  } = options || {}

  const segment = typeof data === 'string'
    ? makeSegments(data)
    : Array.isArray(data)
      ? [makeBytes(data)]
      : undefined

  if (!segment)
    throw new Error(`uqr only supports encoding string and binary data, but got: ${typeof data}`)

  const qr = encodeSegments(
    segment,
    EccMap[ecc],
    minVersion,
    maxVersion,
    maskPattern,
    boostEcc,
  )

  const result = addBorder({
    version: qr.version,
    maskPattern: qr.mask,
    size: qr.size,
    data: qr.modules,
    types: qr.types,
  }, border)

  if (options?.invert)
    result.data = result.data.map(row => row.map(mod => !mod))

  options?.onEncoded?.(result)

  return result
}

function addBorder(input: QrCodeGenerateResult, border = 1): QrCodeGenerateResult {
  if (!border)
    return input

  const { size } = input
  const newSize = size + border * 2

  input.size = newSize

  input.data.forEach((row) => {
    for (let i = 0; i < border; i++) {
      row.unshift(false)
      row.push(false)
    }
  })
  for (let i = 0; i < border; i++) {
    input.data.unshift(Array.from({ length: newSize }, _ => false))
    input.data.push(Array.from({ length: newSize }, _ => false))
  }

  const b = QrCodeDataType.Border
  input.types.forEach((row) => {
    for (let i = 0; i < border; i++) {
      row.unshift(b)
      row.push(b)
    }
  })
  for (let i = 0; i < border; i++) {
    input.types.unshift(Array.from({ length: newSize }, _ => b))
    input.types.push(Array.from({ length: newSize }, _ => b))
  }

  return input
}

/**
 * Returns the data value at a given coordinate in the QR code matrix.
 * @param {boolean[][]} data - The QR code data matrix.
 * @param {number} x - The x coordinate (column index) within the matrix.
 * @param {number} y - The y coordinate (row index) within the matrix.
 * @param {boolean} [defaults] - The default value to return if the coordinates are out of bounds. Optional.
 * @returns {boolean} The data value at the given coordinate or the default value if out of bounds.
 */
export function getDataAt(data: boolean[][], x: number, y: number, defaults = false) {
  if (x < 0 || y < 0 || x >= data.length || y >= data.length)
    return defaults
  return data[y][x]
}
