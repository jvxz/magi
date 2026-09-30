import type { Node } from '@tiptap/pm/model'
import type { UponSanitizeAttributeHook } from 'dompurify'
import type { MatrixClient } from 'matrix-js-sdk'

import DOMPurify from 'dompurify'


type RestrictedTag = keyof typeof MATRIX__ALLOWED_ATTRS_PER_TAG

const sanitizeAttribute: UponSanitizeAttributeHook = (node, data) => {
  const tag = node.tagName.toLowerCase()
  const { attrName, attrValue } = data

  const allowed = (MATRIX__ALLOWED_ATTRS_PER_TAG[tag as RestrictedTag] ?? []) as readonly string[]

  if (!allowed.includes(attrName)) {
    data.keepAttr = false
    return
  }

  if (attrName === 'class' && tag === 'code') {
    const classes = attrValue.split(REGEX__WHITESPACE)
    const filteredClasses = classes.filter(c => c.startsWith('language-'))

    if (!filteredClasses.length) data.keepAttr = false

    data.attrValue = filteredClasses.join(' ')
  } else if ((attrName === 'data-mx-color' || attrName === 'data-mx-bg-color') && !REGEX__DATA_MX_COLOR.test(attrValue))
    data.keepAttr = false
  else if (attrName === 'src' && tag === 'img') {
    if (attrValue.startsWith('mxc://')) data.forceKeepAttr = true
    else data.keepAttr = false
  }
}

export function sanitizeFormattedBody(formattedBody: string) {
  DOMPurify.addHook('uponSanitizeAttribute', sanitizeAttribute)
  try {
    return DOMPurify.sanitize(formattedBody, {
      ALLOWED_ATTR: MATRIX__ALLOWED_ATTRS as unknown as string[],
      ALLOWED_TAGS: MATRIX__ALLOWED_TAGS as unknown as string[],
    })
  } finally {
    DOMPurify.removeHook('uponSanitizeAttribute')
  }
}

export function docToMarkdown(doc: Node, clientForMatrixToUrls?: MatrixClient): string {
  let out = ''
  doc.descendants((node, _pos, parent) => {
    if (parent?.type.name === 'doc') return
    if (node.isText) {
      out += node.text
      return false
    }
    if (node.type.name === 'hardBreak') {
      out += '\n'
      return false
    }
    if (node.type.name === 'mention') {
      const { id, label, via } = node.attrs

      const type: MatrixToUrl['type'] = isUserId(id)
        ? 'userId'
        : isRoomAlias(id)
          ? 'roomAlias'
          : isRoomId(id)
            ? 'roomId'
            : 'unknown'

      const matrixTo = clientForMatrixToUrls
        ? getMatrixToUrl(clientForMatrixToUrls, type, id, { viaServers: via })
        : `${MATRIX__TO_URL}/#/${encodeURIComponent(id)}`
      const sigil = type === 'userId' ? '@' : '#'
      out += `[${sigil}${label}](${matrixTo})`

      return false
    }
    if (node.type.name === 'emoji') {
      out += node.attrs.unicode
      return false
    }
  })
  return out
}

const MENTION_PREFIX = `${MATRIX__TO_URL}/#/`
export type ResolvedMention =
  | {
      type: 'user'
      value: string
    }
  | {
      type: 'roomAlias'
      value: string
    }
  | {
      type: 'roomId'
      value: string
    }
  | {
      type: 'unknown'
      value: string
    }
export type MentionType = Exclude<ResolvedMention['type'], 'unknown'>

export function resolveMentionHref(href: string): ResolvedMention {
  if (!href.startsWith(MENTION_PREFIX))
    return {
      type: 'unknown',
      value: href,
    }

  const mention = href.split(MENTION_PREFIX)[1]!
  const type = isUserId(mention)
    ? 'user'
    : isRoomId(mention)
      ? 'roomId'
      : isRoomAlias(mention)
        ? 'roomAlias'
        : 'unknown'

  return {
    type,
    value: mention,
  }
}
