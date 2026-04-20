import type { EventType, IContent, IEvent } from 'matrix-js-sdk'
import type { RoomMemberEventContent } from 'matrix-js-sdk/lib/types'

import { KnownMembership, MatrixEvent } from 'matrix-js-sdk'

type Predicate = EventType | string | ((event: MatrixEvent) => boolean)

export function filterMatrixEvents(events: MatrixEvent[], predicate: Predicate) {
  const filtered: MatrixEvent[] = []

  for (const event of events) {
    if (typeof predicate === 'function' ? predicate(event) : event.getType() === predicate)
      filtered.push(event)
  }

  return filtered
}

export function isEditEvent(event: MatrixEvent) {
  const relatesTo = event.getContent()['m.relates_to']
  return relatesTo?.rel_type === 'm.replace' && !!event.getContent()['m.new_content']
}

export function checkReplyEvent(event: MatrixEvent) {
  return event.replyEventId !== undefined
}

export function getEventContent(event: MatrixEvent | undefined): IContent {
  if (!event)
    return { body: 'Could not load event content' }

  const content = event.isEncrypted() ? event.getClearContent() : event.getContent()

  if (event.isEncrypted() && content?.msgtype === 'm.bad.encrypted')
    return { body: 'Unable to decrypt message' }

  if (!content)
    return { body: 'Could not load event content' }

  return content
}

export function canDecryptEvent(event: MatrixEvent | Partial<IEvent> | undefined) {
  if (!event)
    return false

  if (event instanceof MatrixEvent)
    return event.shouldAttemptDecryption()

  const matrixEvent = new MatrixEvent(event)

  return matrixEvent.shouldAttemptDecryption()
}

type MembershipEventContent = Prettify<MembershipEventBan | MembershipEventDisplayName | MembershipEventUnban | MembershipEventUnknown | MembershipEventAvatar | MembershipEventLeave | MembershipEventJoin>

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

interface MembershipEventDisplayName {
  type: 'displayName'
  data: {
    type: 'changed'
    to: string
    from: string | undefined
    id: string
  } | {
    type: 'removed'
    from: string
    id: string
    name: string
  }
}

interface MembershipEventAvatar {
  type: 'avatar'
  data: {
    type: 'changed'
    to: string
    from: string | undefined
    id: string
    name: string
  } | {
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

  // ban
  if (content.membership === KnownMembership.Ban) {
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

  // unban
  if (prev?.membership === KnownMembership.Ban) {
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

  // displayName
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

    assert(content.displayname, 'display name is required when displayName changed')

    return {
      data: {
        from: prev?.displayname,
        id: subject,
        to: content.displayname,
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

    assert(content.avatar_url, 'avatar URL is required when avatar changed')

    return {
      data: {
        from: prev?.avatar_url,
        id: subject,
        name: subjectName,
        to: content.avatar_url,
        type: 'changed',
      },
      type: 'avatar',
    }
  }

  // join
  if (content.membership === KnownMembership.Join) {
    return {
      data: {
        id: subject,
        name: subjectName,
      },
      type: 'join',
    }
  }

  // leave
  if (content.membership === KnownMembership.Leave) {
    return {
      data: {
        id: subject,
        name: subjectName,
      },
      type: 'leave',
    }
  }

  return {
    type: 'unknown',
  }
}

// https://github.com/cinnyapp/cinny/blob/098684973ebb28592158efa43e79741ab27afab9/src/app/utils/room.ts#L330-L334
const REPLY_BODY_REG = /^> <.+?> .+\n(>.*\n)*\n/m
export function trimReplyFromBody(body: string): string {
  const match = body.match(REPLY_BODY_REG)
  if (!match)
    return body
  return body.slice(match[0].length)
}

const REPLY_PREVIEW_BODY_REG = /^(?:```[^\r\n]*\r?\n)?([^\r\n]+)/
export function formatReplyPreviewBody(body: string | undefined) {
  return body?.match(REPLY_PREVIEW_BODY_REG)?.[1] ?? body
}
