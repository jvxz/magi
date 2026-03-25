export async function messageSw<T extends SwMessageType>(type: T, payload: SwMessagePayload<T>) {
  if (import.meta.server)
    return

  const sw = await getServiceWorker()
  if (!sw || !sw.controller)
    return

  sw.controller.postMessage({
    payload,
    type,
  })
}
