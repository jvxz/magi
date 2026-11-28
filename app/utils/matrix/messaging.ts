import type { Config, UponSanitizeAttributeHook } from 'dompurify'

import DOMPurify from 'dompurify'

import {
  MATRIX__ALLOWED_ATTRS,
  MATRIX__ALLOWED_ATTRS_PER_TAG,
  MATRIX__ALLOWED_TAGS,
  MATRIX__TO_URL,
} from '~/constants/matrix'
import { REGEX__DATA_MX_COLOR, REGEX__WHITESPACE } from '~/constants/regex'

type RestrictedTag = keyof typeof MATRIX__ALLOWED_ATTRS_PER_TAG

type DomOptions = Pick<Config, 'ADD_FORBID_CONTENTS'> & { RETURN_DOM: true }

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

export function sanitizeFormattedBody(formattedBody: string): string
export function sanitizeFormattedBody(formattedBody: string, options: DomOptions): HTMLElement
export function sanitizeFormattedBody(formattedBody: string, options?: DomOptions): string | HTMLElement {
  DOMPurify.addHook('uponSanitizeAttribute', sanitizeAttribute)
  try {
    return DOMPurify.sanitize(formattedBody, {
      ADD_FORBID_CONTENTS: options?.ADD_FORBID_CONTENTS,
      ALLOWED_ATTR: MATRIX__ALLOWED_ATTRS as unknown as string[],
      ALLOWED_TAGS: MATRIX__ALLOWED_TAGS as unknown as string[],
      RETURN_DOM: options?.RETURN_DOM,
    })
  } finally {
    DOMPurify.removeHook('uponSanitizeAttribute')
  }
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
