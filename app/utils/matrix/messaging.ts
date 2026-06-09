import type { UponSanitizeAttributeHook } from 'dompurify'

import DOMPurify from 'dompurify'

const DATA_MX_COLOR_RE = /^#[0-9a-f]{6}$/i

type RestrictedTag = keyof typeof MATRIX.MESSAGING.ALLOWED_ATTRS_PER_TAG

const sanitizeAttribute: UponSanitizeAttributeHook = (node, data) => {
  const tag = node.tagName.toLowerCase()
  const { attrName, attrValue } = data

  const allowed = (MATRIX.MESSAGING.ALLOWED_ATTRS_PER_TAG[tag as RestrictedTag] ?? []) as readonly string[]

  if (!allowed.includes(attrName)) {
    data.keepAttr = false
    return
  }

  if (attrName === 'class' && tag === 'code' && !attrValue.startsWith('language-')) data.keepAttr = false
  else if ((attrName === 'data-mx-color' || attrName === 'data-mx-bg-color') && !DATA_MX_COLOR_RE.test(attrValue))
    data.keepAttr = false
  else if (attrName === 'src' && tag === 'img' && !attrValue.startsWith('mxc://')) data.keepAttr = false
}

export function sanitizeFormattedBody(formattedBody: string) {
  DOMPurify.addHook('uponSanitizeAttribute', sanitizeAttribute)
  try {
    return DOMPurify.sanitize(formattedBody, {
      ALLOWED_ATTR: MATRIX.MESSAGING.ALLOWED_ATTRS as unknown as string[],
      ALLOWED_TAGS: MATRIX.MESSAGING.ALLOWED_TAGS as unknown as string[],
    })
  } finally {
    DOMPurify.removeHook('uponSanitizeAttribute')
  }
}
