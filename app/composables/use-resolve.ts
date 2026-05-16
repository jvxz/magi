export const useResolveRoomId = (maybeRoomOrId: MaybeRefOrGetter<MaybeRoomOrId | undefined>) =>
  computed(() => (toValue(maybeRoomOrId) ? resolveRoomId(toValue(maybeRoomOrId)!) : undefined))
export const useResolveUserId = (maybeUserId: MaybeRefOrGetter<MaybeUserOrId | undefined>) =>
  computed(() => (toValue(maybeUserId) ? resolveUserId(toValue(maybeUserId)!) : undefined))
export const useResolveEventId = (maybeEventOrId: MaybeRefOrGetter<MaybeEventOrId | undefined>) =>
  computed(() => (toValue(maybeEventOrId) ? resolveEventId(toValue(maybeEventOrId)!) : undefined))
