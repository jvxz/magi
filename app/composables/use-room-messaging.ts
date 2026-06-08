import { ContentHelpers } from 'matrix-js-sdk'

export function useRoomMessaging(roomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) {
  const { message } = useRoomActions(roomOrId)

  const sendTextMessage = (body: string, formattedBody: string, mentionedUserIds?: Set<string> | string[]) => {
    const content = ContentHelpers.makeHtmlMessage(body, formattedBody)

    const mentionedUserIdsArray = Array.isArray(mentionedUserIds)
      ? mentionedUserIds
      : (mentionedUserIds?.values().toArray() ?? [])

    message.mutate({
      ...content,
      'm.mentions': {
        user_ids: mentionedUserIdsArray,
      },
    })
  }

  return {
    sendTextMessage,
  }
}
