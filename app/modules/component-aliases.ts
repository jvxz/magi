import type { NuxtTemplate } from 'nuxt/schema'

import { addTemplate, defineNuxtModule } from 'nuxt/kit'

const DECLARATION_RE = /^( {2}|export const )([A-Z_$][\w$]*): typeof import\(("[^"]+")\)(?:\.([\w$]+)|\["([^"]+)"\])$/

interface Alias {
  name: string
  path: string
  exportName: string
}

function splitAliases(contents: string, prefix: string) {
  const aliases: Alias[] = []
  const lines: string[] = []

  for (const line of contents.split('\n')) {
    const match = DECLARATION_RE.exec(line)
    if (match?.[1] !== prefix) {
      lines.push(line)
      continue
    }
    if (lines.at(-1)?.trim() === '*/') {
      const start = lines.findLastIndex(l => l.trim() === '/**')
      lines.splice(start)
    }
    aliases.push({ exportName: match[4] ?? match[5]!, name: match[2]!, path: match[3]! })
  }

  return { aliases, contents: lines.join('\n') }
}

const renderExport = ({ name, path, exportName }: Alias) => `export { ${exportName} as ${name} } from ${path}`

function wrap(template: NuxtTemplate<any> | undefined, transform: (contents: string) => string) {
  const getContents = template?.getContents
  if (!template || !getContents) return
  template.getContents = async data => transform(await getContents(data))
  return getContents
}

export default defineNuxtModule({
  meta: {
    name: 'component-aliases',
  },
  setup(_, nuxt) {
    nuxt.hook('modules:done', () => {
      const find = (filename: string) => nuxt.options.build.templates.find(t => t.filename === filename)

      const getTypes = wrap(find('types/components.d.ts'), contents =>
        splitAliases(contents, '  ').contents.replace(
          'interface _GlobalComponents {',
          `type _Aliases = typeof import('./component-aliases')\ninterface _GlobalComponents extends _Aliases {`,
        ),
      )
      if (!getTypes) return

      addTemplate({
        filename: 'types/component-aliases.d.ts',
        getContents: async data =>
          `${splitAliases(await getTypes(data), '  ')
            .aliases.map(renderExport)
            .join('\n')}\n`,
        write: true,
      })

      wrap(find('components.d.ts'), contents => {
        const { aliases, contents: rest } = splitAliases(contents, 'export const ')
        return `${aliases.map(renderExport).join('\n')}\n${rest}`
      })
    })
  },
})
