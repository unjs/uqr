import { defineBuildConfig } from 'unbuild'
import type { Plugin } from 'rollup'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'rollup:options': (_, options) => {
      options.plugins ||= [];
      (options.plugins as any as Plugin[]).push({
        name: 'remove-assert',
        transform(code) {
          return code.replace(/(\s\s)assert\(/g, '$1false && assert(')
        },
      })
    },
  },
})
