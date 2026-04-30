/**
 * Luckino-style tokens with **hex colors** resolved in real Chromium
 * (`oklch`, `var()`, relative color — same as production).
 *
 * Writes `tokens.json` (theme-1 + theme-2), `light.json`, and `dark.json` (one hex per token).
 *
 * Requires: `pnpm exec playwright install chromium`; `culori` for oklch → hex.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatHex, parse } from 'culori'
import { chromium } from 'playwright-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const GLOBALS = join(ROOT, 'app/assets/css/globals.css')
const OUT_DIR = join(ROOT, 'design-tokens/w3c')
const OUT_FILE = join(OUT_DIR, 'tokens.json')
const OUT_LIGHT = join(OUT_DIR, 'light.json')
const OUT_DARK = join(OUT_DIR, 'dark.json')

function extractBlockInner(css, selector) {
  const re = selector === ':root'
    ? /:root\s*\{/g
    : /\.dark\s*\{/g
  re.lastIndex = 0
  const m = re.exec(css)
  if (!m)
    throw new Error(`Missing ${selector} block in globals.css`)
  let i = m.index + m[0].length
  let depth = 1
  while (i < css.length && depth > 0) {
    const c = css[i]
    if (c === '{')
      depth++
    else if (c === '}')
      depth--
    i++
  }
  if (depth !== 0)
    throw new Error(`Unbalanced braces for ${selector}`)
  return css.slice(m.index + m[0].length, i - 1)
}

function parseVars(block) {
  const map = new Map()
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim()
    if (!line.startsWith('--'))
      continue
    const colon = line.indexOf(':')
    if (colon === -1)
      continue
    const name = line.slice(2, colon).trim()
    const rest = line.slice(colon + 1).trim()
    if (!rest.endsWith(';'))
      continue
    map.set(name, rest.slice(0, -1).trim())
  }
  return map
}

function radiusKey(name) {
  if (name === 'radius')
    return 'default'
  if (name.startsWith('radius-'))
    return name.slice('radius-'.length)
  return name
}

function isRadiusVar(name) {
  return name === 'radius' || name.startsWith('radius-')
}

/**
 * @param {Map<string, string>} light
 */
function buildPrimitives(light) {
  /** @type {Record<string, Record<string, { $type: string, $value: number | string }>>} */
  const primitives = { core: {}, radius: {} }

  const chroma = light.get('chroma')
  if (chroma !== undefined) {
    primitives.core.chroma = {
      $type: 'number',
      $value: Number(chroma),
    }
  }

  for (const [name, raw] of light) {
    if (!isRadiusVar(name))
      continue
    primitives.radius[radiusKey(name)] = {
      $type: 'borderRadius',
      $value: raw,
    }
  }

  return primitives
}

function colorNamesFromMaps(light, dark) {
  const names = new Set()
  for (const name of light.keys()) {
    if (!isRadiusVar(name) && name !== 'chroma')
      names.add(name)
  }
  for (const name of dark.keys()) {
    if (!isRadiusVar(name) && name !== 'chroma')
      names.add(name)
  }
  return [...names].sort()
}

/**
 * Chromium often serializes computed colors as `oklch(...)`; Luckino needs hex.
 * @param {string} computed — e.g. from `getComputedStyle(...).backgroundColor`
 * @returns {string} `#RRGGBB` or `#RRGGBBAA`
 */
function computedColorToHex(computed) {
  const s = computed.trim()
  if (s === 'transparent' || s === '')
    return '#00000000'
  const parsed = parse(s)
  if (!parsed)
    throw new Error(`parse color: ${computed}`)
  return formatHex(parsed).toUpperCase()
}

/**
 * @param {import('playwright-core').Page} page
 * @param {string[]} names
 * @param {boolean} isDark
 * @returns {Promise<Record<string, string>>} Maps token name → `backgroundColor` computed string.
 */
async function resolveColorsInPage(page, names, isDark) {
  return page.evaluate(
    ({ isDark: dark, names: n }) => {
      document.documentElement.classList.toggle('dark', dark)
      /** @type {Record<string, string>} */
      const out = {}
      for (const name of n) {
        const el = document.createElement('div')
        el.style.cssText = `background-color:var(--${name});`
        document.body.appendChild(el)
        out[name] = getComputedStyle(el).backgroundColor
        el.remove()
      }
      return out
    },
    { isDark, names },
  )
}

async function main() {
  const css = readFileSync(GLOBALS, 'utf8')
  const rootInner = extractBlockInner(css, ':root')
  const darkInner = extractBlockInner(css, '.dark')
  const themeCss = `:root{${rootInner}}.dark{${darkInner}}`

  const lightMap = parseVars(extractBlockInner(css, ':root'))
  const darkMap = parseVars(extractBlockInner(css, '.dark'))
  const names = colorNamesFromMaps(lightMap, darkMap)

  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style id="theme">${themeCss}</style></head><body></body></html>`,
      { waitUntil: 'domcontentloaded' },
    )

    const rawLight = await resolveColorsInPage(page, names, false)
    const rawDark = await resolveColorsInPage(page, names, true)

    /** @type {Record<string, { $type: string, $value: Record<string, string> }>} */
    const colors = {}
    for (const name of names) {
      const t1Raw = rawLight[name]
      const t2Raw = rawDark[name]
      let theme1
      let theme2
      try {
        theme1 = computedColorToHex(t1Raw)
      }
      catch (e) {
        console.warn(`theme-1 ${name}: ${t1Raw}`, e)
        theme1 = '#FF00FF'
      }
      try {
        theme2 = computedColorToHex(t2Raw)
      }
      catch (e) {
        console.warn(`theme-2 ${name}: ${t2Raw}`, e)
        theme2 = '#FF00FF'
      }
      colors[name] = {
        $type: 'color',
        $value: {
          'theme-1': theme1,
          'theme-2': theme2,
        },
      }
    }

    const primitives = buildPrimitives(lightMap)

    const doc = {
      components: {},
      primitives,
      semantic: { colors },
    }

    /** @type {Record<string, { $type: string, $value: string }>} */
    const colorsLight = {}
    /** @type {Record<string, { $type: string, $value: string }>} */
    const colorsDark = {}
    for (const name of names) {
      const dual = colors[name].$value
      colorsLight[name] = {
        $type: 'color',
        $value: dual['theme-1'],
      }
      colorsDark[name] = {
        $type: 'color',
        $value: dual['theme-2'],
      }
    }

    const docLight = {
      components: {},
      primitives,
      semantic: { colors: colorsLight },
    }
    const docDark = {
      components: {},
      primitives,
      semantic: { colors: colorsDark },
    }

    mkdirSync(OUT_DIR, { recursive: true })
    writeFileSync(OUT_FILE, `${JSON.stringify(doc, null, 2)}\n`, 'utf8')
    writeFileSync(OUT_LIGHT, `${JSON.stringify(docLight, null, 2)}\n`, 'utf8')
    writeFileSync(OUT_DARK, `${JSON.stringify(docDark, null, 2)}\n`, 'utf8')
    console.log(`Wrote ${OUT_FILE}`)
    console.log(`Wrote ${OUT_LIGHT}`)
    console.log(`Wrote ${OUT_DARK}`)
  }
  finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
