import type { IContent, IEvent, Room, ImageContent } from 'matrix-js-sdk'
import type { RoomMemberEventContent } from 'matrix-js-sdk/lib/types'

import { EventType, KnownMembership, MatrixEvent, RelationType } from 'matrix-js-sdk'

export type FilterMatrixEventPredicate = EventType | string | ((event: MatrixEvent) => boolean)

export function filterMatrixEvents(
  events: MatrixEvent[],
  predicate: FilterMatrixEventPredicate | FilterMatrixEventPredicate[],
  exclude = true,
) {
  const predicates = Array.isArray(predicate) ? predicate : [predicate]

  const matchesAny = (event: MatrixEvent) =>
    predicates.some(p => (typeof p === 'function' ? p(event) : event.getType() === p))

  return events.filter(event => matchesAny(event) !== exclude)
}

export function isEditEvent(event: MatrixEvent) {
  return event.isRelation(RelationType.Replace)
}

export function checkReplyEvent(event: MatrixEvent) {
  return event.replyEventId !== undefined
}

export function getEventContent(event: MatrixEvent | undefined): IContent {
  if (!event) return { body: 'Could not load event content' }

  const content = event.isEncrypted() ? event.getClearContent() : event.getContent()

  if (event.isEncrypted() && content?.msgtype === 'm.bad.encrypted') return { body: 'Unable to decrypt message' }

  if (!content) return { body: 'Could not load event content' }

  return content
}

const BLOCK_TAGS = new Set([
  'body',
  'blockquote',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'ol',
  'p',
  'pre',
  'table',
  'tbody',
  'thead',
  'tr',
  'ul',
])

type AllowedTag = (typeof MATRIX__ALLOWED_TAGS)[number]

export type MessageNode =
  | { type: 'text'; value: string }
  | { type: 'emoji'; unicode: string }
  | { type: 'custom-emoji'; url: string; shortcode: string | undefined; alt: string | undefined }
  | { type: 'codeblock'; value: string; language: string | undefined }
  | { type: 'codespan'; value: string }
  | { type: 'mention'; mentionType: MentionType; value: string; text: string | undefined }
  | { type: 'link'; href: string; children: MessageNode[] }
  | {
      type: 'element'
      tag: AllowedTag
      attrs?: {
        href?: string
        target?: string
        start?: number
      }
      children: MessageNode[]
    }
  | { type: 'spoiler'; reason?: string; children: MessageNode[] }
  | { type: 'math'; latex: string; fallback: MessageNode[] }
  | { type: 'image'; mxcUrl: string; alt?: string; width?: number; height?: number }

export function splitEmojiText(text: string): MessageNode[] {
  // odd indices are always emoji unicode
  return text
    .split(REGEX__EMOJI_STRICT)
    .flatMap((part, i): MessageNode[] =>
      !part ? [] : i % 2 ? [{ type: 'emoji', unicode: part }] : [{ type: 'text', value: part }],
    )
}

const EMOJI_WRAPPER_TAGS = new Set<AllowedTag>(['p', 'span', 'div'])
export function isEmojiOnly(nodes: MessageNode[], max = 27): boolean {
  const flat = nodes
    .flatMap(n => (n.type === 'element' && EMOJI_WRAPPER_TAGS.has(n.tag) ? n.children : n))
    .filter(n => n.type !== 'text' || n.value.trim())
  return flat.length > 0 && flat.length <= max && flat.every(n => n.type === 'emoji' || n.type === 'custom-emoji')
}

export function createMessageNodes(el: HTMLElement) {
  const nodes: MessageNode[] = []

  function transform(el: HTMLElement) {
    const isBlock = BLOCK_TAGS.has(el.tagName.toLowerCase())

    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const value = node.nodeValue ?? ''
        if (isBlock && !value.trim()) continue

        nodes.push(...splitEmojiText(value))

        continue
      }

      if (!(node instanceof HTMLElement)) continue

      // codespan
      if (node.tagName.toLowerCase() === 'code') {
        nodes.push({
          type: 'codespan',
          value: node.textContent ?? '',
        })
      }

      // codeblock
      else if (node.tagName.toLowerCase() === 'pre') {
        const code = node.querySelector('code')
        nodes.push({
          language: code?.classList
            .values()
            .find(cls => cls.startsWith('language-'))
            ?.replace('language-', ''),
          type: 'codeblock',
          value: (code ?? node).textContent ?? '',
        })
      }

      // mention
      else if (node.tagName.toLowerCase() === 'a') {
        const href = decode(node.getAttribute('href') ?? '')
        const { type, value } = resolveMentionHref(href)
        if (type !== 'unknown') {
          nodes.push({
            mentionType: type,
            text: node.textContent,
            type: 'mention',
            value,
          })
        } else {
          nodes.push({
            children: createMessageNodes(node),
            href,
            type: 'link',
          })
        }
      }

      // image or custom emoji
      else if (node.tagName.toLowerCase() === 'img') {
        const src = node.getAttribute('src')
        if (!src) continue

        if (node.hasAttribute('data-mx-emoticon')) {
          const alt = node.getAttribute('alt') ?? undefined
          const shortcode = alt ?? node.getAttribute('title') ?? undefined
          nodes.push({
            alt,
            shortcode,
            type: 'custom-emoji',
            url: src,
          })
        } else {
          nodes.push({
            alt: node.getAttribute('alt') ?? undefined,
            height: Number(node.getAttribute('height')) || undefined,
            mxcUrl: src,
            type: 'image',
            width: Number(node.getAttribute('width')) || undefined,
          })
        }
      }

      // default
      else {
        nodes.push({
          attrs: readRenderAttrs(node),
          children: createMessageNodes(node),
          tag: node.tagName.toLowerCase() as AllowedTag,
          type: 'element',
        })
      }
    }
  }

  transform(el)

  return nodes
}

