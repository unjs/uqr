import { expect, it } from 'vitest'
import { renderUnicodeCompact } from '../src'

const t = null

const injections = [
  [t, t, t, t, 1, 1, 1, t, t, t, t, t, t, t],
  [t, t, t, 1, 1, 0, 1, 1, t, t, t, t, t, t],
  [t, t, t, 1, 0, 1, 0, 1, 1, 1, 1, t, t, t],
  [t, t, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, t, t],
  [t, t, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, t, t],
  [t, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, t],
  [t, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, t],
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

it('on-encode injection', () => {
  const code = renderUnicodeCompact('http://192.168.1.100:3000', {
    invert: false,
    ecc: 'H',
    boostEcc: true,
    minVersion: 3,
    onEncoded(qr) {
      const hi = injections.length
      const wi = injections[0].length

      const dx = Math.ceil((qr.size - wi) / 2)
      const dy = Math.ceil((qr.size - hi) / 2)

      for (let y = 0; y < hi; y++) {
        for (let x = 0; x < wi; x++) {
          if (injections[y][x] !== null)
            qr.data[y + dy][x + dx] = injections[y][x] === 1
        }
      }
    },
  })

  // console.log(code)
  expect(`\n${code}`)
    .toMatchInlineSnapshot(`
      "
      █▀▀▀▀▀▀▀█▀██▀█▀▀█▀▀▀▀██▀█▀█▀▀▀▀▀▀▀█
      █ █▀▀▀█ █▀▄▄ ▄▄ ▄▀█▀▄█ ▄▀██ █▀▀▀█ █
      █ █   █ █▀▄█▄▄▄ █ ▀██▄  ▄▄█ █   █ █
      █ ▀▀▀▀▀ █▀█ ▄▀█ █▀█▀█▀█▀▄ █ ▀▀▀▀▀ █
      ██████▀▀█▄ ▀▀█▄▀██  ▄ ██ ██▀█▀█▀█▀█
      █ ▀▄█ ▀▀▀█▄▀█ █▀▄▀▄ █▄▀█▄ ▄█ ▄▀ ▄██
      █▀▄ ██▀▀█▀ █▄█▀▀▀ █  ▀▀ ▀  ▀▄▀█▄ ██
      ██▀ ▄ ▀▀▄▀▀ █▀ ▄▀▄ ▀  ▄ ▄ ▄ ██▀ ▀▄█
      ███   █▀ ▄▀ ▄ ▄▀ ▀█▄▀▄ █▀ ███ ▀ ▄ █
      █▄▄██▄▀▀▄▄ ▄ ▄▀  ▄▀  ▀▄   ▄▄▀▀▀▀███
      ██ ▄▄▄█▀▀ █ ▄█▄▄▄▀ ▄▄▄█▄ ▄▀ █▀ ▄▀ █
      █ █ █▄▄▀▄█  ▄ ▄▄▄  ▄▄  ▄▄▄█▄▀ █▄▄██
      █ ▀▄▄▄▄▀█▄ █▀█▄█ █▄▄ ▄▀▀▀ ▀▀  ▀▄█▄█
      █▀▀▀▀▀▀▀█▄██  ▀▀▀▄█ ▀▀▄▀  █▀█ █ ▄▄█
      █ █▀▀▀█ █▄▀▀█▀   ▄██▀█  █ ▀▀▀ ▀▄▄▄█
      █ █   █ ██▄▀▀███▀█ █ ▄██ ▀██▄  █ ▀█
      █ ▀▀▀▀▀ ███  ▀  █▄▄ ▀▄██▄▀▄▀██▄▀▀██
      ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀"
    `)
})
