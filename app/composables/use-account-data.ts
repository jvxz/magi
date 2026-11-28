import type { MatrixEvent } from 'matrix-js-sdk'

export function useAccountData(eventTypeInput: MaybeRefOrGetter<AccountDataEvent>) {
  const eventType = toRef(eventTypeInput)
  const { client } = useMatrixClient()
  const { onAccountData } = useMatrixHooks()

  const accountData = shallowRef<MatrixEvent | undefined>(client.value.getAccountData(eventType.value as any))

  onAccountData(event => {
    if (event.getType() === eventType.value) accountData.value = event
  })

  return accountData
}