export function getEventChildren(room: Room, event: MaybeEventOrId) {
  if (!room) return

  const eventId = resolveEventId(event)
  if (!eventId) return

  return room.relations.getAllChildEventsForEvent(eventId)
}

export function getEventRelations(room: Room, event: MaybeEventOrId, relationType: RelationType, eventType: EventType) {
  const eventId = resolveEventId(event)
  if (!eventId) return

  const tl = room.getUnfilteredTimelineSet()

  return tl.relations.getChildEventsForEvent(eventId, relationType, eventType)
}

export type EventReactions = Map<string, { events: Set<MatrixEvent>; shortcode?: string }>
export function getEventReactions(room: Room, event: MaybeEventOrId): EventReactions | undefined {
  const reactions = getEventRelations(room, event, RelationType.Annotation, EventType.Reaction)
  const annotations = reactions?.getSortedAnnotationsByKey()
  if (!annotations) return

  const filteredAnnotations: EventReactions = new Map()
  for (const [reaction, events] of annotations) {
    if (!events.size || typeof reaction !== 'string') continue

    let shortcode: string | undefined

    const dedupedMemberEvents = new Map<string, MatrixEvent>()
    for (const event of events) {
      if (event.isRedacted()) continue

      const sender = event.getSender()
      if (!sender) continue

      if (!shortcode) {
        if (REGEX__EMOJI_STRICT.test(reaction)) {
          shortcode = getShortcodeFromUnicode(reaction)
        } else {
          const content = event.getContent<{ shortcode: string | undefined }>()
          if (content.shortcode) shortcode = content.shortcode
        }
      }

      const storedEvent = dedupedMemberEvents.get(sender)
      const storedTs = storedEvent?.getTs()
      if (isUndefined(storedTs)) dedupedMemberEvents.set(sender, event)
      else {
        if (event.getTs() > storedTs) dedupedMemberEvents.set(sender, event)
      }
    }

    if (dedupedMemberEvents.size)
      filteredAnnotations.set(reaction, { events: new Set(dedupedMemberEvents.values()), shortcode })
  }

  return filteredAnnotations
}

export function getImageBlurhash(content: ImageContent | undefined) {
  return content?.info?.['xyz.amorgan.blurhash']
}

export function isUserReacting(
  room: Room,
  event: MatrixEvent,
  user: MaybeUserOrId,
  targetReaction: string,
): MatrixEvent | undefined {
  const userId = resolveUserId(user)

  const reactions = getEventReactions(room, event)
  if (!reactions) return

  const annotation = reactions.get(targetReaction)
  if (!annotation) return

  let userReactionEvent: MatrixEvent | undefined
  annotation.events.forEach(event => {
    if (event.getSender() === userId) userReactionEvent = event
  })

  return userReactionEvent
}

export const isBadEncrypted = (event: MatrixEvent) => event.getContent().msgtype === 'm.bad.encrypted'

export function canDecryptEvent(event: MatrixEvent | Partial<IEvent> | undefined) {
  if (!event) return false

  if (event instanceof MatrixEvent) return event.shouldAttemptDecryption()

  const matrixEvent = new MatrixEvent(event)

  return matrixEvent.shouldAttemptDecryption()
}

type MembershipEventContent = Prettify<
  | MembershipEventBan
  | MembershipEventInvite
  | MembershipEventKnock
  | MembershipEventDisplayName
  | MembershipEventUnban
  | MembershipEventKick
  | MembershipEventUnknown
  | MembershipEventAvatar
  | MembershipEventLeave
  | MembershipEventJoin
>

interface MembershipEventBan {
  type: 'ban'
  data: {
    bannedId: string
    bannedName: string
    bannerId: string
    bannerName: string
  }
}

interface MembershipEventUnban {
  type: 'unban'
  data: {
    unbannedId: string
    unbannedName: string
    unbannerId: string
    unbannerName: string
  }
}

interface MembershipEventKick {
  type: 'kick'
  data: {
    kickedId: string
    kickedName: string
    kickerId: string
    kickerName: string
  }
}

