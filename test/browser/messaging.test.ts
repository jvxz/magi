import { describe, expect, it } from 'vitest'

import { MATRIX__ALLOWED_ATTRS_PER_TAG, MATRIX__ALLOWED_TAGS } from '~/constants/matrix'
import { sanitizeFormattedBody } from '~/utils/matrix/messaging'

const ALLOWED_TAGS: readonly string[] = MATRIX__ALLOWED_TAGS
const ATTRS_PER_TAG: Record<string, readonly string[] | undefined> = MATRIX__ALLOWED_ATTRS_PER_TAG

const PAYLOADS = [
  '<script>alert(1)</script>',
  '<mx-reply>quote</mx-reply><p><script>alert(1)</script></p>',
  '<img src=x onerror=alert(1)>',
  '<img src="mxc://matrix.org/a" onerror="alert(1)">',
  '<svg onload=alert(1)><script>alert(1)</script></svg>',
  '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<object data="javascript:alert(1)"></object><embed src="javascript:alert(1)">',
  '<a href="javascript:alert(1)">x</a>',
  '<a href="java&#x09;script:alert(1)">x</a>',
  '<a href="data:text/html,<script>alert(1)</script>">x</a>',
  '<p onclick="alert(1)" style="position:fixed;inset:0">x</p>',
  '<details open ontoggle="alert(1)"><summary>x</summary></details>',
  '<form action="javascript:alert(1)"><button formaction="javascript:alert(1)">x</button></form>',
  '<style>*{display:none}</style><link rel="stylesheet" href="https://evil.example/x.css">',
  '<meta http-equiv="refresh" content="0;url=javascript:alert(1)"><base href="javascript:alert(1)//">',
  '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></p></noscript>',
  '<table><td><template><img src=x onerror=alert(1)></template></td></table>',
  '<p>a<!--<img src=x onerror=alert(1)>-->b</p>',
  '<textarea><img src=x onerror=alert(1)></textarea><xmp><img src=x onerror=alert(1)></xmp>',
]

function parse(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

function expectOnlyAllowed(root: ParentNode) {
  for (const el of root.querySelectorAll('*')) {
    expect(ALLOWED_TAGS).toContain(el.localName)

    for (const { name, value } of el.attributes) {
      expect(ATTRS_PER_TAG[el.localName] ?? []).toContain(name)

      if (name === 'href')
        expect(['data:', 'javascript:', 'vbscript:']).not.toContain(new URL(value, location.href).protocol)
      if (name === 'src') expect(value).toMatch(/^mxc:\/\//)
    }
  }
}

describe('sanitizeFormattedBody', () => {
  it.each(PAYLOADS)('neutralises %s', payload => {
    expectOnlyAllowed(parse(sanitizeFormattedBody(payload)))
    expectOnlyAllowed(sanitizeFormattedBody(payload, { ADD_FORBID_CONTENTS: ['mx-reply'], RETURN_DOM: true }))
  })

  it('strips a script that follows an unwrapped element', () => {
    expect(sanitizeFormattedBody('<mx-reply>quote</mx-reply><p><script>alert(1)</script></p>')).toBe('quote<p></p>')
  })

  it('drops event handlers but keeps allowed attributes', () => {
    expect(sanitizeFormattedBody('<img src="mxc://matrix.org/a" alt="a" onerror="alert(1)">')).toBe(
      '<img src="mxc://matrix.org/a" alt="a">',
    )
    expect(sanitizeFormattedBody('<a href="https://matrix.org" onmouseover="alert(1)">x</a>')).toBe(
      '<a href="https://matrix.org">x</a>',
    )
  })

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '&#106;avascript:alert(1)',
    ' javascript:alert(1)',
    'java&#x09;script:alert(1)',
    'data:text/html,alert(1)',
    'vbscript:msgbox(1)',
  ])('drops the `%s` href', href => {
    expect(sanitizeFormattedBody(`<a href="${href}">x</a>`)).toBe('<a>x</a>')
  })

  it('only keeps mxc image sources', () => {
    expect(sanitizeFormattedBody('<img src="https://evil.example/pixel.png" alt="a">')).toBe('<img alt="a">')
  })

  it('keeps only per-tag attributes', () => {
    expect(sanitizeFormattedBody('<p style="position:fixed;inset:0" class="x">x</p>')).toBe('<p>x</p>')
    expect(
      sanitizeFormattedBody('<span data-mx-color="#ff0000" data-mx-bg-color="red" style="color:red">x</span>'),
    ).toBe('<span data-mx-color="#ff0000">x</span>')
    expect(sanitizeFormattedBody('<a href="https://matrix.org" rel="opener" title="t" target="_blank">x</a>')).toBe(
      '<a href="https://matrix.org" target="_blank">x</a>',
    )
  })

  describe('with RETURN_DOM', () => {
    it('returns the body without the reply fallback', () => {
      const body = sanitizeFormattedBody(
        '<mx-reply><blockquote>quoted</blockquote></mx-reply><p>hi <script>alert(1)</script></p>',
        { ADD_FORBID_CONTENTS: ['mx-reply'], RETURN_DOM: true },
      )

      expect(body).toBeInstanceOf(HTMLBodyElement)
      expect(body.innerHTML).toBe('<p>hi </p>')
    })

    it("can't be loosened through options", () => {
      const body = sanitizeFormattedBody('<p>x<script>alert(1)</script></p>', {
        ADD_TAGS: ['script'],
        RETURN_DOM: true,
      } as never)

      expect(body.innerHTML).toBe('<p>x</p>')
    })
  })
})