interface MembershipEventDisplayName {
  type: 'displayName'
  data:
    | {
        type: 'changed'
        to: string
        from: string | undefined
        id: string
      }
    | {
        type: 'removed'
        from: string
        id: string
        name: string
      }
}

interface MembershipEventAvatar {
  type: 'avatar'
  data:
    | {
        type: 'changed'
        to: string
        from: string | undefined
        id: string
        name: string
      }
    | {
        type: 'removed'
        from: string
        id: string
        name: string
      }
}

interface MembershipEventLeave {
  type: 'leave'
  data: {
    id: string
    name: string
  }
}

interface MembershipEventJoin {
  type: 'join'
  data: {
    id: string
    name: string
  }
}

interface MembershipEventInvite {
  type: 'invite'
  data: {
    invitedId: string
    invitedName: string
    inviterId: string
    inviterName: string
  }
}

interface MembershipEventKnock {
  type: 'knock'
  data: {
    id: string
    name: string
  }
}

interface MembershipEventUnknown {
  type: 'unknown'
}

export function parseMembershipEvent(event: MatrixEvent): MembershipEventContent {
  const content = event.getContent<RoomMemberEventContent>()
  const prev = event.getPrevContent() as RoomMemberEventContent | undefined

  const sender = event.getSender()
  const subject = event.getStateKey()

  if (!sender || !subject) {
    return {
      type: 'unknown',
    }
  }

  const subjectName = content.displayname ?? getDisplayNameFallback(subject)
  const senderName = getDisplayNameFallback(sender)

  const membership = content.membership
  const prevMembership = prev?.membership

  // membership state transitions take precedence over profile changes
  if (membership !== prevMembership) {
    // ban
    if (membership === KnownMembership.Ban) {
      return {
        data: {
          bannedId: subject,
          bannedName: subjectName,
          bannerId: sender,
          bannerName: senderName,
        },
        type: 'ban',
      }
    }

    // unban (ban -> leave)
    if (membership === KnownMembership.Leave && prevMembership === KnownMembership.Ban) {
      return {
        data: {
          unbannedId: subject,
          unbannedName: subjectName,
          unbannerId: sender,
          unbannerName: senderName,
        },
        type: 'unban',
      }
    }

    // kick (leave where sender !== subject, & not an unban)
    if (membership === KnownMembership.Leave && sender !== subject) {
      return {
        data: {
          kickedId: subject,
          kickedName: subjectName,
          kickerId: sender,
          kickerName: senderName,
        },
        type: 'kick',
      }
    }

    // join
    if (membership === KnownMembership.Join) {
      return {
        data: {
          id: subject,
          name: subjectName,
        },
        type: 'join',
      }
    }

    // leave
    if (membership === KnownMembership.Leave) {
      return {
        data: {
          id: subject,
          name: subjectName,
        },
        type: 'leave',
      }
    }

    // invite
    if (membership === KnownMembership.Invite) {
      return {
        data: {
          invitedId: subject,
          invitedName: subjectName,
          inviterId: sender,
          inviterName: senderName,
        },
        type: 'invite',
      }
    }

    // knock
    if (membership === KnownMembership.Knock) {
      return {
        data: {
          id: sender,
          name: senderName,
        },
        type: 'knock',
      }
    }
  }

  // profile changes (membership stayed the same)
  if (content.displayname !== prev?.displayname) {
    if (!content.displayname && prev?.displayname) {
      return {
        data: {
          from: prev.displayname,
          id: subject,
          name: subjectName,
          type: 'removed',
        },
        type: 'displayName',
      }
    }

    // display name was added or changed from one value to another
    return {
      data: {
        from: prev?.displayname,
        id: subject,
        to: content.displayname!,
        type: 'changed',
      },
      type: 'displayName',
    }
  }

  // avatar
  if (prev?.avatar_url !== content.avatar_url) {
    if (!content.avatar_url && prev?.avatar_url) {
      return {
        data: {
          from: prev.avatar_url,
          id: subject,
          name: subjectName,
          type: 'removed',
        },
        type: 'avatar',
      }
    }

    // avatar was added or changed from one URL to another

    return {
      data: {
        from: prev?.avatar_url,
        id: subject,
        name: subjectName,
        to: content.avatar_url!,
        type: 'changed',
      },
      type: 'avatar',
    }
  }

  return {
    type: 'unknown',
  }
}

// https://github.com/cinnyapp/cinny/blob/098684973ebb28592158efa43e79741ab27afab9/src/app/utils/room.ts#L330-L334
export function trimReplyFromBody(body: string): string {
  const match = body.match(REGEX__REPLY_BODY)
  if (!match) return body

  return body.slice(match[0].length)
}

export function formatReplyPreviewBody(body: string | undefined) {
  return body?.match(REGEX__REPLY_PREVIEW_BODY)?.[1] ?? body
}

export function resolveEventId(eventOrId: MaybeEventOrId) {
  return eventOrId instanceof MatrixEvent ? eventOrId.getId() : eventOrId
}
